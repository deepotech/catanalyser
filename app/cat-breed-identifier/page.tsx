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
  Scale,
  Volume2,
  HelpCircle,
} from "lucide-react";
import { BreedUploadZone } from "@/components/features/breed-upload/upload-zone";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { POPULAR_BREEDS, CURATED_COMPARISONS } from "@/lib/data/breeds";
import { getSiteUrl } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "AI Cat Breed Identifier by Photo: Free Visual Breed Scanner | CatAnalyzer",
  description:
    "Upload a photo to identify your cat's likely breed matches with AI. Scan facial structure, coat patterns, and ear shape with transparent trait explanations.",
  alternates: {
    canonical: "/cat-breed-identifier",
  },
  openGraph: {
    title: "AI Cat Breed Identifier by Photo — Free Visual Breed Scanner",
    description:
      "Upload a cat photo to discover likely breed matches, visible anatomical traits, and mixed-breed ancestry explanations.",
    url: "/cat-breed-identifier",
  },
};

const IDENTIFIER_FAQS = [
  {
    question: "How accurate is AI visual cat breed identification compared to a DNA test?",
    answer:
      "AI visual identification provides a phenotypic estimate based on visible physical characteristics (head shape, ear placement, coat pattern, and body build). It is not a genetic DNA test or pedigree certificate. While DNA tests analyze ancestral genetics from saliva or blood samples, our AI evaluates what your cat visibly looks like compared to established breed standards.",
  },
  {
    question: "Can this tool identify mixed-breed cats and domestic shorthairs?",
    answer:
      "Yes. Over 90% of companion cats are Domestic Shorthairs or Domestic Longhairs with mixed ancestry. CatAnalyzer identifies which ancestral breed traits your cat visibly expresses—such as a Maine Coon muzzle, Siamese color points, or American Shorthair tabby markings—and provides a dedicated mixed-breed lineage explanation rather than falsely claiming a purebred pedigree.",
  },
  {
    question: "What kind of photo gives the most reliable breed identification result?",
    answer:
      "For the clearest analysis, upload a well-lit photo showing your cat's full face and upper body in a natural posture. Avoid dark rooms, heavy digital filters, motion blur, or photos where your cat is obscured under blankets. Clear views of the muzzle, ears, and coat texture produce the highest quality trait analysis.",
  },
  {
    question: "Why does CatAnalyzer use qualitative match labels (Strong, Likely, Possible) instead of percentages?",
    answer:
      "Visual phenotype identification cannot scientifically measure exact percentages like '87.4% Maine Coon'—such numbers give a false sense of genetic precision. Instead, CatAnalyzer uses transparent qualitative match tiers (Strong, Likely, Possible) and accompanies every result with observable physical evidence explaining why each breed was identified.",
  },
  {
    question: "Are my uploaded cat photos saved, sold, or shared publicly?",
    answer:
      "No. Uploaded photos are processed in temporary server memory solely to generate your phenotypic match report. They are never written to permanent disk storage, added to public directories, or shared with third parties.",
  },
];

