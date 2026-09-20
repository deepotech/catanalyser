import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Heart,
  ShieldAlert,
  HelpCircle,
  Activity,
  Layers,
  Scissors,
  Home,
  Volume2,
  ArrowRight,
  Scale,
  Calendar,
  Globe,
  Dna,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  getBreedBySlug,
  getAllBreedSlugs,
  getSimilarBreeds,
  CURATED_COMPARISONS,
} from "@/lib/data/breeds";
import { getSiteUrl } from "@/lib/config/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBreedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);

  if (!breed) {
    notFound();
  }

  return {
    title: `${breed.name} Cat Breed Guide: Visual Identification, Traits & Care | CatAnalyzer`,
    description: `${breed.shortDescription} Learn how to visually identify a ${breed.name}, key phenotypic markers, coat variations, personality traits, and care advice.`,
    alternates: {
      canonical: `/cat-breeds/${breed.slug}`,
    },
    openGraph: {
      title: `${breed.name} — Visual Identification & Breed Guide`,
      description: breed.shortDescription,
      images: [breed.imageUrl],
      type: "article",
    },
  };
}

export default async function BreedDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const breed = getBreedBySlug(slug);

  if (!breed) {
    notFound();
  }

  const similarBreeds = getSimilarBreeds(breed.slug);
  const relatedComparisons = CURATED_COMPARISONS.filter(
    (c) => c.slugA === breed.slug || c.slugB === breed.slug
  );

  const siteUrl = getSiteUrl();

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
            name: "Cat Breeds",
            item: `${siteUrl}/cat-breeds`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: breed.name,
            item: `${siteUrl}/cat-breeds/${breed.slug}`,
          },
        ],
      },
      {
        "@type": "Article",
        headline: `${breed.name} Cat Breed: Identification, Characteristics & Care`,
        description: breed.shortDescription,
        image: breed.imageUrl,
        author: {
          "@type": "Organization",
          name: "CatAnalyzer Editorial Team",
          url: siteUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "CatAnalyzer",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/favicon.ico`,
          },
        },
        mainEntityOfPage: `${siteUrl}/cat-breeds/${breed.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: breed.faq.map((faq) => ({
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14">
        {/* Section 1: Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/cat-breeds" className="hover:text-brand-600 transition-colors">
            Cat Breeds
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">{breed.name}</span>
        </nav>

        {/* Section 2: Hero Header & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" className="gap-1">
                <Globe className="h-3 w-3" />
                {breed.origin}
              </Badge>
              <Badge variant="neutral">{breed.appearance.coatLength}</Badge>
              <Badge variant="outline">{breed.appearance.bodyType}</Badge>
              {breed.badge && <Badge variant="dev">{breed.badge}</Badge>}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
              {breed.name}
            </h1>

            {breed.aliases.length > 0 && (
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Also known as: <span className="text-stone-700">{breed.aliases.join(", ")}</span>
              </p>
            )}

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed pt-1">
              {breed.shortDescription}
            </p>

            {/* Quick Identification CTA */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3">
              <Link href="/cat-breed-identifier">
                <Button size="lg" className="font-semibold gap-2 shadow-sm">
                  <Sparkles className="h-4 w-4 fill-current" />
                  Scan My Cat For {breed.name} Traits
                </Button>
              </Link>
              <Link href="#phenotype-guide">
                <Button variant="outline" size="lg" className="font-semibold">
                  Identification Guide
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-soft max-h-[440px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={breed.imageUrl}
              alt={`${breed.name} cat breed portrait`}
              className="w-full h-full object-cover max-h-[440px]"
            />
          </div>
        </div>

        {/* Section 3: Quick Metric Spec Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center space-y-1 shadow-2xs">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">
              Typical Size
            </span>
            <p className="text-base font-bold text-stone-900">{breed.size}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center space-y-1 shadow-2xs">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">
              Weight Range
            </span>
            <p className="text-sm font-bold text-stone-900 leading-snug">{breed.weightRange}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center space-y-1 shadow-2xs">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">
              Lifespan
            </span>
            <p className="text-base font-bold text-stone-900">{breed.lifespan}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center space-y-1 shadow-2xs">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">
              Coat Length
            </span>
            <p className="text-sm font-bold text-stone-900">{breed.appearance.coatLength}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center space-y-1 shadow-2xs">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">
              Activity
            </span>
            <p className="text-base font-bold text-stone-900">{breed.traits.activityLevel}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center space-y-1 shadow-2xs">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">
              Vocalization
            </span>
            <p className="text-base font-bold text-stone-900">{breed.traits.vocalizationLevel}</p>
          </div>
        </div>

        {/* Section 4: Comprehensive In-Depth Overview */}
        <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-soft">
          <h2 className="text-2xl font-bold text-stone-900">
            About the {breed.name}
          </h2>
          <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
            {breed.longDescription}
          </p>
        </section>

        {/* Section 5: Physical Appearance & Anatomy Matrix */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-stone-900">
              Physical Appearance & Anatomy Matrix
            </h2>
            <p className="text-sm text-stone-500">
              Structural traits, coat variations, and facial architecture that define the {breed.name} breed standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Coat Texture & Density
              </span>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {breed.appearance.coatTexture}
              </p>
            </Card>

            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Head & Facial Structure
              </span>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {breed.appearance.faceShape}
              </p>
            </Card>

            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Ear Shape & Placement
              </span>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {breed.appearance.earShape}
              </p>
            </Card>

            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Eyes & Expression
              </span>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {breed.appearance.eyeCharacteristics}
              </p>
            </Card>

            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Body Conformation & Frame
              </span>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {breed.appearance.bodyType} frame with distinct musculature and proportion.
              </p>
            </Card>

            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Tail Characteristics
              </span>
              <p className="text-sm text-stone-800 leading-relaxed font-medium">
                {breed.appearance.tailCharacteristics}
              </p>
            </Card>
          </div>

          {/* Color & Pattern Variety Badges */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Recognized Coat Colors & Patterns
            </span>
            <div className="flex flex-wrap gap-2">
              {breed.appearance.colors.map((c, i) => (
                <span
                  key={i}
                  className="inline-block text-xs font-medium bg-white text-stone-800 px-3 py-1 rounded-lg border border-stone-200"
                >
                  {c}
                </span>
              ))}
              {breed.appearance.patterns.map((p, i) => (
                <span
                  key={`pattern-${i}`}
                  className="inline-block text-xs font-medium bg-brand-50 text-brand-800 px-3 py-1 rounded-lg border border-brand-200"
                >
                  Pattern: {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Key Visual Identifiers (Phenotypic Checklist) */}
        <section id="phenotype-guide" className="scroll-mt-20">
          <Card className="p-6 sm:p-8 border-stone-200 bg-white shadow-soft space-y-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                How to Visually Identify a {breed.name}
              </h2>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              When evaluating whether a cat exhibits {breed.name} phenotypic heritage, look for these signature visual indicators:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {breed.keyVisualIdentifiers.map((trait, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50/80 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-sm font-semibold text-stone-800 leading-snug">{trait}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Section 7: Personality & Temperament Profile */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <h2 className="text-2xl font-bold text-stone-900">
              Personality, Temperament & Behavior
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-stone-700 font-bold text-sm">
                <Heart className="h-4 w-4 text-rose-500" />
                Sociability
              </div>
              <p className="text-lg font-extrabold text-stone-900">{breed.traits.sociability}</p>
              <p className="text-xs text-stone-500">
                Interaction style with family members, visitors, and other household pets.
              </p>
            </Card>

            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-stone-700 font-bold text-sm">
                <Activity className="h-4 w-4 text-amber-500" />
                Activity Level
              </div>
              <p className="text-lg font-extrabold text-stone-900">{breed.traits.activityLevel}</p>
              <p className="text-xs text-stone-500">
                Daily playfulness, curiosity, and requirement for interactive physical games.
              </p>
            </Card>

            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-stone-700 font-bold text-sm">
                <Volume2 className="h-4 w-4 text-brand-500" />
                Vocalization
              </div>
              <p className="text-lg font-extrabold text-stone-900">{breed.traits.vocalizationLevel}</p>
              <p className="text-xs text-stone-500">
                Frequency and volume of meows, chirps, trills, and conversational tendencies.
              </p>
            </Card>
          </div>

          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Core Personality Attributes
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {breed.traits.personality.map((p, idx) => (
                <Badge key={idx} variant="neutral" className="px-3 py-1 text-xs font-semibold">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Section 8: Care, Grooming & Living Environment */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-indigo-500" />
            <h2 className="text-2xl font-bold text-stone-900">
              Care, Grooming & Living Requirements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-stone-700 font-bold text-sm">
                <Scissors className="h-4 w-4 text-brand-600" />
                Grooming Routine
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {breed.care.groomingFrequency}
              </p>
            </Card>

            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-stone-700 font-bold text-sm">
                <Activity className="h-4 w-4 text-emerald-600" />
                Exercise Needs
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {breed.care.exerciseNeeds}
              </p>
            </Card>

            <Card className="p-5 border-stone-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-stone-700 font-bold text-sm">
                <Home className="h-4 w-4 text-indigo-500" />
                Indoor Suitability
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                {breed.care.indoorSuitability}
              </p>
            </Card>
          </div>
        </section>

        {/* Section 9: Phenotype vs. Pedigree Reality Check */}
        <section className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900">
            <Dna className="h-5 w-5 text-amber-700" />
            <h3 className="text-lg font-bold">
              AI Visual Phenotype vs. Certified Pedigree Reality
            </h3>
          </div>
          <p className="text-sm text-amber-900/90 leading-relaxed">
            Visual breed identification determines phenotypic resemblance—detecting whether a cat displays the coat color, bone structure, ear geometry, and facial markers associated with the {breed.name} standard. However, an authentic purebred cat can only be certified through official genealogical registration documents (such as TICA or CFA pedigree papers). A cat showing strong {breed.name} characteristics is frequently a magnificent domestic mix inheriting prominent ancestral genes.
          </p>
        </section>

        {/* Section 10: Frequently Asked Questions (FAQ) */}
        {breed.faq.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-brand-600" />
              <h2 className="text-2xl font-bold text-stone-900">
                Frequently Asked Questions About {breed.name}s
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {breed.faq.map((item, idx) => (
                <Card key={idx} className="p-5 border-stone-200 bg-white space-y-2 shadow-2xs">
                  <h3 className="text-sm font-bold text-stone-900 leading-snug">
                    {item.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {item.answer}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Section 11: Head-to-Head Breed Comparisons */}
        {relatedComparisons.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-brand-600" />
                <h2 className="text-2xl font-bold text-stone-900">
                  Head-to-Head Comparisons
                </h2>
              </div>
              <Link
                href="/compare"
                className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-4"
              >
                All Comparisons →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedComparisons.map((comp) => {
                const comparisonParam = `${comp.slugA}-vs-${comp.slugB}`;
                return (
                  <Link
                    key={comparisonParam}
                    href={`/compare/${comparisonParam}`}
                    className="group block rounded-2xl border border-stone-200 bg-white p-5 hover:border-brand-400 hover:shadow-soft transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
                        {comp.title}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                      <strong className="text-stone-700">Key distinction:</strong> {comp.highlightDifference}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 12: Similar Breeds Grid */}
        {similarBreeds.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900">
              Similar Breeds You Might Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarBreeds.map((similar) => (
                <Link
                  key={similar.id}
                  href={`/cat-breeds/${similar.slug}`}
                  className="group block rounded-2xl border border-stone-200 bg-white overflow-hidden hover:border-brand-400 hover:shadow-soft transition-all"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={similar.imageUrl}
                      alt={`${similar.name} portrait`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
                        {similar.name}
                      </h3>
                      <span className="text-[11px] text-stone-400">{similar.origin}</span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {similar.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Section 13: High-Converting Scanner CTA */}
        <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-stone-900 rounded-3xl p-8 sm:p-12 text-white shadow-soft space-y-5">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>Instant AI Breed Recognition</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Does Your Cat Look Like a {breed.name}?
            </h2>
            <p className="text-sm sm:text-base text-brand-50/90 leading-relaxed">
              Upload a clear photo of your cat to CatAnalyzer. Our AI vision model evaluates head structure, coat patterns, ear tufting, and body proportions to give you a transparent phenotypic breakdown.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/cat-breed-identifier">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-stone-100 font-bold gap-2 shadow-md">
                  <Sparkles className="h-4 w-4 text-brand-600 fill-current" />
                  Analyze My Cat For Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="/cat-breeds"
                className="text-sm font-semibold text-white/90 hover:text-white underline underline-offset-4 py-2"
              >
                Browse directory →
              </Link>
            </div>
          </div>
        </section>

        {/* Section 14: Footer Back Link */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs sm:text-sm text-stone-500">
          <Link
            href="/cat-breeds"
            className="inline-flex items-center gap-1.5 hover:text-brand-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cat Breed Directory
          </Link>
          <Link
            href="/compare"
            className="hover:text-brand-600 transition-colors font-medium"
          >
            Compare With Other Breeds →
          </Link>
        </div>
      </div>
    </>
  );
}
