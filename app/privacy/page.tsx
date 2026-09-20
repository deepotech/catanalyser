import { Metadata } from "next";
import Link from "next/link";
import { Shield, Eye, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { getSiteUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | CatAnalyzer",
  description:
    "Learn how CatAnalyzer handles uploaded photos, audio recordings, analytics, and third-party AI processing with full privacy transparency.",
  alternates: {
    canonical: `${getSiteUrl()}/privacy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sm:p-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to CatAnalyzer
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Last updated: September 2026 • Effective immediately
            </p>
          </div>
        </div>

        <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-6 text-stone-600">
          <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-xl text-amber-900 text-xs">
            <p className="font-semibold flex items-center gap-1.5 mb-1">
              <AlertCircle className="h-4 w-4 text-amber-700" />
              Notice on Legal Status
            </p>
            This document outlines the factual data handling practices of CatAnalyzer.com. It is provided in clear product language to help you make informed decisions regarding media uploads and AI services.
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-brand-600" />
              1. CatAnalyzer Application Storage & Media Handling
            </h2>
            <p>
              <strong>CatAnalyzer does not intentionally persist uploaded photos or audio recordings in its application databases or persistent storage disks.</strong>
            </p>
            <p>
              When you submit a cat photograph to the Breed Identifier or an audio clip to the Cat Translator:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your uploaded file is received temporarily in server memory (RAM) to inspect file size and verify authentic media signatures (magic bytes).</li>
              <li>The file is forwarded securely over encrypted HTTPS to the selected server-side AI provider for inference.</li>
              <li>Once the AI response is processed, formatted, and returned to your browser session, the server memory buffer is deallocated.</li>
              <li>CatAnalyzer does not operate user accounts, gallery archives, or user-uploaded media datastores.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <Eye className="h-4 w-4 text-brand-600" />
              2. Third-Party AI Provider Processing
            </h2>
            <p>
              To perform computer vision matching and audio acoustic interpretation, CatAnalyzer transmits uploaded media payloads to third-party artificial intelligence inference APIs:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>OpenRouter & Upstream Model Hosts:</strong> When configured, inference requests are proxied via OpenRouter to models such as Google Gemini. OpenRouter does not train models on API inputs by default under their commercial API terms, but may maintain short-term operational logs.
              </li>
              <li>
                <strong>Google Gemini API:</strong> When configured directly, requests are evaluated using Google Generative AI API endpoints according to Google Cloud data governance policies.
              </li>
            </ul>
            <p className="text-xs text-stone-500 bg-stone-100 p-3 rounded-lg">
              CatAnalyzer does not own or operate these underlying model clusters. Third-party providers operate under their respective privacy policies and security architectures. Please consult <a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">OpenRouter Privacy Policy</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Google Privacy Policy</a> for full third-party retention specifics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">
              3. Anonymous Telemetry & Analytics
            </h2>
            <p>
              We measure high-level product usage to optimize server capacity, detect outages, and improve breed guides. Telemetry collected is strictly anonymous and event-based:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Tracked events:</strong> Tool usage counts, page views, search queries in breed directories, error categories (e.g. rate limit hit, timeout).</li>
              <li><strong>Excluded data:</strong> We do NOT transmit photographs, audio samples, generated model text, or personal credentials to analytics systems.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">
              4. Cookies and Local State
            </h2>
            <p>
              CatAnalyzer does not use tracking cookies for cross-site behavioral advertising. Any local browser storage utilized is strictly functional (such as remembering your active session state or temporary audio recording preview).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">
              5. Contact Information
            </h2>
            <p>
              If you have questions, comments, or requests regarding this Privacy Policy, please contact the development team at:
            </p>
            <p className="font-mono text-xs bg-stone-100 p-2.5 rounded-lg text-stone-800">
              privacy@catanalyzer.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
