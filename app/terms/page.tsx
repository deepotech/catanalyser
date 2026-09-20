import { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, AlertTriangle } from "lucide-react";
import { getSiteUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Terms of Service | CatAnalyzer",
  description:
    "Review the terms governing the use of CatAnalyzer.com AI cat breed identifier, cat translator, and breed directory tools.",
  alternates: {
    canonical: `${getSiteUrl()}/terms`,
  },
};

export default function TermsOfServicePage() {
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
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Last updated: September 2026 • Effective immediately
            </p>
          </div>
        </div>

        <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-6 text-stone-600">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing CatAnalyzer.com or utilizing our AI Cat Breed Identifier, Cat Translator, or Breed Directory, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the service.
            </p>
          </section>

          <section className="space-y-3 p-4 bg-rose-50/70 border border-rose-200/70 rounded-xl text-rose-950">
            <h2 className="text-base font-semibold text-rose-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              2. Strict Non-Veterinary Disclaimer
            </h2>
            <p className="text-xs leading-relaxed">
              <strong>CatAnalyzer is an educational and entertainment tool powered by machine learning algorithms. It is NOT a substitute for professional veterinary medicine, animal healthcare, or formal feline pedigree certification.</strong>
            </p>
            <p className="text-xs leading-relaxed">
              Never disregard veterinary advice or delay seeking medical attention for your cat due to information provided by this application. If your cat displays lethargy, loss of appetite, abnormal vocalizations, or signs of pain, consult a licensed veterinarian immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">
              3. AI Tool Limitations & No Accuracy Guarantees
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Breed Identifier:</strong> Evaluates visible physical traits in uploaded photos to estimate resemblance to known cat breeds. It cannot determine genetic lineage, DNA composition, or official pedigree registration (such as CFA, TICA, or FIFe).
              </li>
              <li>
                <strong>Cat Translator:</strong> Suggests behavioral possibilities based on audio acoustic characteristics and user-selected contextual clues. It is NOT a scientifically proven literal translation of feline thoughts.
              </li>
              <li>
                Results may be incomplete, ambiguous, or incorrect depending on lighting, audio quality, background noise, or mixed ancestry.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">
              4. Permissible Use & Rate Limits
            </h2>
            <p>
              Users agree to utilize CatAnalyzer only for lawful, personal purposes. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Upload malicious files, automated bot traffic, or media intended to exploit server resources.</li>
              <li>Attempt to bypass rate limits (10 requests per minute per IP address).</li>
              <li>Reverse engineer or scrape breed guide datasets for unauthorized redistribution.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">
              5. Intellectual Property
            </h2>
            <p>
              All website software, branding, UI designs, educational breed profiles, and comparison matrices are the property of CatAnalyzer.com.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-stone-900">
              6. Modifications to Service
            </h2>
            <p>
              We reserve the right to modify, suspend, or terminate service availability or rate limits at any time without prior notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
