"use client";

import * as React from "react";
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BreedAnalysisResult } from "@/lib/ai/breed/types";
import { AnalysisResultView } from "./analysis-result";
import { trackEvent } from "@/lib/analytics/events";

const ANALYSIS_MICROCOPY = [
  "Looking at coat pattern...",
  "Examining facial structure...",
  "Comparing ear shape...",
  "Analyzing body proportions...",
  "Comparing visual traits with breed profiles...",
  "Finalizing phenotypic match report...",
];

export function BreedUploadZone() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [microcopyIndex, setMicrocopyIndex] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = React.useState<BreedAnalysisResult | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  // Rotating loading microcopy
  React.useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setMicrocopyIndex((prev) => (prev + 1) % ANALYSIS_MICROCOPY.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);
    trackEvent("breed_upload_started", {
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: file.type,
    });

    // 1. Validate MIME type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const hasValidExtension = /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      setErrorMessage("Please select a supported image format: JPG, PNG, or WEBP.");
      return;
    }

    // 2. Validate Size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Photo exceeds the 10MB limit. Please choose a smaller image.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setAnalysisResult(null);

    trackEvent("breed_upload_completed", {
      fileName: file.name,
      fileSizeBytes: file.size,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile && !previewUrl) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setMicrocopyIndex(0);

    trackEvent("breed_analysis_started", {
      fileName: selectedFile?.name,
    });

    try {
      // Build secure multipart form payload for server route
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      } else if (previewUrl) {
        // For sample demo images loaded via URL: fetch blob
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        formData.append("file", blob, "demo-cat.jpg");
      }

      const response = await fetch("/api/identify-breed", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze photo. Please try again.");
      }

      setAnalysisResult(data);
      trackEvent("breed_analysis_completed", {
        analysisStatus: data.analysisStatus,
        breedName: data.primaryMatch?.breedName,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "We couldn't complete the analysis. Please check your connection and try again.";
      setErrorMessage(msg);
      trackEvent("breed_analysis_failed", { error: msg });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper to load sample test images
  const handleLoadSample = (sampleName: string, sampleUrl: string) => {
    setErrorMessage(null);
    const mockFile = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01])], `${sampleName}.jpg`, {
      type: "image/jpeg",
    });
    setSelectedFile(mockFile);
    setPreviewUrl(sampleUrl);
    setAnalysisResult(null);
  };

  return (
    <div id="breed-identifier" className="w-full">
      {/* If analysis result is available, render AnalysisResultView */}
      {analysisResult && previewUrl ? (
        <AnalysisResultView
          result={analysisResult}
          imagePreviewUrl={previewUrl}
          onReset={handleClear}
        />
      ) : (
        <Card className="border-stone-200/90 bg-white p-6 sm:p-8 shadow-soft">
          {errorMessage && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs text-rose-900 animate-in fade-in-50">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-rose-500 hover:text-rose-800 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload cat image"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Take cat photo with camera"
          />

          {!previewUrl ? (
            /* Upload Zone Drop Box */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 ${
                isDragging
                  ? "border-brand-500 bg-brand-50/50"
                  : "border-stone-300 hover:border-brand-400 bg-stone-50/40"
              }`}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft text-brand-500 border border-stone-100">
                <UploadCloud className="h-8 w-8" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                Drop your cat photo here
              </h3>
              <p className="mt-1 max-w-sm text-xs sm:text-sm text-stone-500">
                Supports JPG, PNG, or WEBP up to 10MB. Images are analyzed securely and never publicly shared.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 font-semibold shadow-sm"
                >
                  <ImageIcon className="h-4 w-4" />
                  Choose Cat Photo
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => cameraInputRef.current?.click()}
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
              </div>

              {/* Instant sample options for testing */}
              <div className="mt-8 border-t border-stone-200/60 pt-5 w-full">
                <p className="text-xs font-semibold text-stone-400 mb-2.5">
                  Try a quick example to test the analysis pipeline:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleLoadSample(
                        "maine-coon",
                        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80"
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 hover:border-brand-400 hover:text-brand-600 transition-colors shadow-2xs"
                  >
                    <span>🐱</span> Maine Coon Sample
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleLoadSample(
                        "siamese",
                        "https://images.unsplash.com/photo-1513360309081-38f07627399e?auto=format&fit=crop&w=800&q=80"
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 hover:border-brand-400 hover:text-brand-600 transition-colors shadow-2xs"
                  >
                    <span>🐾</span> Siamese Sample
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleLoadSample(
                        "dog-test",
                        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-stone-300 bg-stone-50 px-3 py-1 text-xs text-stone-500 hover:text-amber-700 hover:border-amber-400 transition-colors"
                  >
                    <span>🐶</span> Non-Cat Test
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleLoadSample(
                        "multiple-cats-test",
                        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-stone-300 bg-stone-50 px-3 py-1 text-xs text-stone-500 hover:text-brand-700 hover:border-brand-400 transition-colors"
                  >
                    <span>🐱🐱</span> Multiple Cats Test
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Image Preview & Analyze Controls */
            <div className="space-y-6">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-stone-900 shadow-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Cat photo preview"
                  className="max-h-[380px] w-full object-contain mx-auto"
                />

                {!isAnalyzing && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-stone-900/80 text-white backdrop-blur-md hover:bg-stone-900 transition-colors"
                    aria-label="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Loading State with Microcopy */}
              {isAnalyzing ? (
                <div className="rounded-2xl border border-brand-200/80 bg-brand-50/60 p-6 text-center space-y-3 animate-in fade-in-50">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-stone-800 transition-all duration-200">
                      {ANALYSIS_MICROCOPY[microcopyIndex]}
                    </p>
                    <p className="text-xs text-stone-500">
                      Extracting visual traits and comparing with breed standards...
                    </p>
                  </div>
                </div>
              ) : (
                /* Primary CTA: "Analyze My Cat" */
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleStartAnalysis}
                    className="w-full sm:w-auto gap-2 text-base font-bold shadow-md"
                  >
                    <Sparkles className="h-5 w-5 fill-current" />
                    Analyze My Cat
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto"
                  >
                    Change Photo
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
