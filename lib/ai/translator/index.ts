import { TranslatorAnalysisProvider } from "./provider";
import { MockCatTranslatorProvider } from "./mock-provider";
import { GeminiCatTranslatorProvider } from "./gemini-provider";
import { OpenRouterCatTranslatorProvider } from "./openrouter-provider";

let currentTranslatorProvider: TranslatorAnalysisProvider | null = null;

/**
 * Server-side factory for selecting the Cat Translator Provider.
 *
 * PRODUCTION SAFETY RULE:
 * Production must NEVER silently fall back to Mock.
 * If AI_PROVIDER=openrouter or AI_PROVIDER=gemini is configured, missing keys
 * or provider outages will raise controlled server errors rather than generating
 * synthetic mock data.
 *
 * Mock provider is ONLY allowed when explicitly configured via AI_PROVIDER=mock.
 */
export function getCatTranslatorProvider(): TranslatorAnalysisProvider {
  if (!currentTranslatorProvider) {
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
          "[Translator Factory Error] AI_PROVIDER must be explicitly configured in production (e.g., 'openrouter' or 'gemini')."
        );
      } else {
        providerType = "mock";
      }
    }

    if (providerType === "openrouter") {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error(
          "AI service configuration error: OPENROUTER_API_KEY is not configured. Real audio analysis cannot proceed."
        );
      }
      currentTranslatorProvider = new OpenRouterCatTranslatorProvider(
        apiKey,
        process.env.OPENROUTER_MODEL
      );
    } else if (providerType === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "AI service configuration error: GEMINI_API_KEY is not configured. Real audio analysis cannot proceed."
        );
      }
      currentTranslatorProvider = new GeminiCatTranslatorProvider(
        apiKey,
        process.env.GEMINI_MODEL
      );
    } else if (providerType === "mock") {
      if (isProduction) {
        console.warn(
          "[Translator Factory Warning] CRITICAL: Running MockCatTranslatorProvider in PRODUCTION mode. Synthetic responses will be returned."
        );
      }
      currentTranslatorProvider = new MockCatTranslatorProvider();
    } else {
      throw new Error(
        `[Translator Factory Error] Unsupported AI_PROVIDER value: '${providerType}'. Valid options are 'openrouter', 'gemini', or 'mock'.`
      );
    }
  }

  return currentTranslatorProvider;
}

/**
 * Resets the translator provider singleton. Useful for testing and dynamic provider switching.
 */
export function resetCatTranslatorProvider(): void {
  currentTranslatorProvider = null;
}

export * from "./types";
export * from "./provider";
export * from "./mock-provider";
export * from "./gemini-provider";
export * from "./openrouter-provider";
