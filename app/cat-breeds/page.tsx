import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, BookOpen } from "lucide-react";
import { POPULAR_BREEDS } from "@/lib/data/breeds";
import { BreedDirectoryClient } from "@/components/breeds/breed-directory-client";
import { Button } from "@/components/ui/button";
import { getSiteUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Cat Breed Directory: Complete Guide to 16 Cat Breeds | CatAnalyzer",
  description:
    "Explore our authoritative cat breed directory. Detailed phenotypic characteristics, coat profiles, temperament markers, care requirements, and head-to-head comparisons for 16 popular breeds.",
  alternates: {
    canonical: "/cat-breeds",
  },
  openGraph: {
    title: "Cat Breed Directory: Visual Phenotypic Profiles & Care Guides",
    description:
      "Explore 16 registered cat breeds with phenotypic markers, temperament profiles, coat traits, and side-by-side breed comparisons.",
    type: "website",
  },
};

export default function CatBreedsDirectoryPage() {
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cat Breed Directory | CatAnalyzer",
    description:
      "Authoritative reference guide to 16 cat breeds with visual phenotypic identification markers, physical dimensions, coat care, and temperament guides.",
    url: `${siteUrl}/cat-breeds`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteUrl}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Cat Breeds",
          item: `${siteUrl}/cat-breeds`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: POPULAR_BREEDS.map((breed, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: breed.name,
        url: `${siteUrl}/cat-breeds/${breed.slug}`,
        description: breed.shortDescription,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-medium">Cat Breeds</span>
        </nav>

        {/* Directory Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-700">
            <BookOpen className="h-3.5 w-3.5 text-brand-600" />
            <span>Authoritative Breed Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Cat Breed Directory
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Discover phenotypic markers, coat varieties, personality profiles, and living requirements for 16 world-renowned cat breeds. Learn how to tell them apart visually or compare them side-by-side.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Standard-Grounded Profiles
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-500" />
              AI Visual Matching Ready
            </span>
            <span className="hidden sm:inline">•</span>
            <Link
              href="/compare"
              className="text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-4"
            >
              Side-by-Side Comparisons →
            </Link>
          </div>
        </div>

        {/* Client-Side Searchable/Filterable Directory */}
        <BreedDirectoryClient breeds={POPULAR_BREEDS} />

        {/* Bottom CTA to AI Breed Identifier */}
        <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-stone-900 rounded-3xl p-8 sm:p-12 text-white shadow-soft relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>Instant AI Visual Analysis</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Can&apos;t Tell Which Breed Your Cat Is?
            </h2>

            <p className="text-sm sm:text-base text-brand-50/90 leading-relaxed">
              Most companion cats are beloved domestic shorthairs or longhairs with traits from multiple ancestral lineages. Upload a photo to scan your cat&apos;s physical markers and see which breeds they resemble most.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="/cat-breed-identifier">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-stone-100 font-bold gap-2 shadow-md">
                  <Sparkles className="h-4 w-4 text-brand-600 fill-current" />
                  Identify My Cat&apos;s Breed
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="/compare"
                className="text-sm font-semibold text-white/90 hover:text-white underline underline-offset-4 py-2"
              >
                Compare breeds side-by-side →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
