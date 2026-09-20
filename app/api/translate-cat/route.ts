import { NextRequest, NextResponse } from "next/server";
import { getCatTranslatorProvider, TranslatorContext } from "@/lib/ai/translator";
import { getRateLimiter } from "@/lib/security/rate-limiter";
import { AudioFeatureExtractor } from "@/lib/audio/feature-extractor";
import { siteConfig } from "@/lib/config/site";
import { ProductionMonitor } from "@/lib/observability/monitor";

const ALLOWED_AUDIO_MIME_TYPES = [
  "audio/webm",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/ogg",
  "audio/aac",
];

const VALID_CONTEXTS: TranslatorContext[] = [
  "Looking at me",
  "Near food",
  "Near water",
  "Near the door",
  "Playing",
  "Being petted",
  "Wants attention",
  "Alone",
  "At night",
  "Near another cat",
  "Just woke up",
  "Other",
  "Not sure",
];

export async function POST(request: NextRequest) {
  try {
    // 0. Rate Limiting Check
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimiter = getRateLimiter();
    const limitResult = await rateLimiter.check(`translator_${clientIp}`);

    if (!limitResult.allowed) {
      return NextResponse.json(
        {
          error: `Too many translation requests. Please wait ${limitResult.resetSeconds} seconds before trying again.`,
          status: "error",
        },
        {
          status: 429,
          headers: {
            "Retry-After": limitResult.resetSeconds.toString(),
          },
        }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request payload. Expected multipart/form-data with an audio recording.",
          status: "error",
        },
        { status: 400 }
      );
    }

    const file = formData.get("audio");
    const rawContext = formData.get("context");
    const rawDuration = formData.get("duration");

    if (!file || !(file instanceof Blob) || file.size === 0) {
      return NextResponse.json(
        {
          error: "No audio file or recording provided or file is empty. Please record or upload a sound.",
          status: "error",
        },
        { status: 400 }
      );
    }

    // 1. File Size Validation
    if (file.size > siteConfig.limits.maxAudioBytes) {
      const maxMb = Math.round(siteConfig.limits.maxAudioBytes / (1024 * 1024));
      return NextResponse.json(
        {
          error: `Audio file exceeds the ${maxMb}MB limit. Please provide a shorter recording.`,
          status: "error",
        },
        { status: 413 }
      );
    }

    // 2. MIME Type Validation (normalize codecs suffix like "audio/webm;codecs=opus")
    const cleanMimeType = file.type.split(";")[0].toLowerCase().trim();
    if (file.type && !ALLOWED_AUDIO_MIME_TYPES.includes(cleanMimeType)) {
      return NextResponse.json(
        {
          error: `Unsupported audio format (${file.type}). Supported formats: WebM, WAV, MP3, M4A, OGG.`,
          status: "error",
        },
        { status: 415 }
      );
    }

    // 3. Convert to In-Memory Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 50) {
      return NextResponse.json(
        {
          error: "Audio recording is empty or unreadable.",
          status: "insufficient_audio",
        },
        { status: 400 }
      );
    }

    // 4. Inspect Audio Header
    AudioFeatureExtractor.inspectAudioBuffer(buffer, cleanMimeType);

    // 5. Validate & Sanitize Context
    let context: TranslatorContext = "Looking at me";
    if (typeof rawContext === "string" && VALID_CONTEXTS.includes(rawContext as TranslatorContext)) {
      context = rawContext as TranslatorContext;
    }

    const durationSeconds =
      typeof rawDuration === "string" && !isNaN(parseFloat(rawDuration))
        ? parseFloat(rawDuration)
        : undefined;

    const rawFileName = "name" in file && typeof file.name === "string" ? file.name : "cat-sound.webm";
    const sanitizedFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, "");

    const startTime = Date.now();

    // 6. Invoke Server-Side AI Translator Provider
    const provider = getCatTranslatorProvider();
    const result = await provider.analyzeCatSound({
      audioBuffer: buffer,
      fileName: sanitizedFileName,
      mimeType: cleanMimeType || "audio/webm",
      fileSizeBytes: file.size,
      context,
      audioDurationSeconds: durationSeconds,
    });

    const durationMs = Date.now() - startTime;
    ProductionMonitor.logEvent("info", "Cat sound analysis completed successfully", {
      endpoint: "/api/translate-cat",
      provider: provider.name,
      durationMs,
      httpStatus: 200,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    const { userMessage, httpStatus } = ProductionMonitor.captureError(error, {
      endpoint: "/api/translate-cat",
      httpStatus: 500,
    });

    return NextResponse.json(
      {
        error: userMessage,
        status: "error",
      },
      { status: httpStatus }
    );
  }
}
