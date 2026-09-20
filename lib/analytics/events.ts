export type AnalyticsEventName =
  | "breed_upload_started"
  | "breed_upload_completed"
  | "breed_analysis_started"
  | "breed_analysis_completed"
  | "breed_analysis_failed"
  | "breed_result_viewed"
  | "breed_result_shared"
  | "breed_analyze_again"
  | "translator_context_selected"
  | "translator_recording_started"
  | "translator_recording_completed"
  | "translator_audio_uploaded"
  | "translator_analysis_started"
  | "translator_analysis_completed"
  | "translator_analysis_failed"
  | "translator_result_shared"
  | "translator_recording_retried"
  | "breed_directory_viewed"
  | "breed_search_used"
  | "breed_filter_used"
  | "breed_page_viewed"
  | "breed_cta_clicked"
  | "comparison_viewed"
  | "comparison_breed_clicked";

export interface AnalyticsEventData {
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  breedId?: string;
  breedName?: string;
  breedSlug?: string;
  comparisonParam?: string;
  filterCategory?: string;
  filterValue?: string;
  searchQuery?: string;
  matchLevel?: string;
  analysisStatus?: string;
  shareMethod?: string;
  error?: string;
}

export function trackEvent(name: AnalyticsEventName, data?: AnalyticsEventData): void {
  // Privacy-first client-side event logging
  // Prepared for production analytics providers (e.g. Plausible, PostHog, GA4) without storing personal data
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Analytics Event] ${name}:`, data || {});
  }

  // Safe window event dispatch for optional future listeners
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("catanalyzer:analytics", {
        detail: { name, data, timestamp: new Date().toISOString() },
      })
    );
  }
}
