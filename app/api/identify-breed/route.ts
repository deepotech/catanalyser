import { NextRequest, NextResponse } from "next/server";
import { getBreedAnalysisProvider } from "@/lib/ai/breed";
import { getRateLimiter } from "@/lib/security/rate-limiter";
import { siteConfig } from "@/lib/config/site";
import { ProductionMonitor } from "@/lib/observability/monitor";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Inspect file magic bytes to prevent MIME spoofing
function validateMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG magic bytes: FF D8 FF
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (isJpeg) return true;

  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  if (isPng) return true;

  // WEBP magic bytes: RIFF (52 49 46 46) ... WEBP (57 45 42 50)
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;
  if (isRiff && isWebp) return true;

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // 0. Rate Limiting Check (Client IP identification)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimiter = getRateLimiter();
    const limitResult = await rateLimiter.check(clientIp);

    if (!limitResult.allowed) {
      return NextResponse.json(
        {
          error: `Too many analysis requests. Please wait ${limitResult.resetSeconds} seconds before trying again.`,
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
          error: "Invalid request format. Expected multipart/form-data with a cat photo.",
          status: "error",
        },
        { status: 400 }
      );
    }

    const file = formData.get("file");

    if (!file || !(file instanceof Blob) || file.size === 0) {
      return NextResponse.json(
        {
          error: "No image file provided or file is empty. Please select a photo of your cat.",
          status: "error",
        },
        { status: 400 }
      );
    }

    // 1. File Size Validation (Configurable limit from siteConfig)
    if (file.size > siteConfig.limits.maxImageBytes) {
      const maxMb = Math.round(siteConfig.limits.maxImageBytes / (1024 * 1024));
      return NextResponse.json(
        {
          error: `The uploaded photo exceeds the ${maxMb}MB size limit. Please upload a smaller image.`,
          status: "error",
        },
        { status: 413 }
      );
    }

    // 2. MIME Type Validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Unsupported file format. Please upload a JPG, PNG, or WEBP image.",
          status: "error",
        },
        { status: 415 }
      );
    }

    // 3. Convert to in-memory Buffer for inspection and AI processing (zero disk storage)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Magic Byte Verification (Prevent executable disguise)
    if (!validateMagicBytes(buffer)) {
      return NextResponse.json(
        {
          error: "Corrupted or invalid image file. Please choose an authentic JPG, PNG, or WEBP photo.",
          status: "error",
        },
        { status: 400 }
      );
    }

    // Extract sanitized safe filename for provider context
    const rawFileName = "name" in file && typeof file.name === "string" ? file.name : "cat-photo.jpg";
    const sanitizedFileName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, "");

    const startTime = Date.now();

    // 5. Invoke the Server-Side AI Provider Abstraction
    const provider = getBreedAnalysisProvider();
    const result = await provider.analyzeCatBreed({
      imageBuffer: buffer,
      fileName: sanitizedFileName,
      mimeType: file.type,
      fileSizeBytes: file.size,
    });

    const durationMs = Date.now() - startTime;
    ProductionMonitor.logEvent("info", "Breed analysis completed successfully", {
      endpoint: "/api/identify-breed",
      provider: provider.name,
      durationMs,
      httpStatus: 200,
    });

    // 6. Return normalized structured result (zero disk storage, privacy protected)
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    const { userMessage, httpStatus } = ProductionMonitor.captureError(error, {
      endpoint: "/api/identify-breed",
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
