import { CatSoundAnalysisResult, AnalyzeCatSoundInput } from "./types";

export interface TranslatorAnalysisProvider {
  name: string;
  analyzeCatSound(input: AnalyzeCatSoundInput): Promise<CatSoundAnalysisResult>;
}
