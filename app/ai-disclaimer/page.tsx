import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft, CheckCircle2, XCircle, HeartPulse } from "lucide-react";
import { getSiteUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "AI Disclaimer & Methodology | CatAnalyzer",
  description:
    "Understand the science, limitations, and ethical guardrails behind CatAnalyzer's AI vision breed identification and cat sound interpretation.",
  alternates: {
    canonical: `${getSiteUrl()}/ai-disclaimer`,
  },
};

export default function AiDisclaimerPage() {
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
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              AI Transparency & Methodology Disclaimer
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              CatAnalyzer.com AI Ethics & Technical Principles
            </p>
          </div>
        </div>

        <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-6 text-stone-600">
          <p className="text-stone-700 leading-relaxed">
            At CatAnalyzer, we believe artificial intelligence should empower cat caregivers with greater empathy and curiosity—never false claims of scientific perfection or veterinary diagnostic certainty.
          </p>

          {/* Section 1: Breed Identifier */}
          <section className="space-y-3 pt-2 border-t border-stone-100">
            <h2 className="text-base font-semibold text-stone-900">
              1. How the AI Cat Breed Identifier Works
            </h2>
            <p>
              Our vision AI analyzes visual phenotypic markers extracted from uploaded photographs:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 my-3">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs space-y-1.5">
                <p className="font-semibold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  What the Tool Does:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-emerald-900">
                  <li>Detects visible morphological traits (coat length, ear tufts, skull shape, rosettes, point coloration).</li>
                  <li>Compares visible markers against documented breed standards.</li>
                  <li>Assigns calibrated, qualitative match confidence (Strong, Likely, Possible).</li>
                  <li>Accounts for domestic mixed-breed ancestry (over 90% of companion cats).</li>
                </ul>
              </div>
              <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl text-xs space-y-1.5">
                <p className="font-semibold text-rose-950 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  What the Tool NEVER Claims:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-rose-900">
                  <li>Cannot confirm official pedigree or certified registration papers.</li>
                  <li>Cannot determine laboratory DNA or genetic percentages.</li>
                  <li>Does NOT output fake precision percentages (e.g., &quot;87.4% Maine Coon&quot;).</li>
                  <li>Cannot diagnose health conditions or physical defects.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Cat Translator */}
          <section className="space-y-3 pt-2 border-t border-stone-100">
            <h2 className="text-base font-semibold text-stone-900">
              2. How the AI Cat Sound Interpreter Works
            </h2>
            <p>
              Feline vocalization is heavily dependent on individual temperament, social context, and environment. Our audio model evaluates:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Acoustic features:</strong> Pitch, duration, repetition, intensity, and tonal contours (short chirp, prolonged trill, low demand yowls).</li>
              <li><strong>Contextual clues:</strong> The situation selected by the caregiver (e.g., &quot;Near food&quot;, &quot;Near the door&quot;, &quot;At night&quot;).</li>
              <li><strong>Behavioral synthesis:</strong> Synthesizes the sound and context to suggest likely motivations and behavioral needs.</li>
            </ul>
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/60 rounded-xl text-amber-900 text-xs">
              <strong>Ethical Notice:</strong> Cats do not possess a formal spoken language with literal syntax. CatAnalyzer provides behavioral interpretation based on established ethological research, not literal decoding.
            </div>
          </section>

          {/* Section 3: Medical Warning */}
          <section className="space-y-3 pt-2 border-t border-stone-100 p-4 bg-rose-50/60 border border-rose-200/80 rounded-xl">
            <h2 className="text-base font-semibold text-rose-900 flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-rose-600" />
              3. Veterinary Advisory
            </h2>
            <p className="text-xs text-rose-950 leading-relaxed">
              Vocalization changes or physical changes can be early symptoms of medical issues (such as hyperthyroidism, arthritis, dental pain, urinary tract obstruction, or cognitive dysfunction). If your cat exhibits sudden distress, persistent yowling, or behavioral changes, consult a licensed veterinarian without delay.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
