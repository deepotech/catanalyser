"use client";

import * as React from "react";
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Share2,
  AlertTriangle,
  Info,
  HelpCircle,
  Clock,
  Activity,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { CatSoundAnalysisResult } from "@/lib/ai/translator/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { trackEvent } from "@/lib/analytics/events";

interface TranslationResultViewProps {
  result: CatSoundAnalysisResult;
  onReset: () => void;
  audioPlaybackUrl?: string | null;
}

export function TranslationResultView({
  result,
  onReset,
  audioPlaybackUrl,
}: TranslationResultViewProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    trackEvent("translator_analysis_completed", {
      analysisStatus: result.status,
    });
  }, [result]);

  const handleShare = async () => {
    const meaning = result.primaryInterpretation?.label || "Cat Vocalization";
    const text = `My cat's meow was interpreted on CatAnalyzer.com! Possible meaning: "${meaning}". Context: ${result.contextUsed || "Observed interaction"}.`;

    trackEvent("translator_result_shared", {
      shareMethod: typeof navigator !== "undefined" && typeof navigator.share === "function" ? "native_share" : "clipboard",
    });

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "CatAnalyzer Cat Sound Interpretation",
          text,
          url: window.location.href,
        });
      } catch {
        // Cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1. Error / Edge Case: Not a cat sound or insufficient audio
  if (result.status === "not_cat_sound" || result.status === "insufficient_audio") {
    const isNotCat = result.status === "not_cat_sound";
    return (
      <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 text-center shadow-soft max-w-xl mx-auto space-y-5 animate-in fade-in-50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60">
          {isNotCat ? <HelpCircle className="h-8 w-8" /> : <Volume2 className="h-8 w-8" />}
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-stone-900">
            {result.userGuidance?.title || "Unable to Confidently Interpret"}
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            {result.userGuidance?.description}
          </p>
        </div>

        {result.userGuidance?.suggestions && (
          <div className="text-left rounded-2xl bg-stone-50 p-5 border border-stone-200/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Helpful Suggestions:
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              {result.userGuidance.suggestions.map((sug, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2">
          <Button size="lg" onClick={onReset} className="w-full sm:w-auto gap-2 font-semibold">
            <RefreshCw className="h-4 w-4" /> Try Another Recording
          </Button>
        </div>
      </div>
    );
  }

  // 2. Successful Interpretation Card
  const primary = result.primaryInterpretation;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300 max-w-4xl mx-auto">
      {/* Dev Mode Banner */}
      {result.isDevelopmentMock && (
        <Alert variant="dev" title="Development Environment Mock Result">
          This interpretation was simulated by the Development Mock Provider. It demonstrates the complete structured schema and explanation interface before external multimodal AI keys are configured.
        </Alert>
      )}

      {/* Main Interpretation Card */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-soft p-6 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              Your Cat May Be Saying...
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              &ldquo;{primary?.label}&rdquo;
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <Badge
              variant={primary?.level === "likely" ? "success" : "brand"}
              className="px-3.5 py-1 text-xs font-semibold"
            >
              {primary?.level === "likely" ? "Likely Interpretation" : "Possible Interpretation"}
            </Badge>
            {result.contextUsed && (
              <span className="text-xs text-stone-500">
                Context: <strong className="text-stone-800">{result.contextUsed}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Audio Player if URL available */}
        {audioPlaybackUrl && (
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 border border-stone-200/70 p-4">
            <Volume2 className="h-5 w-5 text-brand-500 shrink-0" />
            <div className="flex-1">
              <audio controls src={audioPlaybackUrl} className="w-full h-8" />
            </div>
          </div>
        )}

        {/* Why this interpretation? */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <Info className="h-4 w-4 text-brand-500" />
            Why This Interpretation?
          </h4>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed bg-stone-50/80 p-5 rounded-2xl border border-stone-200/60">
            {result.explanation}
          </p>
        </div>

        {/* Observed Sound Characteristics */}
        {result.soundCharacteristics && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-stone-400" />
              Observed Acoustic Characteristics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {result.soundCharacteristics.duration && (
                <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-3 text-xs">
                  <span className="text-stone-400 block mb-0.5 font-medium">Duration</span>
                  <span className="font-bold text-stone-800">{result.soundCharacteristics.duration}</span>
                </div>
              )}
              {result.soundCharacteristics.pitch && (
                <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-3 text-xs">
                  <span className="text-stone-400 block mb-0.5 font-medium">Pitch Contour</span>
                  <span className="font-bold text-stone-800">{result.soundCharacteristics.pitch}</span>
                </div>
              )}
              {result.soundCharacteristics.intensity && (
                <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-3 text-xs">
                  <span className="text-stone-400 block mb-0.5 font-medium">Vocal Intensity</span>
                  <span className="font-bold text-stone-800">{result.soundCharacteristics.intensity}</span>
                </div>
              )}
              {result.soundCharacteristics.pattern && (
                <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-3 text-xs">
                  <span className="text-stone-400 block mb-0.5 font-medium">Vocal Pattern</span>
                  <span className="font-bold text-stone-800">{result.soundCharacteristics.pattern}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alternative Interpretations */}
        {result.alternativeInterpretations && result.alternativeInterpretations.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Other Plausible Interpretations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.alternativeInterpretations.map((alt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3 text-xs"
                >
                  <span className="font-medium text-stone-800">{alt.label}</span>
                  <Badge variant="neutral" className="text-[10px]">
                    Possible
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            {copied ? "Copied Link & Text!" : "Share Interpretation"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 ml-auto text-stone-600"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Record Another Sound
          </Button>
        </div>
      </div>

      {/* Responsible Non-Veterinary Disclaimer */}
      <Alert variant="warning" title="Important Ethological & Health Advisory">
        {result.disclaimer} Sudden changes in feline vocalization frequency or intense howling can occasionally correlate with physical discomfort or stress. If your cat demonstrates unusual behavior, consult a licensed veterinarian.
      </Alert>
    </div>
  );
}
