import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Scale,
  Heart,
  ArrowRight,
  Globe,
  Scissors,
  Activity,
  Volume2,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  CURATED_COMPARISONS,
  getComparisonPair,
  getBreedBySlug,
} from "@/lib/data/breeds";
import { getSiteUrl } from "@/lib/config/site";

interface PageProps {
  params: Promise<{ comparison: string }>;
}

export async function generateStaticParams() {
  return CURATED_COMPARISONS.map((c) => ({
    comparison: `${c.slugA}-vs-${c.slugB}`,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { comparison } = await params;
  const pair = getComparisonPair(comparison);

  if (!pair) {
    notFound();
  }

  const { breedA, breedB } = pair;

  return {
    title: `${breedA.name} vs. ${breedB.name}: Full Comparison & Differences | CatAnalyzer`,
    description: `Compare ${breedA.name} vs ${breedB.name} side-by-side. Detailed breakdown of size, coat texture, facial structure, personality, grooming needs, and visual identification differences.`,
    alternates: {
      canonical: `/compare/${breedA.slug}-vs-${breedB.slug}`,
    },
    openGraph: {
      title: `${breedA.name} vs. ${breedB.name} — Breed Comparison Guide`,
      description: `Discover how the ${breedA.name} and ${breedB.name} differ in appearance, temperament, and care requirements.`,
      images: [breedA.imageUrl, breedB.imageUrl],
      type: "article",
    },
  };
}

export default async function ComparisonDetailPage({ params }: PageProps) {
  const { comparison } = await params;
  const pair = getComparisonPair(comparison);

  if (!pair) {
    notFound();
  }

  const { breedA, breedB } = pair;

  // Find other curated comparisons involving either breed
  const otherComparisons = CURATED_COMPARISONS.filter(
    (c) =>
      `${c.slugA}-vs-${c.slugB}` !== comparison &&
      (c.slugA === breedA.slug ||
        c.slugB === breedA.slug ||
        c.slugA === breedB.slug ||
        c.slugB === breedB.slug)
  ).slice(0, 4);

  const siteUrl = getSiteUrl();

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${breedA.name} vs. ${breedB.name} Comparison`,
    description: `Comprehensive side-by-side comparison of ${breedA.name} and ${breedB.name} cat breeds.`,
    url: `${siteUrl}/compare/${breedA.slug}-vs-${breedB.slug}`,
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
        {
          "@type": "ListItem",
          position: 3,
          name: `${breedA.name} vs. ${breedB.name}`,
          item: `${siteUrl}/compare/${breedA.slug}-vs-${breedB.slug}`,
        },
      ],
    },
  };

  const comparisonRows = [
    {
      label: "Origin",
      valA: breedA.origin,
      valB: breedB.origin,
    },
    {
      label: "Typical Size",
      valA: breedA.size,
      valB: breedB.size,
    },
    {
      label: "Weight Range",
      valA: breedA.weightRange,
      valB: breedB.weightRange,
    },
    {
      label: "Average Lifespan",
      valA: breedA.lifespan,
      valB: breedB.lifespan,
    },
    {
      label: "Coat Length",
      valA: breedA.appearance.coatLength,
      valB: breedB.appearance.coatLength,
    },
    {
      label: "Coat Texture",
      valA: breedA.appearance.coatTexture,
      valB: breedB.appearance.coatTexture,
    },
    {
      label: "Facial / Head Structure",
      valA: breedA.appearance.faceShape,
      valB: breedB.appearance.faceShape,
    },
    {
      label: "Ear Characteristics",
      valA: breedA.appearance.earShape,
      valB: breedB.appearance.earShape,
    },
    {
      label: "Body Build",
      valA: breedA.appearance.bodyType,
      valB: breedB.appearance.bodyType,
    },
    {
      label: "Activity Level",
      valA: breedA.traits.activityLevel,
      valB: breedB.traits.activityLevel,
    },
    {
      label: "Sociability",
      valA: breedA.traits.sociability,
      valB: breedB.traits.sociability,
    },
    {
      label: "Vocalization",
      valA: breedA.traits.vocalizationLevel,
      valB: breedB.traits.vocalizationLevel,
    },
    {
      label: "Grooming Routine",
      valA: breedA.care.groomingFrequency,
      valB: breedB.care.groomingFrequency,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-brand-600 transition-colors">
            Compare
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">
            {breedA.name} vs. {breedB.name}
          </span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-700">
              <Scale className="h-3.5 w-3.5 text-brand-600" />
              <span>Head-to-Head Breed Comparison</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
              {breedA.name} vs. {breedB.name}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-3xl leading-relaxed">
              Comparing the {breedA.name} and {breedB.name}: learn how their coat care, physical dimensions, face shapes, and behavioral energy differ so you can accurately identify your cat or select the best companion for your home.
            </p>
          </div>

          {/* Dual Side-by-Side Breed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Breed A Card */}
            <Card className="overflow-hidden border-stone-200 bg-white shadow-soft flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={breedA.imageUrl}
                    alt={`${breedA.name} portrait`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="brand">{breedA.appearance.coatLength}</Badge>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-2xl font-bold text-stone-900">{breedA.name}</h2>
                    <span className="text-xs text-stone-400 font-medium">{breedA.origin}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {breedA.shortDescription}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link href={`/cat-breeds/${breedA.slug}`}>
                  <Button variant="outline" size="sm" className="w-full font-semibold gap-1.5">
                    View Full {breedA.name} Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Breed B Card */}
            <Card className="overflow-hidden border-stone-200 bg-white shadow-soft flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={breedB.imageUrl}
                    alt={`${breedB.name} portrait`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="brand">{breedB.appearance.coatLength}</Badge>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-2xl font-bold text-stone-900">{breedB.name}</h2>
                    <span className="text-xs text-stone-400 font-medium">{breedB.origin}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {breedB.shortDescription}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link href={`/cat-breeds/${breedB.slug}`}>
                  <Button variant="outline" size="sm" className="w-full font-semibold gap-1.5">
                    View Full {breedB.name} Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix Table */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-stone-900">
              Side-by-Side Trait Matrix
            </h2>
            <p className="text-sm text-stone-500">
              Direct comparison across structural anatomy, coat characteristics, and daily care standards.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80 text-xs font-bold uppercase tracking-wider text-stone-600">
                  <th className="p-4 sm:p-5 w-1/4">Feature</th>
                  <th className="p-4 sm:p-5 w-3/8 text-brand-700 bg-brand-50/30">
                    {breedA.name}
                  </th>
                  <th className="p-4 sm:p-5 w-3/8 text-stone-900">
                    {breedB.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-stone-700 align-top">
                      {row.label}
                    </td>
                    <td className="p-4 sm:p-5 text-stone-800 font-medium align-top bg-brand-50/10">
                      {row.valA}
                    </td>
                    <td className="p-4 sm:p-5 text-stone-800 font-medium align-top">
                      {row.valB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Differences Breakdown */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-900">
            Key Differences Explained
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Visual Markers */}
            <Card className="p-6 border-stone-200 bg-white space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                1. Visual Phenotype
              </span>
              <h3 className="text-lg font-bold text-stone-900">
                Facial Geometry & Head Shape
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                The {breedA.name} displays <strong>{breedA.appearance.faceShape}</strong>, whereas the {breedB.name} exhibits <strong>{breedB.appearance.faceShape}</strong>. Observe the ear orientation and eye contours to spot the differences instantly.
              </p>
            </Card>

            {/* Coat Care */}
            <Card className="p-6 border-stone-200 bg-white space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                2. Coat Maintenance
              </span>
              <h3 className="text-lg font-bold text-stone-900">
                Grooming & Shedding
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {breedA.name} requires {breedA.care.groomingFrequency.toLowerCase()}. In contrast, the {breedB.name} requires {breedB.care.groomingFrequency.toLowerCase()}.
              </p>
            </Card>

            {/* Temperament */}
            <Card className="p-6 border-stone-200 bg-white space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                3. Energy & Noise
              </span>
              <h3 className="text-lg font-bold text-stone-900">
                Activity & Vocalization
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {breedA.name} is rated as <strong>{breedA.traits.activityLevel}</strong> energy with <strong>{breedA.traits.vocalizationLevel}</strong> vocal presence. {breedB.name} is <strong>{breedB.traits.activityLevel}</strong> energy and <strong>{breedB.traits.vocalizationLevel}</strong> vocal.
              </p>
            </Card>
          </div>
        </section>

        {/* Visual Identification Cheat Sheet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-stone-200 bg-white space-y-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Signs Your Cat Is A {breedA.name}
            </h3>
            <ul className="space-y-2">
              {breedA.keyVisualIdentifiers.map((item, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border-stone-200 bg-white space-y-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Signs Your Cat Is A {breedB.name}
            </h3>
            <ul className="space-y-2">
              {breedB.keyVisualIdentifiers.map((item, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-700 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Lifestyle Suitability: Which Cat Is Right For You? */}
        <section className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Which Breed Is Right For You?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Consider your living situation, family schedule, and grooming tolerance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 text-base">
                Choose the {breedA.name} if you:
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Prefer a cat with a {breedA.appearance.coatLength.toLowerCase()} coat and {breedA.appearance.bodyType.toLowerCase()} build.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Enjoy a temperament that is {breedA.traits.personality.slice(0, 3).join(", ").toLowerCase()}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Can commit to {breedA.care.groomingFrequency.toLowerCase()}.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 text-base">
                Choose the {breedB.name} if you:
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Prefer a cat with a {breedB.appearance.coatLength.toLowerCase()} coat and {breedB.appearance.bodyType.toLowerCase()} build.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Appreciate a companion that is {breedB.traits.personality.slice(0, 3).join(", ").toLowerCase()}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Can accommodate {breedB.care.groomingFrequency.toLowerCase()}.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Scanner CTA */}
        <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-stone-900 rounded-3xl p-8 sm:p-12 text-white shadow-soft space-y-4">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>AI Visual Phenotypic Scan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Still Wondering Which Breed Your Cat Resembles?
            </h2>
            <p className="text-sm sm:text-base text-brand-50/90 leading-relaxed">
              Don&apos;t rely on guesswork. Upload a photo of your cat to CatAnalyzer to get an instant AI visual identification comparing facial features, ear shapes, and coat patterns against both {breedA.name} and {breedB.name}.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/cat-breed-identifier">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-stone-100 font-bold gap-2 shadow-md">
                  <Sparkles className="h-4 w-4 text-brand-600 fill-current" />
                  Scan My Cat Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="/compare"
                className="text-sm font-semibold text-white/90 hover:text-white underline underline-offset-4 py-2"
              >
                Compare other breeds →
              </Link>
            </div>
          </div>
        </section>

        {/* Other Comparisons */}
        {otherComparisons.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900">
              Related Comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherComparisons.map((c) => (
                <Link
                  key={`${c.slugA}-vs-${c.slugB}`}
                  href={`/compare/${c.slugA}-vs-${c.slugB}`}
                  className="group block rounded-2xl border border-stone-200 bg-white p-4 hover:border-brand-300 hover:shadow-soft transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-stone-900 group-hover:text-brand-600 transition-colors text-sm sm:text-base">
                      {c.title}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-brand-600 transition-all shrink-0 ml-2" />
                  </div>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                    {c.highlightDifference}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer Back Links */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-500">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 hover:text-brand-600 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Comparison Hub
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/cat-breeds/${breedA.slug}`}
              className="hover:text-brand-600 transition-colors font-medium"
            >
              {breedA.name} Profile →
            </Link>
            <Link
              href={`/cat-breeds/${breedB.slug}`}
              className="hover:text-brand-600 transition-colors font-medium"
            >
              {breedB.name} Profile →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
