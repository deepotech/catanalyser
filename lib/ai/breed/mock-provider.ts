import { BreedAnalysisProvider } from "./provider";
import { BreedAnalysisResult, AnalyzeBreedInput } from "./types";

export class MockBreedAnalysisProvider implements BreedAnalysisProvider {
  name = "Development Mock Breed Provider";

  async analyzeCatBreed(input: AnalyzeBreedInput): Promise<BreedAnalysisResult> {
    // Simulate real AI network and inference latency
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const fileName = (input.fileName || "").toLowerCase();

    // 1. Edge Case: Simulated Provider Failure
    if (fileName.includes("error") || fileName.includes("fail")) {
      throw new Error("AI provider encountered an unexpected timeout during vision inference.");
    }

    // 2. Edge Case: Non-Cat Image Detected
    if (
      fileName.includes("dog") ||
      fileName.includes("car") ||
      fileName.includes("not-cat") ||
      fileName.includes("not_cat") ||
      fileName.includes("chair")
    ) {
      return {
        analysisStatus: "not_a_cat",
        mixedBreedPossible: false,
        disclaimer:
          "AI visual identification is an estimate based on visible characteristics and cannot confirm pedigree.",
        isDevelopmentMock: true,
        userGuidance: {
          title: "This doesn't appear to be a cat",
          description:
            "Our vision model did not detect recognizable feline facial contours, ear structures, or anatomical markers in this photo.",
          suggestions: [
            "Upload a photo where your cat is clearly visible in the frame",
            "Ensure the subject is a cat rather than another household pet or object",
            "Avoid extreme close-ups of just fur or distant background shots",
          ],
        },
      };
    }

    // 2.5 Edge Case: Multiple Cats Detected
    if (
      fileName.includes("multiple") ||
      fileName.includes("two-cats") ||
      fileName.includes("two_cats") ||
      fileName.includes("group")
    ) {
      return {
        analysisStatus: "multiple_cats",
        mixedBreedPossible: false,
        disclaimer:
          "AI visual identification is an estimate based on visible characteristics and cannot confirm pedigree.",
        isDevelopmentMock: true,
        userGuidance: {
          title: "Multiple cats detected in photo",
          description:
            "Our vision model detected more than one cat in this image. For an accurate phenotypic match, please upload a photo featuring a single cat.",
          suggestions: [
            "Upload a photo showing only the cat you wish to identify",
            "Crop the photo to focus on one cat's face and body",
            "Avoid photos of litters or multiple pets in the same frame",
          ],
        },
      };
    }

    // 3. Edge Case: Insufficient Visual Evidence (Blurry, Dark, Low Clarity)
    if (
      fileName.includes("blur") ||
      fileName.includes("dark") ||
      fileName.includes("poor") ||
      fileName.includes("low-res")
    ) {
      return {
        analysisStatus: "insufficient_image",
        mixedBreedPossible: false,
        disclaimer:
          "AI visual identification is an estimate based on visible characteristics and cannot confirm pedigree.",
        isDevelopmentMock: true,
        userGuidance: {
          title: "We couldn't confidently analyze this photo",
          description:
            "The photo quality or angle does not provide enough clear visual evidence to evaluate breed-defining traits.",
          suggestions: [
            "Try a clearer photo taken in natural daytime light",
            "Make sure the cat's face and body proportions are visible",
            "Avoid very dark, backlit, or heavily blurred photos",
          ],
        },
      };
    }

    // 4. Scenario: Siamese / Colorpoint Detection
    if (fileName.includes("siamese") || fileName.includes("point")) {
      return {
        analysisStatus: "success",
        primaryMatch: {
          breedId: "siamese",
          breedName: "Siamese",
          matchLevel: "strong",
          reasons: [
            "Distinctive colorpoint gradient on ears, mask, paws, and tail",
            "Sleek, elongated tubular body frame with fine bone structure",
            "Deep almond-shaped blue eyes and modified wedge head contour",
            "Fine, glossy short coat lying close to the torso",
          ],
        },
        otherMatches: [
          {
            breedId: "oriental-shorthair",
            breedName: "Oriental Shorthair",
            matchLevel: "possible",
            reasons: ["Shares identical wedge facial contour and large flaring ear base."],
          },
          {
            breedId: "balinese",
            breedName: "Balinese",
            matchLevel: "possible",
            reasons: ["Shares colorpoint dilution, although coat in photo appears closer to shorthair."],
          },
        ],
        mixedBreedPossible: true,
        mixedBreedExplanation:
          "While physical markers strongly indicate colorpoint lineage, many Domestic Shorthairs carry colorpoint genes. Pedigree certification cannot be established from photo evidence alone.",
        observedTraits: {
          coat: "Short, sleek, close-lying with minimal undercoat",
          pattern: "Colorpoint dilution with darker extremities",
          ears: "Large, pointed, wide at the base continuing wedge profile",
          face: "Refined triangular muzzle contour with straight nose bridge",
          eyes: "Almond-shaped, pronounced oriental slant, deep blue hue",
          body: "Medium-sized, svelte, muscular and lithe tubular frame",
        },
        confidenceNote:
          "High visual alignment with standardized Siamese breed specifications.",
        disclaimer:
          "AI visual identification is an estimate based on visible characteristics and cannot confirm pedigree.",
        isDevelopmentMock: true,
      };
    }

    // 5. Default Scenario: Maine Coon / Domestic Longhair blend
    return {
      analysisStatus: "success",
      primaryMatch: {
        breedId: "maine-coon",
        breedName: "Maine Coon",
        matchLevel: "strong",
        reasons: [
          "Prominent tufted lynx tips on large, tall ears with inner furnishings",
          "Thick, shaggy semi-long coat with heavier frontal chest ruff",
          "Substantial bone structure and broad, square muzzle geometry",
          "Long, heavily plumed bushy tail",
        ],
      },
      otherMatches: [
        {
          breedId: "norwegian-forest-cat",
          breedName: "Norwegian Forest Cat",
          matchLevel: "possible",
          reasons: ["Similar dense double coat and almond eyes, though head shape differs slightly."],
        },
        {
          breedId: "ragdoll",
          breedName: "Ragdoll",
          matchLevel: "possible",
          reasons: ["Large body frame and plush semi-long coat texture."],
        },
      ],
      mixedBreedPossible: true,
      mixedBreedExplanation:
        "A mixed breed is possible. Your cat exhibits signature Maine Coon physical markers, but Domestic Longhair ancestry is very common and can produce nearly identical rustic traits. Visual identification cannot confirm pedigree.",
      observedTraits: {
        coat: "Long, shaggy, dense water-resistant double coat with ruff",
        pattern: "Classic tabby markings with warm undercoat tones",
        ears: "Large, well-tufted lynx tips with protective internal ear furnishings",
        face: "Broad cheekbones with distinct square muzzle outline",
        eyes: "Large, slightly oval with an open alert expression",
        body: "Substantial, muscular, rectangular torso with sturdy legs",
      },
      confidenceNote:
        "Strong visual concordance with Maine Coon morphological indicators.",
      disclaimer:
        "AI visual identification is an estimate based on visible characteristics and cannot confirm pedigree.",
      isDevelopmentMock: true,
    };
  }
}
