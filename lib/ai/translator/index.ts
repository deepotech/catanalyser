import { TranslatorAnalysisProvider } from "./provider";
import { MockCatTranslatorProvider } from "./mock-provider";
import { GeminiCatTranslatorProvider } from "./gemini-provider";
import { OpenRouterCatTranslatorProvider } from "./openrouter-provider";

let currentTranslatorProvider: TranslatorAnalysisProvider | null = null;

/**
 * Server-side factory for selecting the Cat Translator Provider.
 * Governed strictly by server environment variables:
 * - AI_PROVIDER: "openrouter" | "gemini" | "mock" (default: "mock")
 * - OPENROUTER_API_KEY: required when AI_PROVIDER is "openrouter"
 * - GEMINI_API_KEY: required when AI_PROVIDER is "gemini"
 */
export function getCatTranslatorProvider(): TranslatorAnalysisProvider {
  if (!currentTranslatorProvider) {
    const providerType = (process.env.AI_PROVIDER || "").toLowerCase().trim();

    if (providerType === "openrouter" || (!providerType && process.env.OPENROUTER_API_KEY)) {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        console.warn(
          "[Translator Factory Warning] AI_PROVIDER is set to 'openrouter' but OPENROUTER_API_KEY is missing. Falling back to Development Mock Provider."
        );
        currentTranslatorProvider = new MockCatTranslatorProvider();
      } else {
        currentTranslatorProvider = new OpenRouterCatTranslatorProvider(
          apiKey,
          process.env.OPENROUTER_MODEL
        );
      }
    } else if (providerType === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn(
          "[Translator Factory Warning] AI_PROVIDER is set to 'gemini' but GEMINI_API_KEY is missing. Falling back to Development Mock Provider."
        );
        currentTranslatorProvider = new MockCatTranslatorProvider();
      } else {
        currentTranslatorProvider = new GeminiCatTranslatorProvider(
          apiKey,
          process.env.GEMINI_MODEL
        );
      }
    } else {
      currentTranslatorProvider = new MockCatTranslatorProvider();
    }
  }

  return currentTranslatorProvider;
}

export * from "./types";
export * from "./provider";
export * from "./mock-provider";
export * from "./gemini-provider";
export * from "./openrouter-provider";
