"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Share2,
  ExternalLink,
  Layers,
  HelpCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { BreedAnalysisResult, MatchLevel } from "@/lib/ai/breed/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { getBreedSlug } from "@/lib/data/breeds";
import { trackEvent } from "@/lib/analytics/events";

interface AnalysisResultProps {
  result: BreedAnalysisResult;
  imagePreviewUrl: string;
  onReset: () => void;
}

export function AnalysisResultView({
  result,
  imagePreviewUrl,
  onReset,
}: AnalysisResultProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    trackEvent("breed_result_viewed", {
      analysisStatus: result.analysisStatus,
      breedId: result.primaryMatch?.breedId,
      breedName: result.primaryMatch?.breedName,
      matchLevel: result.primaryMatch?.matchLevel,
    });
  }, [result]);

  const getMatchBadgeLabel = (level?: MatchLevel) => {
    switch (level) {
      case "strong":
        return "Strong Visual Match";
      case "likely":
        return "Likely Match";
      case "possible":
        return "Possible Match";
      default:
        return "Visual Match";
    }
  };

  const getMatchBadgeVariant = (level?: MatchLevel) => {
    switch (level) {
      case "strong":
        return "success";
      case "likely":
        return "brand";
      default:
        return "neutral";
    }
  };

  const handleShare = async () => {
    const breedName = result.primaryMatch?.breedName || "Cat";
    const matchLabel = getMatchBadgeLabel(result.primaryMatch?.matchLevel);
    const text = `I analyzed my cat with CatAnalyzer.com! Result: ${breedName} (${matchLabel}).`;

    const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

    trackEvent("breed_result_shared", {
      breedName,
      shareMethod: canShare ? "native_share" : "clipboard",
    });

    if (canShare) {
      try {
        await navigator.share({
          title: "CatAnalyzer Breed Analysis",
          text,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1. Non-Cat, Insufficient Image, or Multiple Cats States
  if (
    result.analysisStatus === "not_a_cat" ||
    result.analysisStatus === "insufficient_image" ||
    result.analysisStatus === "multiple_cats"
  ) {
    const isNotCat = result.analysisStatus === "not_a_cat";
    const isMultipleCats = result.analysisStatus === "multiple_cats";

    return (
      <div className="space-y-6 animate-in fade-in-50 duration-200">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 text-center shadow-soft max-w-xl mx-auto space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60">
            {isNotCat ? (
              <HelpCircle className="h-8 w-8" />
            ) : isMultipleCats ? (
              <Layers className="h-8 w-8 text-brand-600" />
            ) : (
              <Eye className="h-8 w-8" />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-stone-900">
              {result.userGuidance?.title || "Unable to Confidently Analyze"}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {result.userGuidance?.description}
            </p>
          </div>

          {result.userGuidance?.suggestions && result.userGuidance.suggestions.length > 0 && (
            <div className="text-left rounded-2xl bg-stone-50 p-5 border border-stone-200/80 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Helpful Tips:
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

          <div className="pt-3">
            <Button size="lg" onClick={onReset} className="w-full sm:w-auto gap-2 font-semibold">
              <RefreshCw className="h-4 w-4" /> Try Another Photo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Successful Breed Result
  const primaryMatch = result.primaryMatch;
  if (!primaryMatch) return null;

  const breedSlug = getBreedSlug(primaryMatch.breedId || primaryMatch.breedName);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Dev Mode Banner */}
      {result.isDevelopmentMock && (
        <Alert variant="dev" title="Development Environment Mock Result">
          This identification was generated by the Phase 2 Development Mock Provider. It demonstrates the complete structured contract and explanation UI before external production AI keys are connected.
        </Alert>
      )}

      {/* Main Result Showcase */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Cat photo preview column */}
          <div className="relative md:col-span-5 min-h-[300px] md:min-h-[420px] bg-stone-950 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreviewUrl}
              alt="Uploaded Cat"
              className="h-full w-full object-cover max-h-[480px]"
            />
            <div className="absolute top-4 left-4">
              <Badge
                variant={getMatchBadgeVariant(primaryMatch.matchLevel)}
                className="backdrop-blur-md bg-white/95 font-semibold shadow-sm px-3 py-1 text-xs"
              >
                <Sparkles className="h-3 w-3 text-brand-600 inline mr-1" />
                {getMatchBadgeLabel(primaryMatch.matchLevel)}
              </Badge>
            </div>
          </div>

          {/* Explanation-first details column */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Your Cat Looks Most Like
              </span>

              <h2 className="mt-1 text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                {primaryMatch.breedName}
              </h2>

              {result.confidenceNote && (
                <p className="mt-1.5 text-xs text-stone-500 font-medium">
                  {result.confidenceNote}
                </p>
              )}

              {/* Why we think so (Checklist) */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Why we think so
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {primaryMatch.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3">
              <Link href={`/cat-breeds/${breedSlug}`}>
                <Button variant="primary" size="sm" className="gap-1.5 font-semibold shadow-2xs">
                  View {primaryMatch.breedName} Profile
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" />
                {copied ? "Copied Link!" : "Share Result"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  trackEvent("breed_analyze_again");
                  onReset();
                }}
                className="gap-1.5 ml-auto text-stone-600"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Analyze Another Photo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Observed Anatomical Traits Breakdown */}
      {result.observedTraits && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand-500" />
              Observed Traits in Photo
            </h3>
            <span className="text-xs text-stone-400">Phenotypic mapping</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {result.observedTraits.coat && (
              <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3.5 text-xs">
                <span className="font-bold text-stone-800 block mb-0.5">Coat & Texture</span>
                <span className="text-stone-600">{result.observedTraits.coat}</span>
              </div>
            )}
            {result.observedTraits.face && (
              <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3.5 text-xs">
                <span className="font-bold text-stone-800 block mb-0.5">Facial Structure</span>
                <span className="text-stone-600">{result.observedTraits.face}</span>
              </div>
            )}
            {result.observedTraits.ears && (
              <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3.5 text-xs">
                <span className="font-bold text-stone-800 block mb-0.5">Ears & Furnishings</span>
                <span className="text-stone-600">{result.observedTraits.ears}</span>
              </div>
            )}
            {result.observedTraits.pattern && (
              <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3.5 text-xs">
                <span className="font-bold text-stone-800 block mb-0.5">Visible Pattern</span>
                <span className="text-stone-600">{result.observedTraits.pattern}</span>
              </div>
            )}
            {result.observedTraits.eyes && (
              <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3.5 text-xs">
                <span className="font-bold text-stone-800 block mb-0.5">Eye Shape & Tilt</span>
                <span className="text-stone-600">{result.observedTraits.eyes}</span>
              </div>
            )}
            {result.observedTraits.body && (
              <div className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3.5 text-xs">
                <span className="font-bold text-stone-800 block mb-0.5">Body Build</span>
                <span className="text-stone-600">{result.observedTraits.body}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mixed Breed Assessment Card */}
      {result.mixedBreedPossible && (
        <div className="rounded-3xl border border-amber-200/90 bg-gradient-to-r from-amber-50/60 via-orange-50/40 to-amber-50/60 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-stone-900">
                Mixed-Breed Lineage Assessment
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {result.mixedBreedExplanation ||
                  "A mixed breed is possible. Visual identification cannot confirm pedigree."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Other Possible Matches */}
      {result.otherMatches && result.otherMatches.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Other Possible Breed Matches
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.otherMatches.map((other, idx) => {
              const otherSlug = getBreedSlug(other.breedId || other.breedName);
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-stone-300 transition-colors flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-stone-900 text-sm">{other.breedName}</h4>
                      <Badge variant="neutral" className="text-[10px]">
                        {getMatchBadgeLabel(other.matchLevel)}
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1">{other.reasons[0]}</p>
                  </div>
                  <Link href={`/cat-breeds/${otherSlug}`}>
                    <Button variant="ghost" size="sm" className="text-xs text-stone-600 hover:text-brand-600">
                      Learn More
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transparent Disclaimer */}
      <Alert variant="warning" title="Important AI Phenotype Disclaimer">
        {result.disclaimer}
      </Alert>
    </div>
  );
}
