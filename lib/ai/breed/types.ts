import { z } from "zod";

export type AnalysisStatus =
  | "success"
  | "not_a_cat"
  | "insufficient_image"
  | "multiple_cats"
  | "error";

export type MatchLevel = "strong" | "likely" | "possible";

export interface ObservedTraits {
  coat?: string | null;
  pattern?: string | null;
  ears?: string | null;
  face?: string | null;
  eyes?: string | null;
  body?: string | null;
}

export interface BreedMatch {
  breedId: string;
  breedName: string;
  matchLevel: MatchLevel;
  reasons: string[];
}

export interface BreedAnalysisResult {
  analysisStatus: AnalysisStatus;
  primaryMatch?: BreedMatch | null;
  otherMatches?: BreedMatch[] | null;
  mixedBreedPossible: boolean;
  mixedBreedExplanation?: string | null;
  observedTraits?: ObservedTraits | null;
  confidenceNote?: string | null;
  disclaimer: string;
  isDevelopmentMock: boolean;
  userGuidance?: {
    title: string;
    description: string;
    suggestions: string[];
  } | null;
}

export interface AnalyzeBreedInput {
  imageBuffer?: Buffer;
  base64Data?: string;
  fileName?: string;
  mimeType: string;
  fileSizeBytes: number;
}

// Zod Validation Schema for Runtime AI Output Validation
export const breedMatchSchema = z.object({
  breedId: z.string().min(1),
  breedName: z.string().min(1),
  matchLevel: z.enum(["strong", "likely", "possible"]),
  reasons: z.array(z.string()).min(1),
});

export const observedTraitsSchema = z.object({
  coat: z.string().nullable().optional(),
  pattern: z.string().nullable().optional(),
  ears: z.string().nullable().optional(),
  face: z.string().nullable().optional(),
  eyes: z.string().nullable().optional(),
  body: z.string().nullable().optional(),
});

export const userGuidanceSchema = z.object({
  title: z.string(),
  description: z.string(),
  suggestions: z.array(z.string()),
});

export const breedAnalysisResultSchema = z.object({
  analysisStatus: z.enum(["success", "not_a_cat", "insufficient_image", "multiple_cats", "error"]),
  primaryMatch: breedMatchSchema.nullable().optional(),
  otherMatches: z.array(breedMatchSchema).nullable().optional().default([]),
  mixedBreedPossible: z.boolean().default(false),
  mixedBreedExplanation: z.string().nullable().optional(),
  observedTraits: observedTraitsSchema.nullable().optional(),
  confidenceNote: z.string().nullable().optional(),
  disclaimer: z.string().default("AI visual identification is an estimate based on visible characteristics and cannot confirm pedigree."),
  isDevelopmentMock: z.boolean().default(false),
  userGuidance: userGuidanceSchema.nullable().optional(),
});
