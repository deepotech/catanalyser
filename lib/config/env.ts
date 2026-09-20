import { z } from "zod";

/**
 * Server-Side Environment Variable Validation Layer
 *
 * Enforces strict typing, prevents secret leakage to client bundles,
 * and validates provider requirements based on the active runtime environment.
 */

const envSchema = z.object({
  // Runtime environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Primary AI Provider Selection: 'openrouter' | 'gemini' | 'mock'
  AI_PROVIDER: z.enum(["openrouter", "gemini", "mock"]).default("mock"),

  // Provider API Keys (server-side only, never exposed to client)
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().default("google/gemini-2.5-flash"),

  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),

  // Distributed Rate Limiting (Upstash Redis REST)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Observability & Error Monitoring
  SENTRY_DSN: z.string().optional(),

  // Site URL (safe public variable)
  NEXT_PUBLIC_SITE_URL: z.string().optional().default("https://catanalyzer.com"),

  // Tunable Limits & Timeouts
  AI_MAX_IMAGE_MB: z.coerce.number().positive().default(10),
  AI_MAX_AUDIO_MB: z.coerce.number().positive().default(10),
  AI_MAX_AUDIO_SECONDS: z.coerce.number().positive().default(15),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().positive().default(20000),

  // Rate Limiting Parameters
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().positive().default(10),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().positive().default(60),
});

export type ValidatedEnv = z.infer<typeof envSchema>;

let validatedEnvCache: ValidatedEnv | null = null;
let envValidationWarnings: string[] = [];

/**
 * Validates environment variables and checks provider prerequisites.
 * Call this on server initialization or within API route entry points.
 */
export function validateEnv(): ValidatedEnv {
  if (validatedEnvCache) {
    return validatedEnvCache;
  }

  envValidationWarnings = [];

  const parseResult = envSchema.safeParse(process.env);
  if (!parseResult.success) {
    const formattedErrors = parseResult.error.format();
    const errorDetails = Object.entries(formattedErrors)
      .filter(([key]) => key !== "_errors")
      .map(([key, val]) => `${key}: ${(val as { _errors?: string[] })._errors?.join(", ")}`)
      .join("; ");

    throw new Error(`[CatAnalyzer Env Error] Environment variable validation failed: ${errorDetails}`);
  }

  const env = parseResult.data;
  const isProduction = env.NODE_ENV === "production";

  // Check Provider-Specific Requirements
  if (env.AI_PROVIDER === "openrouter") {
    if (!env.OPENROUTER_API_KEY) {
      if (isProduction) {
        throw new Error(
          "[CatAnalyzer Env Error] AI_PROVIDER is set to 'openrouter', but OPENROUTER_API_KEY is missing in production."
        );
      } else {
        envValidationWarnings.push(
          "AI_PROVIDER='openrouter' but OPENROUTER_API_KEY is not set. Real AI requests will fail."
        );
      }
    }
  } else if (env.AI_PROVIDER === "gemini") {
    if (!env.GEMINI_API_KEY) {
      if (isProduction) {
        throw new Error(
          "[CatAnalyzer Env Error] AI_PROVIDER is set to 'gemini', but GEMINI_API_KEY is missing in production."
        );
      } else {
        envValidationWarnings.push(
          "AI_PROVIDER='gemini' but GEMINI_API_KEY is not set. Real AI requests will fail."
        );
      }
    }
  } else if (env.AI_PROVIDER === "mock") {
    if (isProduction) {
      envValidationWarnings.push(
        "CRITICAL LAUNCH WARNING: AI_PROVIDER is configured to 'mock' in a PRODUCTION environment. Synthetic responses will be returned."
      );
    }
  }

  // Check Distributed Rate Limiting Status
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    if (isProduction) {
      envValidationWarnings.push(
        "DISTRIBUTED RATE LIMITING WARNING: Upstash Redis credentials not configured. Falling back to local in-memory limiter. Multi-instance rate protection is NOT active."
      );
    }
  }

  validatedEnvCache = env;

  // Log warnings if any
  for (const warning of envValidationWarnings) {
    console.warn(`[CatAnalyzer Configuration Warning]: ${warning}`);
  }

  return validatedEnvCache;
}

/**
 * Returns any non-fatal configuration warnings detected during validation.
 */
export function getEnvWarnings(): string[] {
  if (!validatedEnvCache) {
    validateEnv();
  }
  return [...envValidationWarnings];
}
