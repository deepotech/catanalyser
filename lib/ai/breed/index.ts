import { BreedAnalysisProvider } from "./provider";
import { MockBreedAnalysisProvider } from "./mock-provider";
import { GeminiBreedAnalysisProvider } from "./gemini-provider";
import { OpenRouterBreedAnalysisProvider } from "./openrouter-provider";

let currentProvider: BreedAnalysisProvider | null = null;

/**
 * Factory for selecting the Breed Analysis Provider.
 * Provider selection is strictly SERVER-SIDE using server-only environment variables:
 * - AI_PROVIDER: "openrouter" | "gemini" | "mock" (default: "mock")
 * - OPENROUTER_API_KEY: required when AI_PROVIDER is "openrouter"
 * - GEMINI_API_KEY: required when AI_PROVIDER is "gemini"
 */
export function getBreedAnalysisProvider(): BreedAnalysisProvider {
  if (!currentProvider) {
    const providerType = (process.env.AI_PROVIDER || "").toLowerCase().trim();

    if (providerType === "openrouter" || (!providerType && process.env.OPENROUTER_API_KEY)) {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        console.warn(
          "[AI Factory Warning] AI_PROVIDER is set to 'openrouter' but OPENROUTER_API_KEY is missing. Falling back to Development Mock Provider."
        );
        currentProvider = new MockBreedAnalysisProvider();
      } else {
        currentProvider = new OpenRouterBreedAnalysisProvider(apiKey, process.env.OPENROUTER_MODEL);
      }
    } else if (providerType === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn(
          "[AI Factory Warning] AI_PROVIDER is set to 'gemini' but GEMINI_API_KEY is missing. Falling back to Development Mock Provider."
        );
        currentProvider = new MockBreedAnalysisProvider();
      } else {
        currentProvider = new GeminiBreedAnalysisProvider(apiKey, process.env.GEMINI_MODEL);
      }
    } else {
      currentProvider = new MockBreedAnalysisProvider();
    }
  }

  return currentProvider;
}

export * from "./types";
export * from "./provider";
export * from "./mock-provider";
export * from "./gemini-provider";
export * from "./openrouter-provider";
