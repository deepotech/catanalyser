import { BreedAnalysisResult, AnalyzeBreedInput } from "./types";

export interface BreedAnalysisProvider {
  name: string;
  analyzeCatBreed(input: AnalyzeBreedInput): Promise<BreedAnalysisResult>;
}
