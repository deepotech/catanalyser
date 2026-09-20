import { TranslatorAnalysisProvider } from "./provider";
import {
  CatSoundAnalysisResult,
  AnalyzeCatSoundInput,
  catSoundAnalysisResultSchema,
} from "./types";
import { siteConfig } from "@/lib/config/site";

export class OpenRouterCatTranslatorProvider implements TranslatorAnalysisProvider {
  name = "OpenRouter Multimodal Audio Provider";
  private apiKey: string;
  private modelName: string;
  private timeoutMs: number;

  constructor(apiKey?: string, modelName?: string, timeoutMs?: number) {
    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error(
        "OPENROUTER_API_KEY is not configured for audio translation."
      );
    }
    this.apiKey = key;
    this.modelName = modelName || process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
    this.timeoutMs = timeoutMs || siteConfig.limits.requestTimeoutMs;
  }

  async analyzeCatSound(input: AnalyzeCatSoundInput): Promise<CatSoundAnalysisResult> {
    if (!input.audioBuffer && !input.base64Audio) {
      throw new Error("No audio payload supplied for sound interpretation.");
    }

    const base64Data =
      input.base64Audio || input.audioBuffer?.toString("base64");
    if (!base64Data) {
      throw new Error("Unable to encode audio stream into base64.");
    }

    const contextGiven = input.context || "Not sure / Unspecified";

    // Determine clean audio format for input_audio
    let audioFormat = "wav";
    const mime = (input.mimeType || "").toLowerCase();
    if (mime.includes("mp3") || mime.includes("mpeg")) audioFormat = "mp3";
    else if (mime.includes("ogg")) audioFormat = "ogg";
    else if (mime.includes("webm")) audioFormat = "webm";
    else if (mime.includes("wav")) audioFormat = "wav";

    const systemInstruction = `You are a senior feline ethologist and bioacoustics AI interpreter for CatAnalyzer.com.
Your task is to analyze user-recorded cat audio combined with situational context to provide responsible, probable behavioral interpretations.

CRITICAL ETHOLOGICAL & RESPONSIBILITY RULES:
1. NO PSEUDO-SCIENCE & NO LITERAL TRANSLATION:
   - Cats do NOT possess human-like grammar or literal words.
   - Do NOT produce anthropomorphic quotes (e.g. do NOT say "I WANT SALMON NOW").
   - Frame outputs as behavioral interpretations: "Likely solicitation for food or treats", "Possible interaction or attention request", "Casual social greeting".
   - NEVER invent fake calibrated metrics (e.g., "78% affection" or "Exact pitch: 612 Hz").

2. AUDIO SUBJECT VALIDATION:
   - If the audio contains NO cat vocalization (e.g. dog barking, human speech only, music, engine/traffic noise):
     Set "status": "not_cat_sound".
     Provide "userGuidance" explaining no feline vocalization was detected.
   - If the audio is silent, too faint, heavily clipped, or under 0.4 seconds of usable sound:
     Set "status": "insufficient_audio".
     Provide "userGuidance" with recording tips.
   - If a cat vocalization is heard:
     Set "status": "success".

3. CONTEXT INTEGRATION:
   User reported situation: "${contextGiven}".
   - Combine the acoustic contour with the situational context.
   - Explicitly note in "contextUsed" how the situation informed the interpretation.

4. MEDICAL & PAIN SAFETY BOUNDARY:
   - NEVER attempt to diagnose illness, pain, disease, or medical conditions.
   - If vocalizations suggest acute distress, yowling, or possible pain, provide a neutral recommendation to consult a licensed veterinarian rather than speculating.

5. OUTPUT FORMAT:
   Return ONLY a valid JSON object strictly matching this schema:
   {
     "status": "success" | "insufficient_audio" | "not_cat_sound",
     "primaryInterpretation": {
       "label": "string (e.g. 'Pay attention to me' or 'Requesting food/treats')",
       "level": "likely" | "possible"
     },
     "explanation": "string explaining how sound characteristics and context correlate to this behavior",
     "alternativeInterpretations": [
       { "label": "string", "level": "possible" }
     ],
     "soundCharacteristics": {
       "duration": "approximate duration e.g. '1.5s' or 'Short burst'",
       "pitch": "qualitative e.g. 'Rising pitch' or 'High frequency chirp'",
       "repetition": "e.g. 'Single call' or 'Repeated rhythmic bursts'",
       "intensity": "e.g. 'Soft', 'Moderate', or 'Urgent'",
       "pattern": "e.g. 'Human-directed solicitation meow' or 'Contentment trill'"
     },
     "contextUsed": "${contextGiven}",
     "disclaimer": "This is an AI-assisted behavioral interpretation of vocalization patterns and situational context, not a literal translation of cat language.",
     "userGuidance": {
       "title": "string (only if not_cat_sound or insufficient_audio)",
       "description": "string",
       "suggestions": ["tip 1", "tip 2"]
     }
   }`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    if (timer.unref) timer.unref();

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://catanalyzer.com",
          "X-Title": "CatAnalyzer",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: systemInstruction },
                {
                  type: "input_audio",
                  input_audio: {
                    data: base64Data,
                    format: audioFormat,
                  },
                },
              ],
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Audio analysis service is currently busy. Please try again shortly.");
        }
        if (response.status === 401) {
          throw new Error("Invalid OpenRouter API Key for audio analysis.");
        }
        throw new Error(`OpenRouter API responded with status ${response.status}`);
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content?.trim() || "";

      if (!content) {
        throw new Error("Received empty response from multimodal audio model.");
      }

      let parsedData: unknown;
      try {
        parsedData = JSON.parse(content);
      } catch (jsonErr) {
        console.error("[OpenRouter Audio Provider] Malformed JSON response:", content);
        throw new Error("Audio AI returned an unparseable response. Please try again.");
      }

      const validated = catSoundAnalysisResultSchema.safeParse(parsedData);
      if (!validated.success) {
        console.error("[OpenRouter Audio Provider] Schema validation failed:", validated.error.format());
        throw new Error("AI output failed to meet required structure standards.");
      }

      return {
        ...validated.data,
        isDevelopmentMock: false,
      };
    } catch (error: unknown) {
      clearTimeout(timer);
      console.error("[OpenRouter Audio Analysis Error]:", error);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("The audio interpretation timed out. Please try again with a shorter recording.");
        }
        return Promise.reject(error);
      }

      throw new Error("Failed to interpret audio recording.");
    }
  }
}
