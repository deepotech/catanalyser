import { z } from "zod";

export type TranslatorContext =
  | "Looking at me"
  | "Near food"
  | "Near water"
  | "Near the door"
  | "Playing"
  | "Being petted"
  | "Wants attention"
  | "Alone"
  | "At night"
  | "Near another cat"
  | "Just woke up"
  | "Other"
  | "Not sure";

export type TranslatorStatus =
  | "success"
  | "insufficient_audio"
  | "not_cat_sound"
  | "error";

export type InterpretationLevel = "likely" | "possible";

export interface SoundCharacteristics {
  duration?: string | null;
  pitch?: string | null;
  repetition?: string | null;
  intensity?: string | null;
  pattern?: string | null;
}

export interface InterpretationItem {
  label: string;
  level: InterpretationLevel;
}

export interface CatSoundAnalysisResult {
  status: TranslatorStatus;
  primaryInterpretation?: InterpretationItem | null;
  explanation?: string | null;
  alternativeInterpretations?: InterpretationItem[] | null;
  soundCharacteristics?: SoundCharacteristics | null;
  contextUsed?: string | null;
  disclaimer: string;
  isDevelopmentMock: boolean;
  userGuidance?: {
    title: string;
    description: string;
    suggestions: string[];
  } | null;
}

export interface AnalyzeCatSoundInput {
  audioBuffer?: Buffer;
  base64Audio?: string;
  mimeType: string;
  fileSizeBytes: number;
  fileName?: string;
  context?: TranslatorContext;
  audioDurationSeconds?: number;
}

// Zod Runtime Validation Schema for AI Output
export const interpretationItemSchema = z.object({
  label: z.string().min(1),
  level: z.enum(["likely", "possible"]),
});

export const soundCharacteristicsSchema = z.object({
  duration: z.string().nullable().optional(),
  pitch: z.string().nullable().optional(),
  repetition: z.string().nullable().optional(),
  intensity: z.string().nullable().optional(),
  pattern: z.string().nullable().optional(),
});

export const translatorGuidanceSchema = z.object({
  title: z.string(),
  description: z.string(),
  suggestions: z.array(z.string()),
});

export const catSoundAnalysisResultSchema = z.object({
  status: z.enum(["success", "insufficient_audio", "not_cat_sound", "error"]),
  primaryInterpretation: interpretationItemSchema.nullable().optional(),
  explanation: z.string().nullable().optional(),
  alternativeInterpretations: z.array(interpretationItemSchema).nullable().optional().default([]),
  soundCharacteristics: soundCharacteristicsSchema.nullable().optional(),
  contextUsed: z.string().nullable().optional(),
  disclaimer: z.string().default(
    "Cat vocalizations vary between individuals. This is an AI-assisted behavioral interpretation based on the audio and selected context, not a definitive or scientific translation."
  ),
  isDevelopmentMock: z.boolean().default(false),
  userGuidance: translatorGuidanceSchema.nullable().optional(),
});
