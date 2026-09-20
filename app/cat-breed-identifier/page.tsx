import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Camera,
  Layers,
  ShieldCheck,
  Eye,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Info,
} from "lucide-react";
import { BreedUploadZone } from "@/components/features/breed-upload/upload-zone";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { POPULAR_BREEDS } from "@/lib/data/breeds";

export const metadata: Metadata = {
  title: "AI Cat Breed Identifier — What Breed Is My Cat? | CatAnalyzer",
  description:
    "Upload a photo of your cat and use AI to identify likely breed matches based on visible traits, appearance, and characteristics. Free, fast, and transparent.",
  alternates: {
    canonical: "/cat-breed-identifier",
  },
  openGraph: {
    title: "AI Cat Breed Identifier — Discover Your Cat's Likely Breed",
    description:
      "Upload a photo to discover your cat's most likely breed matches, visible anatomical traits, and mixed-breed ancestry.",
    url: "/cat-breed-identifier",
  },
};

export default function CatBreedIdentifierPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CatAnalyzer AI Cat Breed Identifier",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Upload a photo of your cat to discover likely breed matches based on physical phenotypic traits and vision neural networks.",
  };

  return (
    <div className="flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero & Tool Area */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-16">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">Cat Breed Identifier</span>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <Badge variant="brand" className="px-3.5 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 mr-1 inline fill-current" />
            AI Vision Breed Recognition
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 leading-tight">
            AI Cat Breed Identifier — <span className="text-brand-500">What Breed Is My Cat?</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Upload a photo of your cat and use AI to identify likely breed matches based on visible traits, anatomical structure, and coat patterns.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="max-w-4xl mx-auto">
          <BreedUploadZone />
        </div>
      </section>

      {/* Trait Identification Guide */}
      <section className="w-full bg-stone-100/70 border-y border-stone-200/70 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
            <Badge variant="neutral">Phenotypic Science</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              How Visual AI Identifies Cat Breeds
            </h2>
            <p className="text-sm text-stone-600">
              Unlike simplistic tools that return arbitrary percentages, our vision pipeline extracts specific anatomical indicators:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-stone-200 p-6 space-y-2">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                Cranial & Muzzle Geometry
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Evaluates head shape—from the square boxy jaw of the Maine Coon, to the flat profile of the Persian, to the wedge head of the Siamese.
              </p>
            </Card>

            <Card className="bg-white border-stone-200 p-6 space-y-2">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                Coat Density & Undercoat
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Analyzes hair shaft length, presence of water-resistant guard hairs, chest ruff, and distinctive colorpoint or tabby rosette distributions.
              </p>
            </Card>

            <Card className="bg-white border-stone-200 p-6 space-y-2">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
                Ear Placement & Furnishings
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Detects lynx tips, internal ear hair tufts, forward ear folding, and base flare angles that distinguish ancient and modern breeds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Mixed Breed Advice */}
      <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-amber-200/90 bg-gradient-to-r from-amber-50/50 via-orange-50/30 to-amber-50/50 p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                Understanding Mixed-Breed Cats
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Why most cats share traits with multiple lineages
              </p>
            </div>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">
            Over 90% of companion cats are Domestic Shorthairs or Domestic Longhairs—wonderful cats whose ancestors interbred naturally. When you analyze a rescue or mixed-breed cat, CatAnalyzer focuses on showing which ancestral breed traits are visibly expressed, rather than falsely diagnosing a purebred pedigree.
          </p>
        </div>
      </section>

      {/* Explore Popular Breeds */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Browse Cat Breed Standards
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Explore profiles of recognized breeds
            </p>
          </div>
          <Link href="/#popular-breeds" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_BREEDS.slice(0, 4).map((b) => (
            <Link
              key={b.id}
              href={`/cat-breeds/${b.slug}`}
              className="group block rounded-2xl border border-stone-200 bg-white p-4 hover:border-brand-400 hover:shadow-soft transition-all"
            >
              <h4 className="font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
                {b.name}
              </h4>
              <span className="text-xs text-stone-400 block mt-0.5">{b.origin} • {b.coatLength}</span>
              <p className="text-xs text-stone-500 mt-2 line-clamp-2">{b.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