export default function CatBreedIdentifierPage() {
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "CatAnalyzer AI Cat Breed Identifier",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "All",
        url: `${siteUrl}/cat-breed-identifier`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Upload a cat photo to discover likely breed matches based on physical phenotypic traits and vision neural networks.",
      },
      {
        "@type": "FAQPage",
        mainEntity: IDENTIFIER_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  // Featured breeds with notable search interest
  const featuredBreedSlugs = [
    "american-shorthair",
    "british-shorthair",
    "devon-rex",
    "siamese",
    "maine-coon",
    "norwegian-forest-cat",
  ];
  const featuredBreeds = POPULAR_BREEDS.filter((b) => featuredBreedSlugs.includes(b.slug));

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

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-10">
          <Badge variant="brand" className="px-3.5 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 mr-1 inline fill-current" />
            AI Vision Breed Recognition
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 leading-tight">
            AI Cat Breed Identifier — <span className="text-brand-500">What Breed Is My Cat?</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Upload a photo of your cat to identify likely breed matches based on visible traits, anatomical structure, and coat patterns. Free, instant, and transparent.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Visual Phenotype Estimate
            </span>
            <span>•</span>
            <span>Zero Image Storage</span>
            <span>•</span>
            <span>No Registration Required</span>
          </div>
        </div>

        {/* Upload Zone Tool */}
        <div className="max-w-4xl mx-auto">
          <BreedUploadZone />
        </div>
      </section>

      {/* How It Works: Before & After Upload */}
      <section className="w-full bg-stone-100/70 border-y border-stone-200/70 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
            <Badge variant="neutral">Clear Process</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              How the AI Breed Identification Process Works
            </h2>
            <p className="text-sm text-stone-600">
              From photo intake to physical trait analysis, understand what happens before and after you upload:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-stone-200 p-6 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-bold text-stone-900 text-base">1. Capture or Upload Photo</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Take a photo using your mobile camera or select an existing image from your desktop. A well-lit front or three-quarter view of your cat&apos;s face and coat provides optimal detail.
              </p>
            </Card>

            <Card className="bg-white border-stone-200 p-6 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-bold text-stone-900 text-base">2. AI Visual Trait Mapping</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Our vision model examines distinct morphological markers—cranial geometry, ear placement, muzzle contours, fur layering, and color patterns—comparing them against recognized feline standards.
              </p>
            </Card>

            <Card className="bg-white border-stone-200 p-6 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-bold text-stone-900 text-base">3. Transparent Trait Breakdown</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                You receive a qualitative match label (Strong, Likely, or Possible) along with observable reasons explaining why each breed was identified, plus dedicated mixed-breed lineage insights.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trait Identification Science */}
      <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
          <Badge variant="brand">Phenotypic Science</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Observable Traits Analyzed by the AI
          </h2>
          <p className="text-sm text-stone-600">
            Visual breed recognition inspects genuine physical anatomy rather than guessing:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-stone-200 p-6 space-y-2">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-500" />
              Cranial & Muzzle Geometry
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Evaluates head shape—from the square boxy jaw of the Maine Coon, to the flat profile of the Persian, to the triangular wedge of the Siamese and modified wedge of the Devon Rex.
            </p>
          </Card>

          <Card className="bg-white border-stone-200 p-6 space-y-2">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-500" />
              Coat Density, Texture & Pattern
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Analyzes hair shaft length, presence of water-resistant guard hairs, undercoat plushness, ripples (rexing), and distinctive patterns like classic bullseye tabby or color points.
            </p>
          </Card>

          <Card className="bg-white border-stone-200 p-6 space-y-2">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-500" />
              Ear Placement & Furnishings
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Detects lynx tips, internal ear tufts, forward ear folding (Scottish Fold), and oversized butterfly bases (Devon Rex) that characterize distinct evolutionary lineages.
            </p>
          </Card>
        </div>
      </section>

      {/* Mixed Breed Advice */}
      <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl border border-amber-200/90 bg-gradient-to-r from-amber-50/50 via-orange-50/30 to-amber-50/50 p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                Understanding Mixed-Breed Cats & Rescue Felines
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Why visual trait matching helps rescue cat owners
              </p>
            </div>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">
            Over 90% of companion cats worldwide are Domestic Shorthairs or Domestic Longhairs—wonderful cats with diverse, natural multi-generational heritage. When you analyze a rescue cat, CatAnalyzer highlights which ancestral breed markers are visibly expressed (such as an American Shorthair muscular build or Siamese point coloring) without making false claims of certified pedigree paperwork.
          </p>
          <div className="pt-2 text-xs text-amber-900/80 font-medium">
            💡 <em>Note: Official purebred status requires certified pedigree documents from recognized registries like TICA or CFA. Visual AI provides an educational phenotype estimate.</em>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-stone-200/70">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <Badge variant="neutral">Frequently Asked Questions</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Cat Breed Identification FAQ
          </h2>
          <p className="text-sm text-stone-500">
            Common questions about visual feline breed recognition and results.
          </p>
        </div>

        <Accordion>
          {IDENTIFIER_FAQS.map((faq, idx) => (
            <AccordionItem key={idx} title={faq.question} defaultOpen={idx === 0}>
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Explore Popular Breeds */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-200/70">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Browse Cat Breed Standards
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Learn about distinct physical traits and care profiles
            </p>
          </div>
          <Link href="/cat-breeds" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View All 16 Breeds <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredBreeds.map((b) => (
            <Link
              key={b.id}
              href={`/cat-breeds/${b.slug}`}
              className="group block rounded-2xl border border-stone-200 bg-white p-5 hover:border-brand-400 hover:shadow-soft transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
                  {b.name}
                </h3>
                <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                  {b.appearance.coatLength}
                </span>
              </div>
              <span className="text-xs text-stone-400 block">{b.origin} • Weight: {b.weightRange}</span>
              <p className="text-xs text-stone-500 mt-2 line-clamp-2">{b.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Breed Comparisons */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Popular Head-to-Head Breed Comparisons
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Compare lookalike breeds side-by-side
            </p>
          </div>
          <Link href="/compare" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            Compare Hub <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CURATED_COMPARISONS.slice(0, 3).map((comp) => (
            <Link
              key={`${comp.slugA}-vs-${comp.slugB}`}
              href={`/compare/${comp.slugA}-vs-${comp.slugB}`}
              className="rounded-2xl border border-stone-200 bg-white p-4 hover:border-brand-300 transition-all text-xs"
            >
              <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-brand-600" />
                {comp.title}
              </div>
              <p className="text-stone-500 line-clamp-2">{comp.highlightDifference}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cross-Link to Cat Translator */}
      <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl border border-stone-200 bg-gradient-to-r from-stone-900 to-stone-800 text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-stone-200">
              <Volume2 className="h-3.5 w-3.5" />
              <span>Bioacoustic Analysis</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Also Curious About Your Cat&apos;s Meows?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Listen beyond appearances. Use our Cat Translator to interpret meows, chirps, and purrs based on acoustic pitch and situational context.
            </p>
          </div>
          <Link href="/cat-translator" className="shrink-0">
            <Button size="lg" className="bg-white text-stone-900 hover:bg-stone-100 font-bold gap-2 shadow-md">
              <Volume2 className="h-4 w-4 text-brand-600" />
              Try Cat Translator
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
