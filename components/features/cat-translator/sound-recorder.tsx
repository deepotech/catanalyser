"use client";

import * as React from "react";
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  UploadCloud,
  FileAudio,
  Volume2,
  Sparkles,
  AlertCircle,
  Loader2,
  HelpCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CatSoundAnalysisResult,
  TranslatorContext,
} from "@/lib/ai/translator/types";
import { TranslationResultView } from "./translation-result";
import { trackEvent } from "@/lib/analytics/events";

const CONTEXT_CHOICES: TranslatorContext[] = [
  "Looking at me",
  "Near food",
  "Near water",
  "Near the door",
  "Playing",
  "Being petted",
  "Wants attention",
  "Alone",
  "At night",
  "Near another cat",
  "Just woke up",
  "Not sure",
  "Other",
];

const MAX_DURATION_SECONDS = 15;
const MIN_DURATION_SECONDS = 0.5;

export function SoundRecorder() {
  const [activeTab, setActiveTab] = React.useState<"record" | "upload">("record");
  const [selectedContext, setSelectedContext] = React.useState<TranslatorContext>("Looking at me");

  // Recording State
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordedBlob, setRecordedBlob] = React.useState<Blob | null>(null);
  const [playbackUrl, setPlaybackUrl] = React.useState<string | null>(null);
  const [recordDuration, setRecordDuration] = React.useState(0);
  const [isPermissionDenied, setIsPermissionDenied] = React.useState(false);

  // Analysis State
  const [isInterpreting, setIsInterpreting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = React.useState<CatSoundAnalysisResult | null>(null);

  // Refs for media stream
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Cleanup object URLs
  React.useEffect(() => {
    return () => {
      if (playbackUrl) URL.revokeObjectURL(playbackUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playbackUrl]);

  // Context selection handler
  const handleSelectContext = (ctx: TranslatorContext) => {
    setSelectedContext(ctx);
    trackEvent("translator_context_selected");
  };

  // Start Microphone Recording
  const startRecording = async () => {
    setErrorMessage(null);
    setIsPermissionDenied(false);

    if (playbackUrl) {
      URL.revokeObjectURL(playbackUrl);
      setPlaybackUrl(null);
    }
    setRecordedBlob(null);
    setAnalysisResult(null);
    setRecordDuration(0);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Your browser does not support microphone recording. Please upload an audio file instead.");
      setActiveTab("upload");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine supported mime type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        // Release tracks
        stream.getTracks().forEach((track) => track.stop());

        if (audioBlob.size > 0) {
          setRecordedBlob(audioBlob);
          const url = URL.createObjectURL(audioBlob);
          setPlaybackUrl(url);
          trackEvent("translator_recording_completed");
        }
      };

      mediaRecorder.start(250); // Collect data chunks every 250ms
      setIsRecording(true);
      trackEvent("translator_recording_started");

      // Start duration timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setRecordDuration(elapsed);

        // Auto-stop at 15s limit
        if (elapsed >= MAX_DURATION_SECONDS) {
          stopRecording();
        }
      }, 100);
    } catch (err: unknown) {
      console.warn("Microphone access error:", err);
      setIsPermissionDenied(true);
      setErrorMessage(
        "Microphone access was denied or is unavailable. You can upload an audio file instead."
      );
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Cancel / Reset
  const handleReset = () => {
    stopRecording();
    setRecordedBlob(null);
    if (playbackUrl) URL.revokeObjectURL(playbackUrl);
    setPlaybackUrl(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setRecordDuration(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    trackEvent("translator_recording_retried");
  };

  // Handle File Upload Alternative
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Audio file is larger than 10MB. Please choose a smaller recording.");
        return;
      }

      setRecordedBlob(file);
      if (playbackUrl) URL.revokeObjectURL(playbackUrl);
      const url = URL.createObjectURL(file);
      setPlaybackUrl(url);
      setAnalysisResult(null);
      trackEvent("translator_audio_uploaded");
    }
  };

  // Handle Submit
  const handleInterpret = async () => {
    if (!recordedBlob) return;

    if (activeTab === "record" && recordDuration < MIN_DURATION_SECONDS) {
      setErrorMessage("Recording was too short. Please capture at least 1 second of cat vocalization.");
      return;
    }

    setIsInterpreting(true);
    setErrorMessage(null);
    trackEvent("translator_analysis_started");

    try {
      const formData = new FormData();
      formData.append(
        "audio",
        recordedBlob,
        recordedBlob instanceof File ? recordedBlob.name : "cat-recording.webm"
      );
      formData.append("context", selectedContext);
      formData.append("duration", recordDuration.toString());

      const res = await fetch("/api/translate-cat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to interpret audio. Please try again.");
      }

      setAnalysisResult(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "We couldn't analyze the audio. Please check your network connection.";
      setErrorMessage(msg);
      trackEvent("translator_analysis_failed");
    } finally {
      setIsInterpreting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* If result is available, render TranslationResultView */}
      {analysisResult ? (
        <TranslationResultView
          result={analysisResult}
          onReset={handleReset}
          audioPlaybackUrl={playbackUrl}
        />
      ) : (
        <Card className="border-stone-200 bg-white p-6 sm:p-10 shadow-soft space-y-8">
          {/* Error Message Callout */}
          {errorMessage && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs text-rose-900 animate-in fade-in-50">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
              {isPermissionDenied && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("upload")}
                  className="text-xs bg-white"
                >
                  Upload File Instead
                </Button>
              )}
            </div>
          )}

          {/* STEP 1: Context Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white text-[11px] font-bold">
                  1
                </span>
                What was your cat doing? (Optional Context)
              </label>
              <span className="text-[11px] text-stone-400">Context improves interpretation</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {CONTEXT_CHOICES.map((ctx) => {
                const isSelected = selectedContext === ctx;
                return (
                  <button
                    key={ctx}
                    type="button"
                    onClick={() => handleSelectContext(ctx)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-brand-500 text-white border-brand-500 font-semibold shadow-2xs"
                        : "bg-stone-50/80 text-stone-600 border-stone-200 hover:border-brand-400 hover:bg-stone-100"
                    }`}
                  >
                    {ctx}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-stone-100 p-1 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab("record");
                setErrorMessage(null);
              }}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                activeTab === "record"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              🎙 Microphone
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("upload");
                setErrorMessage(null);
              }}
              className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
                activeTab === "upload"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              📁 Upload Audio
            </button>
          </div>

          {/* STEP 2: Record or Upload Area */}
          <div className="space-y-6">
            {activeTab === "record" ? (
              /* Microphone Recording Interface */
              <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border-2 border-dashed border-stone-200 bg-stone-50/40 text-center space-y-6">
                {isRecording ? (
                  /* Active Recording View */
                  <div className="space-y-4 animate-in fade-in-50">
                    <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-500 text-white shadow-soft-lg animate-pulse">
                      <Mic className="h-10 w-10 animate-bounce" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-2xl font-mono font-bold text-stone-900">
                        {recordDuration.toFixed(1)}s / {MAX_DURATION_SECONDS}s
                      </span>
                      <p className="text-xs text-rose-600 font-medium animate-pulse">
                        Listening to cat sound... Make sure cat is near device
                      </p>
                    </div>

                    {/* Animated visualizer bars */}
                    <div className="flex items-center justify-center gap-1.5 h-8">
                      {[40, 75, 95, 60, 85, 100, 70, 50, 90, 65].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-1.5 rounded-full bg-brand-500 animate-pulse transition-all duration-150"
                        />
                      ))}
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={stopRecording}
                        className="gap-2 bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        <Square className="h-4 w-4 fill-current" />
                        Stop Recording
                      </Button>
                    </div>
                  </div>
                ) : playbackUrl ? (
                  /* Recorded Sound Preview */
                  <div className="w-full max-w-md space-y-4 animate-in fade-in-50">
                    <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <Volume2 className="h-8 w-8" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-stone-900">
                        Vocalization Captured ({recordDuration.toFixed(1)}s)
                      </h4>
                      <p className="text-xs text-stone-500">
                        Listen to verify the meow is clear before analysis.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white border border-stone-200 p-3 shadow-2xs">
                      <audio controls src={playbackUrl} className="w-full h-8" />
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs text-stone-500 hover:text-stone-900 gap-1.5"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Re-record
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Initial Ready to Record View */
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="group mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-500 text-white shadow-soft transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
                      aria-label="Start recording cat sound"
                    >
                      <Mic className="h-9 w-9 transition-transform group-hover:scale-110" />
                    </button>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-stone-900">
                        Tap to Start Recording
                      </h3>
                      <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                        Capture up to 15 seconds. Bring your phone or microphone close to your cat.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Audio File Upload Interface */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border-2 border-dashed border-stone-300 hover:border-brand-400 bg-stone-50/40 text-center cursor-pointer transition-colors space-y-4"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/webm,audio/wav,audio/mpeg,audio/mp3,audio/m4a,audio/ogg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft text-brand-500 border border-stone-100">
                  <UploadCloud className="h-8 w-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-stone-900">
                    {recordedBlob ? "Audio file selected" : "Upload an audio recording"}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Supports WebM, WAV, MP3, M4A, or OGG up to 10MB.
                  </p>
                </div>

                {playbackUrl && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md pt-2"
                  >
                    <audio controls src={playbackUrl} className="w-full h-8" />
                  </div>
                )}
              </div>
            )}

            {/* Submit Action Button */}
            {playbackUrl && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={isInterpreting}
                  onClick={handleInterpret}
                  className="w-full sm:w-auto gap-2 font-bold text-base shadow-md"
                >
                  {isInterpreting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Evaluating vocalization pattern & context...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 fill-current" />
                      Interpret This Sound
                    </>
                  )}
                </Button>

                {!isInterpreting && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-stone-400 text-center leading-relaxed">
            🔒 Privacy Guarantee: Your recording is processed in memory to generate this behavioral interpretation and isn&apos;t saved as a public file.
          </p>
        </Card>
      )}
    </div>
  );
}
