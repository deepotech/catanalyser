import { GoogleGenAI } from "@google/genai";
import { BreedAnalysisProvider } from "./provider";
import {
  BreedAnalysisResult,
  AnalyzeBreedInput,
  breedAnalysisResultSchema,
} from "./types";
import { POPULAR_BREEDS, getBreedById, getBreedBySlug } from "@/lib/data/breeds";
import { siteConfig } from "@/lib/config/site";

export class GeminiBreedAnalysisProvider implements BreedAnalysisProvider {
  name = "Google Gemini Vision AI Provider";
  private client: GoogleGenAI;
  private modelName: string;
  private timeoutMs: number;

  constructor(apiKey?: string, modelName?: string, timeoutMs?: number) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error(
        "GEMINI_API_KEY is not configured. Please set the GEMINI_API_KEY environment variable."
      );
    }
    this.client = new GoogleGenAI({ apiKey: key });
    this.modelName = modelName || process.env.GEMINI_MODEL || "gemini-2.5-flash";
    this.timeoutMs = timeoutMs || siteConfig.limits.requestTimeoutMs;
  }

  async analyzeCatBreed(input: AnalyzeBreedInput): Promise<BreedAnalysisResult> {
    if (!input.imageBuffer && !input.base64Data) {
      throw new Error("Missing image payload for AI vision analysis.");
    }

    const base64Image =
      input.base64Data || input.imageBuffer?.toString("base64");
    if (!base64Image) {
      throw new Error("Unable to encode image buffer to base64.");
    }

    // Grounding knowledge from official breed database
    const knownBreedsSummary = POPULAR_BREEDS.map(
      (b) =>
        `- ID: "${b.id}", Name: "${b.name}", Coat: "${b.appearance.coatLength}", Key Visual Traits: [${b.keyVisualIdentifiers.join("; ")}]`
    ).join("\n");

    const systemInstruction = `
You are the senior feline morphologist and computer vision expert for CatAnalyzer.com.
Your task is to analyze user-uploaded photos to identify likely cat breed matches based strictly on visible phenotypic characteristics.

==================================================
CRITICAL EVALUATION & CALIBRATION RULES:
==================================================
1. PHOTO SUBJECT VALIDATION:
   - If the photo is NOT of a cat (e.g. dog, human, car, scenery, furniture, food, drawing, cartoon):
     Set "analysisStatus": "not_a_cat"
     Provide "userGuidance" explaining no feline subject was detected.
   - If the photo contains MULTIPLE CATS and it is ambiguous which cat to analyze:
     Set "analysisStatus": "multiple_cats"
     Provide "userGuidance" asking the user to upload a photo featuring a single cat.
   - If the photo is extremely blurry, too dark, heavily cropped, or lacks visible facial/body markers:
     Set "analysisStatus": "insufficient_image"
     Provide "userGuidance" with actionable photo tips.
   - If a cat is clearly visible:
     Set "analysisStatus": "success".

2. ANATOMICAL PHENOTYPE ANALYSIS:
   Examine visible physical evidence:
   - Coat: length (Shorthair, Semi-Longhair, Longhair, Hairless), density, texture, ruff.
   - Pattern: colorpoint, solid, classic/mackerel tabby, spotted rosettes, bicolor, calico.
   - Ears: size, shape, base flare, lynx tips, internal hair tufts, forward folds.
   - Face & Muzzle: head shape (wedge, round/cobby, square boxy, flat brachycephalic), cheekbones, nose profile.
   - Eyes: shape (almond, oval, round), slant, color where clearly visible.
   - Body & Tail: skeletal frame (cobby, svelte tubular, large muscular), bone structure, tail plume.

3. BREED CALIBRATION & NO FAKE PRECISION:
   - Match against our known breed taxonomy:
${knownBreedsSummary}
   - NEVER use numerical percentages (e.g. do NOT say "Maine Coon 75%").
   - Use ONLY qualitative match levels:
     * "strong": The cat exhibits distinct, unambiguous breed standard hallmarks (e.g. folded ears of Scottish Fold, rosettes of Bengal, hairlessness of Sphynx).
     * "likely": Prominent breed markers are present, though common to domestic crossbreeds.
     * "possible": Subtle phenotypic traits resemble the breed, but mixed ancestry is apparent.
   - "reasons" MUST contain 3 to 4 concise, verifiable bullet points describing what is visibly seen in the photo.

4. ABSOLUTE PROHIBITIONS:
   - NEVER claim laboratory or genetic certainty.
   - NEVER claim certified purebred pedigree registration.
   - NEVER attempt medical, disease, or injury diagnosis from appearance.
   - NEVER infer medical conditions from coat or eyes.

5. MIXED-BREED HONESTY:
   - Over 90% of domestic companion cats are mixed-breed Domestic Shorthairs or Domestic Longhairs.
   - If the cat exhibits mixed characteristics or lacks strict purebred conformation, set "mixedBreedPossible": true and explain which ancestral influences are expressed.

6. OUTPUT FORMAT:
   Return ONLY a valid JSON object matching this exact schema:
   {
     "analysisStatus": "success" | "not_a_cat" | "insufficient_image" | "multiple_cats",
     "primaryMatch": {
       "breedId": "string (lowercase slug matching taxonomy)",
       "breedName": "string",
       "matchLevel": "strong" | "likely" | "possible",
       "reasons": ["verifiable visible reason 1", "verifiable visible reason 2", "verifiable visible reason 3"]
     },
     "otherMatches": [
       {
         "breedId": "string",
         "breedName": "string",
         "matchLevel": "likely" | "possible",
         "reasons": ["reason"]
       }
     ],
     "mixedBreedPossible": boolean,
     "mixedBreedExplanation": "string explaining blended ancestral influences",
     "observedTraits": {
       "coat": "description of coat in photo",
       "pattern": "description of pattern in photo",
       "ears": "description of ears in photo",
       "face": "description of head/muzzle in photo",
       "eyes": "description of eyes in photo",
       "body": "description of body build in photo"
     },
     "confidenceNote": "string summarizing visual match confidence",
     "disclaimer": "AI visual identification is an estimate based on visible characteristics and cannot confirm pedigree.",
     "userGuidance": {
       "title": "string (only if not_a_cat, multiple_cats, or insufficient_image)",
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
                  mimeType: input.mimeType || "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.15,
        },
      });

      const response = await Promise.race([apiCallPromise, timeoutPromise]);

      const responseText = response.text?.trim() || "";
      if (!responseText) {
        throw new Error("Received empty response from vision model.");
      }

      // Parse JSON safely
      let parsedData: unknown;
      try {
        parsedData = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error("[Gemini Provider] Malformed JSON response:", responseText);
        throw new Error("Vision AI returned an unparseable response. Please try again.");
      }

      // Strict Zod runtime schema validation
      const validationResult = breedAnalysisResultSchema.safeParse(parsedData);
      if (!validationResult.success) {
        console.error("[Gemini Provider] Schema validation failed:", validationResult.error.format());
        throw new Error("AI output did not adhere to required quality standards.");
      }

      const result = validationResult.data;

      // Normalize breed identifiers against canonical taxonomy
      if (result.primaryMatch) {
        const canonical =
          getBreedById(result.primaryMatch.breedId) ||
          getBreedBySlug(result.primaryMatch.breedId) ||
          POPULAR_BREEDS.find(
            (b) => b.name.toLowerCase() === result.primaryMatch?.breedName.toLowerCase()
          );
        if (canonical) {
          result.primaryMatch.breedId = canonical.slug;
          result.primaryMatch.breedName = canonical.name;
        }
      }

      if (result.otherMatches && result.otherMatches.length > 0) {
        result.otherMatches = result.otherMatches.map((match) => {
          const canonical =
            getBreedById(match.breedId) ||
            getBreedBySlug(match.breedId) ||
            POPULAR_BREEDS.find(
              (b) => b.name.toLowerCase() === match.breedName.toLowerCase()
            );
          if (canonical) {
            return {
              ...match,
              breedId: canonical.slug,
              breedName: canonical.name,
            };
          }
          return match;
        });
      }

      return {
        ...result,
        isDevelopmentMock: false,
      };
    } catch (error: unknown) {
      console.error("[Gemini Vision Analysis Error]:", error);

      if (error instanceof Error) {
        if (error.message === "AI_REQUEST_TIMEOUT") {
          throw new Error("The AI image analysis timed out. Please check your connection and try again.");
        }
        if (error.message.includes("429") || error.message.toLowerCase().includes("quota")) {
          throw new Error("AI vision service is experiencing high traffic. Please try again in a few seconds.");
        }
        if (error.message.includes("API key")) {
          throw new Error("Server AI provider authentication failed. Please verify server configuration.");
        }
        throw error;
      }

      throw new Error("Failed to process image with vision AI provider.");
    }
  }
}
