"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mic,
  Volume2,
  Sparkles,
  Info,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getCatTranslatorProvider,
  CatSoundAnalysisResult,
  TranslatorContext,
} from "@/lib/ai/translator";

const CONTEXT_OPTIONS: TranslatorContext[] = [
  "Looking at me",
  "Near food",
  "Near the door",
  "Playing",
  "Being petted",
  "At night",
];

export function CatTranslatorTeaser() {
  const [selectedContext, setSelectedContext] =
    React.useState<TranslatorContext>("Looking at me");
  const [isRecording, setIsRecording] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [translationResult, setTranslationResult] =
    React.useState<CatSoundAnalysisResult | null>(null);

  const handleSimulateRecord = () => {
    setIsRecording(true);
    setTranslationResult(null);

    // Simulate 2.5 seconds of sound capture
    setTimeout(() => {
      setIsRecording(false);
      handleRunInterpretation();
    }, 2500);
  };

  const handleRunInterpretation = async () => {
    setIsAnalyzing(true);
    try {
      const provider = getCatTranslatorProvider();
      const result = await provider.analyzeCatSound({
        mimeType: "audio/webm",
        fileSizeBytes: 15000,
        fileName: "simulated_meow.webm",
        context: selectedContext,
        audioDurationSeconds: 1.6,
      });
      setTranslationResult(result);
    } catch {
      // Handled gracefully
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setTranslationResult(null);
    setIsRecording(false);
    setIsAnalyzing(false);
  };

  return (
    <section id="cat-translator" className="w-full py-16 sm:py-24 bg-stone-900 text-white rounded-3xl sm:rounded-4xl px-6 sm:px-12 my-12 overflow-hidden relative">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <Badge variant="dev" className="bg-brand-500/20 text-brand-300 border-brand-500/30">
            <Sparkles className="h-3 w-3 inline mr-1" />
            Bioacoustic Behavioral AI
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cat Translator & Sound Interpreter
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300 leading-relaxed">
            Record your cat&apos;s meow or chirp to explore probabilistic interpretations based on acoustic pitch, burst cadence, and behavioral context.
          </p>

          <div className="pt-2">
            <Link href="/cat-translator">
              <Button size="md" className="gap-2 font-semibold shadow-md bg-brand-500 hover:bg-brand-600 text-white">
                Launch Full Cat Translator Tool
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interaction Column */}
          <div className="lg:col-span-6 bg-stone-800/80 backdrop-blur-sm border border-stone-700/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2.5">
                Step 1: What was your cat doing? (Context)
              </label>
              <div className="flex flex-wrap gap-2">
                {CONTEXT_OPTIONS.map((ctx) => (
                  <button
                    key={ctx}
                    type="button"
                    onClick={() => setSelectedContext(ctx)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                      selectedContext === ctx
                        ? "bg-brand-500 text-white border-brand-400 font-semibold"
                        : "bg-stone-700/50 text-stone-300 border-stone-600 hover:border-stone-500"
                    }`}
                  >
                    {ctx}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-700/70 pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-3">
                Step 2: Capture Vocalization Preview
              </label>

              {isRecording ? (
                <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-stone-900/60 border border-brand-500/40 text-center space-y-3 animate-pulse">
                  <div className="h-14 w-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Mic className="h-7 w-7 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-rose-300">
                      Listening to cat vocalization...
                    </span>
                    <p className="text-xs text-stone-400 mt-0.5">Capturing frequency contour</p>
                  </div>
                </div>
              ) : isAnalyzing ? (
                <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-stone-900/60 border border-stone-700 text-center space-y-3">
                  <Loader2 className="h-8 w-8 text-brand-400 animate-spin" />
                  <span className="text-sm font-semibold text-stone-200">
                    Extracting pitch cadence & behavioral correlation...
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={handleSimulateRecord}
                      className="flex-1 gap-2 font-semibold shadow-md"
                    >
                      <Mic className="h-5 w-5" />
                      Test Recording
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleRunInterpretation}
                      className="bg-stone-700/40 border-stone-600 text-stone-200 hover:bg-stone-700"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Test Sample Meow
                    </Button>
                  </div>
                  <p className="text-[11px] text-stone-400 text-center">
                    Simulated preview. For live microphone audio recording, visit the full tool.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6">
            {translationResult && translationResult.primaryInterpretation ? (
              <div className="bg-stone-800/90 border border-stone-700 rounded-3xl p-6 sm:p-8 space-y-5 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    Possible Interpretation
                  </span>
                  <Badge variant="dev" className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                    {translationResult.primaryInterpretation.level === "likely"
                      ? "Likely Interpretation"
                      : "Possible Interpretation"}
                  </Badge>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-700/60">
                  <p className="text-xl font-bold text-white leading-snug">
                    &ldquo;{translationResult.primaryInterpretation.label}&rdquo;
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Observed context: <span className="text-brand-300 font-medium">{translationResult.contextUsed}</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-brand-400" />
                    Why this interpretation?
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/50 p-3 rounded-xl border border-stone-700/60">
                    {translationResult.explanation}
                  </p>
                </div>

                {/* Alternate Possibilities */}
                {translationResult.alternativeInterpretations && translationResult.alternativeInterpretations.length > 0 && (
                  <div className="border-t border-stone-700/70 pt-3 space-y-1">
                    <h5 className="text-xs font-semibold text-stone-400 mb-1.5">
                      Other possible meanings:
                    </h5>
                    {translationResult.alternativeInterpretations.map((alt, i) => (
                      <div key={i} className="text-xs text-stone-300 flex justify-between gap-2">
                        <span>• {alt.label}</span>
                        <span className="text-stone-400 text-[11px]">({alt.level})</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-stone-700/70">
                  <Link href="/cat-translator" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold">
                    Open in Full Tool <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-stone-300 hover:text-white hover:bg-stone-700/50 text-xs gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Reset
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full rounded-3xl border border-dashed border-stone-700 p-8 flex flex-col items-center justify-center text-center space-y-3 text-stone-400 min-h-[300px]">
                <Volume2 className="h-10 w-10 text-stone-600" />
                <h4 className="font-semibold text-stone-300 text-sm">
                  Ready for Sound Interpretation
                </h4>
                <p className="text-xs max-w-sm leading-relaxed text-stone-400">
                  Click &ldquo;Test Recording&rdquo; or try the sample meow to test the bioacoustic model preview.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
