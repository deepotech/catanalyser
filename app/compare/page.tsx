import { Metadata } from "next";
import Link from "next/link";
import { Scale, Sparkles, ArrowRight, ShieldCheck, Layers } from "lucide-react";
import { POPULAR_BREEDS, CURATED_COMPARISONS, getBreedBySlug } from "@/lib/data/breeds";
import { ComparePicker } from "@/components/compare/compare-picker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSiteUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Cat Breed Comparison Tool: Side-by-Side Breed Matchups | CatAnalyzer",
  description:
    "Compare cat breeds side-by-side. Analyze size, coat care, personality, activity level, and facial features to find the right cat or identify subtle breed differences.",
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    title: "Cat Breed Comparison Tool — Side-by-Side Trait Matrix",
    description:
      "Compare any two cat breeds side-by-side. Differentiate similar-looking breeds by muzzle shape, coat texture, vocalization, and energy levels.",
    type: "website",
  },
};

export default function CompareIndexPage() {
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cat Breed Comparison Hub | CatAnalyzer",
    description:
      "Side-by-side comparative matrices for popular and confusingly similar domestic cat breeds.",
    url: `${siteUrl}/compare`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Compare Cat Breeds",
          item: `${siteUrl}/compare`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">Compare Cat Breeds</span>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-700">
            <Scale className="h-3.5 w-3.5 text-brand-600" />
            <span>Comparative Matrix Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Compare Cat Breeds Side-by-Side
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Distinguish lookalike breeds, compare grooming routines, activity levels, and physical traits with standardized side-by-side matrices grounded in official breed standards.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Fact-Checked Standard Comparison
            </span>
            <span className="hidden sm:inline">•</span>
            <Link
              href="/cat-breeds"
              className="text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-4"
            >
              Browse all 16 breeds directory →
            </Link>
          </div>
        </div>

        {/* Interactive Breed Selector */}
        <ComparePicker breeds={POPULAR_BREEDS} />

        {/* Curated Popular Matchups */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-stone-900">
              Curated High-Interest Matchups
            </h2>
            <p className="text-sm text-stone-500">
              The most frequently confused or compared domestic cat breeds, analyzed across phenotypic markers and living requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CURATED_COMPARISONS.map((comp) => {
              const breedA = getBreedBySlug(comp.slugA);
              const breedB = getBreedBySlug(comp.slugB);
              if (!breedA || !breedB) return null;

              return (
                <Link
                  key={`${comp.slugA}-vs-${comp.slugB}`}
                  href={`/compare/${comp.slugA}-vs-${comp.slugB}`}
                  className="group block rounded-3xl border border-stone-200 bg-white p-6 hover:border-brand-300 hover:shadow-soft transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
                      {comp.title}
                    </h3>
                    <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-brand-500 group-hover:text-white transition-all shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Dual Thumbnails */}
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={breedA.imageUrl}
                        alt={breedA.name}
                        className="h-12 w-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{breedA.name}</p>
                        <p className="text-[11px] text-stone-400 truncate">{breedA.appearance.coatLength}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={breedB.imageUrl}
                        alt={breedB.name}
                        className="h-12 w-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{breedB.name}</p>
                        <p className="text-[11px] text-stone-400 truncate">{breedB.appearance.coatLength}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 pt-1 border-t border-stone-100">
                    <strong className="text-stone-800">Primary distinction:</strong>{" "}
                    {comp.highlightDifference}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Educational Callout */}
        <section className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-600" />
            <h3 className="text-base font-bold text-stone-900">
              Why Compare Cat Breeds Phenotypically?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Many domestic cats carry striking resemblances to specific breeds without full purebred documentation. Comparing head shapes, ear tufts, coat layering, and vocal temperaments helps cat owners understand their cat&apos;s likely ancestral traits, grooming necessities, and natural behavior.
          </p>
        </section>

        {/* Bottom CTA to AI Breed Identifier */}
        <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-stone-900 rounded-3xl p-8 sm:p-12 text-white shadow-soft relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>Instant AI Breed Recognition</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Can&apos;t Decide Which One Looks Like Your Cat?
            </h2>

            <p className="text-sm sm:text-base text-brand-50/90 leading-relaxed">
              Skip the manual guessing. Upload a photo to CatAnalyzer to receive an automated AI visual breakdown identifying which breed markers your cat expresses.
            </p>

            <div className="pt-2">
              <Link href="/cat-breed-identifier">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-stone-100 font-bold gap-2 shadow-md">
                  <Sparkles className="h-4 w-4 text-brand-600 fill-current" />
                  Identify My Cat
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
