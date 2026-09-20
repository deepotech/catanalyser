import { BreedAnalysisProvider } from "./provider";
import { MockBreedAnalysisProvider } from "./mock-provider";
import { GeminiBreedAnalysisProvider } from "./gemini-provider";
import { OpenRouterBreedAnalysisProvider } from "./openrouter-provider";

let currentProvider: BreedAnalysisProvider | null = null;

/**
 * Server-side Factory for selecting the Breed Analysis Provider.
 *
 * PRODUCTION SAFETY RULE:
 * Production must NEVER silently fall back to Mock.
 * If AI_PROVIDER=openrouter or AI_PROVIDER=gemini is configured, missing keys
 * or provider outages will raise controlled server errors rather than generating
 * synthetic mock data.
 *
 * Mock provider is ONLY allowed when explicitly configured via AI_PROVIDER=mock.
 */
export function getBreedAnalysisProvider(): BreedAnalysisProvider {
  if (!currentProvider) {
    const isProduction = process.env.NODE_ENV === "production";
    const rawProviderType = (process.env.AI_PROVIDER || "").toLowerCase().trim();

    // Default determination
    let providerType = rawProviderType;
    if (!providerType) {
      if (process.env.OPENROUTER_API_KEY) {
        providerType = "openrouter";
      } else if (process.env.GEMINI_API_KEY) {
        providerType = "gemini";
      } else if (isProduction) {
        throw new Error(
          "[AI Factory Error] AI_PROVIDER must be explicitly configured in production (e.g., 'openrouter' or 'gemini')."
        );
      } else {
        providerType = "mock";
      }
    }

    if (providerType === "openrouter") {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error(
          "AI service configuration error: OPENROUTER_API_KEY is not configured. Real vision AI cannot proceed."
        );
      }
      currentProvider = new OpenRouterBreedAnalysisProvider(
        apiKey,
        process.env.OPENROUTER_MODEL
      );
    } else if (providerType === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "AI service configuration error: GEMINI_API_KEY is not configured. Real vision AI cannot proceed."
        );
      }
      currentProvider = new GeminiBreedAnalysisProvider(
        apiKey,
        process.env.GEMINI_MODEL
      );
    } else if (providerType === "mock") {
      if (isProduction) {
        console.warn(
          "[AI Factory Warning] CRITICAL: Running MockBreedAnalysisProvider in PRODUCTION mode. Synthetic responses will be returned."
        );
      }
      currentProvider = new MockBreedAnalysisProvider();
    } else {
      throw new Error(
        `[AI Factory Error] Unsupported AI_PROVIDER value: '${providerType}'. Valid options are 'openrouter', 'gemini', or 'mock'.`
      );
    }
  }

  return currentProvider;
}

/**
 * Resets the provider singleton. Useful for testing and dynamic provider switching.
 */
export function resetBreedAnalysisProvider(): void {
  currentProvider = null;
}

export * from "./types";
export * from "./provider";
export * from "./mock-provider";
export * from "./gemini-provider";
export * from "./openrouter-provider";
