import { GoogleGenAI } from "@google/genai";
import { TranslatorAnalysisProvider } from "./provider";
import {
  CatSoundAnalysisResult,
  AnalyzeCatSoundInput,
  catSoundAnalysisResultSchema,
} from "./types";
import { siteConfig } from "@/lib/config/site";

export class GeminiCatTranslatorProvider implements TranslatorAnalysisProvider {
  name = "Google Gemini Multimodal Audio Provider";
  private client: GoogleGenAI;
  private modelName: string;
  private timeoutMs: number;

  constructor(apiKey?: string, modelName?: string, timeoutMs?: number) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error(
        "GEMINI_API_KEY is not configured for audio translation."
      );
    }
    this.client = new GoogleGenAI({ apiKey: key });
    this.modelName = modelName || process.env.GEMINI_MODEL || "gemini-2.5-flash";
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

    const systemInstruction = `
You are a senior feline ethologist and bioacoustics AI interpreter for CatAnalyzer.com.
Your task is to analyze user-recorded cat audio combined with situational context to provide responsible, probable behavioral interpretations.

==================================================
CRITICAL ETHOLOGICAL & RESPONSIBILITY RULES:
==================================================
1. NO PSEUDO-SCIENCE & NO LITERAL TRANSLATION:
   - Cats do NOT possess human-like grammar or literal spoken words.
   - Do NOT produce anthropomorphic quotes (e.g. do NOT say "I WANT SALMON NOW").
   - Frame outputs as behavioral interpretations: "Likely solicitation for food or treats", "Possible interaction or attention request", "Casual social greeting", "Mild territorial or play arousal".
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

3. CONTEXT INTEGRATION (Context Matters Greatly!):
   User reported situation: "${contextGiven}".
   - Combine the acoustic contour (rising, flat, chirping, sustained, trill) with the situational context.
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
   }
`;

    try {
      // Setup timeout race to guarantee AI request never hangs indefinitely
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("AI_REQUEST_TIMEOUT"));
        }, this.timeoutMs);
        if (timer.unref) timer.unref();
      });

      const apiCallPromise = this.client.models.generateContent({
        model: this.modelName,
        contents: [
          {
            role: "user",
            parts: [
              { text: systemInstruction },
              {
                inlineData: {
                  mimeType: input.mimeType || "audio/mp3",
                  data: base64Data,
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const response = await Promise.race([apiCallPromise, timeoutPromise]);

      const responseText = response.text?.trim() || "";
      if (!responseText) {
        throw new Error("Received empty response from multimodal audio model.");
      }

      let parsedData: unknown;
      try {
        parsedData = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error("[Gemini Audio Provider] Malformed JSON response:", responseText);
        throw new Error("Audio AI returned an unparseable response. Please try again.");
      }

      const validated = catSoundAnalysisResultSchema.safeParse(parsedData);
      if (!validated.success) {
        console.error("[Gemini Audio Provider] Schema validation failed:", validated.error.format());
        throw new Error("AI output failed to meet required structure standards.");
      }

      return {
        ...validated.data,
        isDevelopmentMock: false,
      };
    } catch (error: unknown) {
      console.error("[Gemini Audio Analysis Error]:", error);

      if (error instanceof Error) {
        if (error.message === "AI_REQUEST_TIMEOUT") {
          throw new Error("The audio interpretation timed out. Please try again with a shorter recording.");
        }
        if (error.message.includes("429") || error.message.toLowerCase().includes("quota")) {
          throw new Error("Audio analysis service is currently busy. Please try again shortly.");
        }
        throw error;
      }

      throw new Error("Failed to interpret audio recording.");
    }
  }
}
