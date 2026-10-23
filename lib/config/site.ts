/**
 * Centralized Site and Application Configuration for CatAnalyzer.com
 * Handles canonical URL resolution, payload limits, disclaimers, and timeout defaults.
 */

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  // Ignore localhost/127.0.0.1 values so a developer's .env.local does not
  // override the production canonical URL during a production build.
  const isLocalDev =
    !envUrl ||
    envUrl.includes("localhost") ||
    envUrl.includes("127.0.0.1");

  if (!isLocalDev) {
    // Strip trailing slash if present
    return envUrl!.replace(/\/+$/, "");
  }

  // Production default fallback (used when NEXT_PUBLIC_SITE_URL is absent or
  // points to localhost, as happens when building with a dev .env.local file).
  if (process.env.NODE_ENV === "production") {
    return "https://catanalyzer.com";
  }

  // Local development default
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "CatAnalyzer",
  tagline: "Understand Your Cat",
  description:
    "AI-powered cat breed identification and sound interpretation to help cat owners understand their cats through transparent, science-grounded technology.",
  url: getSiteUrl(),

  // Disclaimers
  disclaimers: {
    breed:
      "AI visual identification provides an estimate based on visible phenotypic characteristics and cannot verify official pedigree registration or genetic ancestry.",
    translator:
      "This is an AI-assisted behavioral interpretation of vocalization patterns and situational context, not a literal translation of cat language.",
    medical:
      "CatAnalyzer is not a veterinary diagnostic tool. If your cat shows signs of illness, pain, or distress, consult a licensed veterinarian immediately.",
  },

  // Limits and Cost Controls
  limits: {
    maxImageBytes: (parseInt(process.env.AI_MAX_IMAGE_MB || "10", 10) || 10) * 1024 * 1024,
    maxAudioBytes: (parseInt(process.env.AI_MAX_AUDIO_MB || "10", 10) || 10) * 1024 * 1024,
    maxAudioSeconds: parseInt(process.env.AI_MAX_AUDIO_SECONDS || "15", 10) || 15,
    requestTimeoutMs: parseInt(process.env.AI_REQUEST_TIMEOUT_MS || "20000", 10) || 20000,
    rateLimit: {
      maxRequests: 10,
      windowSeconds: 60,
    },
  },
} as const;
