import { BreedAnalysisProvider } from "./provider";
import {
  BreedAnalysisResult,
  AnalyzeBreedInput,
  breedAnalysisResultSchema,
} from "./types";
import { POPULAR_BREEDS, getBreedById, getBreedBySlug } from "@/lib/data/breeds";
import { siteConfig } from "@/lib/config/site";

export class OpenRouterBreedAnalysisProvider implements BreedAnalysisProvider {
  name = "OpenRouter Vision AI Provider";
  private apiKey: string;
  private modelName: string;
  private timeoutMs: number;

  constructor(apiKey?: string, modelName?: string, timeoutMs?: number) {
    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error(
        "OPENROUTER_API_KEY is not configured. Please set the OPENROUTER_API_KEY environment variable."
      );
    }
    this.apiKey = key;
    this.modelName = modelName || process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
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

    const mimeType = input.mimeType || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // Grounding knowledge from official breed database
    const knownBreedsSummary = POPULAR_BREEDS.map(
      (b) =>
        `- ID: "${b.id}", Name: "${b.name}", Coat: "${b.appearance.coatLength}", Key Visual Traits: [${b.keyVisualIdentifiers.join("; ")}]`
    ).join("\n");

    const systemInstruction = `You are the senior feline morphologist and computer vision expert for CatAnalyzer.com.
Your task is to analyze user-uploaded photos to identify likely cat breed matches based strictly on visible phenotypic characteristics.

CRITICAL EVALUATION & CALIBRATION RULES:
1. PHOTO SUBJECT VALIDATION:
   - If the photo is NOT of a cat (e.g. dog, human, car, scenery, furniture, food, drawing):
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
   - Use ONLY qualitative match levels: "strong", "likely", "possible".
   - "reasons" MUST contain 3 to 4 concise, verifiable bullet points describing what is visibly seen in the photo.

4. ABSOLUTE PROHIBITIONS:
   - NEVER claim laboratory or genetic certainty.
   - NEVER claim certified purebred pedigree registration.
   - NEVER attempt medical, disease, or injury diagnosis from appearance.

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
                  type: "image_url",
                  image_url: {
                    url: dataUrl,
                  },
                },
              ],
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.15,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        if (response.status === 429) {
          throw new Error("AI vision service is experiencing high traffic. Please try again in a few seconds.");
        }
        if (response.status === 401) {
          throw new Error("Invalid OpenRouter API Key. Please verify server configuration.");
        }
        console.error("[OpenRouter Error Response]:", response.status, errText);
        throw new Error(`OpenRouter API responded with status ${response.status}`);
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content?.trim() || "";

      if (!content) {
        throw new Error("Received empty response from vision model.");
      }

      let parsedData: unknown;
      try {
        parsedData = JSON.parse(content);
      } catch (jsonErr) {
        console.error("[OpenRouter Provider] Malformed JSON response:", content);
        throw new Error("Vision AI returned an unparseable response. Please try again.");
      }

      const validationResult = breedAnalysisResultSchema.safeParse(parsedData);
      if (!validationResult.success) {
        console.error("[OpenRouter Provider] Schema validation failed:", validationResult.error.format());
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
      clearTimeout(timer);
      console.error("[OpenRouter Vision Analysis Error]:", error);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("The AI image analysis timed out. Please check your connection and try again.");
        }
        return Promise.reject(error);
      }

      throw new Error("Failed to process image with vision AI provider.");
    }
  }
}
