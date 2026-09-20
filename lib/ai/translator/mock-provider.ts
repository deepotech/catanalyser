import { TranslatorAnalysisProvider } from "./provider";
import { CatSoundAnalysisResult, AnalyzeCatSoundInput } from "./types";

export class MockCatTranslatorProvider implements TranslatorAnalysisProvider {
  name = "Development Mock Cat Translator Provider";

  async analyzeCatSound(input: AnalyzeCatSoundInput): Promise<CatSoundAnalysisResult> {
    // Simulate real audio inference latency
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const fileName = (input.fileName || "").toLowerCase();
    const context = input.context || "Looking at me";

    // 1. Edge Case: Non-Cat Audio Detected
    if (
      fileName.includes("dog") ||
      fileName.includes("bark") ||
      fileName.includes("music") ||
      fileName.includes("traffic") ||
      fileName.includes("not-cat") ||
      fileName.includes("not_cat")
    ) {
      return {
        status: "not_cat_sound",
        disclaimer:
          "Cat vocalizations vary between individuals. This is an AI-assisted behavioral interpretation based on the audio and selected context, not a definitive translation.",
        isDevelopmentMock: true,
        userGuidance: {
          title: "This doesn't sound like a cat vocalization",
          description:
            "Our audio model did not detect characteristic feline vocal patterns (meows, purrs, trills, or chirps) in this recording.",
          suggestions: [
            "Ensure the microphone is positioned close to your cat when they vocalize",
            "Minimize background noise such as TVs, barking dogs, or loud traffic",
            "Try recording when your cat naturally meows or chirps at you",
          ],
        },
      };
    }

    // 2. Edge Case: Insufficient Audio (too short, silent, muffled)
    if (
      fileName.includes("silence") ||
      fileName.includes("empty") ||
      fileName.includes("quiet") ||
      fileName.includes("muffle") ||
      (input.audioDurationSeconds !== undefined && input.audioDurationSeconds < 0.4)
    ) {
      return {
        status: "insufficient_audio",
        disclaimer:
          "Cat vocalizations vary between individuals. This is an AI-assisted behavioral interpretation based on the audio and selected context, not a definitive translation.",
        isDevelopmentMock: true,
        userGuidance: {
          title: "We couldn't hear enough of the recording",
          description:
            "The audio was too quiet, brief, or muffled to isolate clear acoustic inflection contours.",
          suggestions: [
            "Hold your device closer to your cat (within 2 to 3 feet)",
            "Record at least 1 to 2 complete vocalizations",
            "Check that your microphone input volume is active",
          ],
        },
      };
    }

    // 3. Contextual Scenarios
    let primaryLabel = "Pay attention to me";
    let explanation =
      "Your cat produced a moderate-pitch meow with a rising contour while looking toward you. In feline behavior, human-directed meows with direct gaze frequently function as social requests for interaction.";
    let pitch = "Medium-to-high rising pitch";
    let repetition = "Single or spaced vocalization";
    let intensity = "Moderate";
    let pattern = "Direct solicitation meow";
    const alternatives = [
      { label: "General casual greeting", level: "possible" as const },
      { label: "Gentle reminder of their presence", level: "possible" as const },
    ];

    if (context === "Near food") {
      primaryLabel = "Anticipating meal or treats";
      explanation =
        "A rhythmic, chirpy vocal pattern recorded near the feeding station strongly correlates with nutritional solicitation. Cats often modulate higher pitch frequencies when seeking food.";
      pitch = "High-frequency upbeat inflection";
      repetition = "Rapid or repeated bursts";
      pattern = "Food anticipation solicitation";
      alternatives[0] = { label: "Request for fresh food or water", level: "possible" };
      alternatives[1] = { label: "Routine schedule reminder", level: "possible" };
    } else if (context === "Near water") {
      primaryLabel = "Curiosity about running water or fresh bowl";
      explanation =
        "Cats often produce inquisitive short chirps near sinks or water bowls, indicating interest in fresh running water or signaling an empty dish.";
      pattern = "Inquisitive tap/fountain chirp";
      alternatives[0] = { label: "Wants faucet turned on", level: "possible" };
    } else if (context === "Near the door") {
      primaryLabel = "Requesting door access or territory patrol";
      explanation =
        "A sustained vocalization with a flat terminal contour near an entryway typically signals boundary exploration or a desire to move between indoor and outdoor spaces.";
      pitch = "Sustained mid-register tone";
      pattern = "Territorial boundary solicitation";
      alternatives[0] = { label: "Inquiring about sounds on other side", level: "possible" };
    } else if (context === "Being petted") {
      primaryLabel = "Affectionate social reinforcement";
      explanation =
        "Gentle chirps or low meows during petting usually convey social contentment. However, if accompanied by quick tail twitches, it can signal mild overstimulation.";
      intensity = "Soft / gentle";
      pattern = "Affectionate communicative murmur";
      alternatives[0] = { label: "Gentle request for ear or chin scratching", level: "possible" };
      alternatives[1] = { label: "Mild sensory saturation", level: "possible" };
    } else if (context === "Playing") {
      primaryLabel = "Excited predatory play excitement";
      explanation =
        "Short staccato chattering or brisk trills during interactive play indicate high predatory arousal and playful enthusiasm.";
      pattern = "High-arousal play chirp";
      alternatives[0] = { label: "Frustration at unobtainable toy", level: "possible" };
    } else if (context === "At night") {
      primaryLabel = "Nocturnal roaming / checking household";
      explanation =
        "Nighttime meowing often corresponds to crepuscular energy peaks or solitary vocal orientation checks throughout quiet rooms.";
      pitch = "Resonant traveling call";
      alternatives[0] = { label: "Seeking human companionship in the dark", level: "possible" };
    }

    return {
      status: "success",
      primaryInterpretation: {
        label: primaryLabel,
        level: "likely",
      },
      explanation,
      alternativeInterpretations: alternatives,
      soundCharacteristics: {
        duration: input.audioDurationSeconds ? `${input.audioDurationSeconds.toFixed(1)}s` : "1.8s",
        pitch,
        repetition,
        intensity,
        pattern,
      },
      contextUsed: context,
      disclaimer:
        "Cat vocalizations vary between individuals. This is an AI-assisted behavioral interpretation based on the audio and selected context, not a definitive translation. Non-veterinary advisory.",
      isDevelopmentMock: true,
    };
  }
}
