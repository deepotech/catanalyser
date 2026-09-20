import Link from "next/link";
import {
  Sparkles,
  Camera,
  Layers,
  ShieldCheck,
  Eye,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Volume2,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { BreedUploadZone } from "@/components/features/breed-upload/upload-zone";
import { CatTranslatorTeaser } from "@/components/features/translator-preview/translator-teaser";
import { POPULAR_BREEDS } from "@/lib/data/breeds";
import { HOMEPAGE_FAQS } from "@/lib/data/faq";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* ===================================================
          1. HERO & BREED IDENTIFIER UPLOAD TOOL
      =================================================== */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-12">
          <Badge variant="brand" className="px-3.5 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 mr-1 inline fill-current" />
            AI Feline Phenotype Analyzer
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.1]">
            What Breed Is <span className="text-brand-500">My Cat?</span>
          </h1>

          <p className="text-base sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Upload a photo and discover your cat&apos;s most likely breed matches with AI.
            See visible trait breakdowns, mixed-breed lineage insights, and why specific breeds were identified.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#breed-identifier">
              <Button size="lg" className="font-semibold shadow-md gap-2">
                <Camera className="h-4 w-4" />
                Identify My Cat
              </Button>
            </a>
            <a href="#cat-translator">
              <Button variant="outline" size="lg" className="gap-2">
                <Volume2 className="h-4 w-4" />
                Try Cat Translator
              </Button>
            </a>
          </div>

          <p className="text-xs text-stone-400">
            Supported formats: JPG, PNG, WEBP • Free instant analysis • No registration required
          </p>
        </div>

        {/* Upload Tool Component */}
        <div className="max-w-4xl mx-auto">
          <BreedUploadZone />
        </div>
      </section>

      {/* ===================================================
          2. VISUAL DEMONSTRATION OF AN AI RESULT
      =================================================== */}
      <section className="w-full bg-stone-100/70 border-y border-stone-200/70 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge variant="neutral" className="text-xs">
              Transparent Explanations
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              We Don&apos;t Just Guess a Breed — We Explain Why
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Unlike simplistic apps that output a raw uncalibrated percentage, CatAnalyzer analyzes visible anatomical indicators and explains the physical evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-stone-200/90 shadow-soft">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-lg font-bold text-stone-900">Phenotypic Trait Mapping</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Our model isolates distinctive physical markers: ear tip tufts, muzzle squareness, coat layer density, eye slant, and color points.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-stone-200/90 shadow-soft">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-lg font-bold text-stone-900">Mixed-Breed Honest Assessment</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Most companion cats are loving mixed breeds. If your cat shows hybrid features, our system highlights blended ancestral influences instead of forcing a single purebred result.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-stone-200/90 shadow-soft">
              <CardContent className="p-6 space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-lg font-bold text-stone-900">Calibrated Match Levels</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Clear, honest labels such as &ldquo;Strong visual match&rdquo; or &ldquo;Possible match&rdquo; keep you informed without false claims of genetic pedigree certainty.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. HOW IT WORKS (3 STEPS)
      =================================================== */}
      <section id="how-it-works" className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <Badge variant="brand">Simple 3-Step Process</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            How CatAnalyzer Works
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            From photo upload to comprehensive breed insights in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative flex flex-col items-center text-center p-6 space-y-4">
            <div className="h-16 w-16 rounded-3xl bg-brand-100/70 text-brand-600 flex items-center justify-center shadow-soft">
              <Camera className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">1. Snap or Upload Photo</h3>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              Take a front or 3/4 photo of your cat in natural lighting. Both desktop uploads and mobile camera capture are supported.
            </p>
          </div>

          <div className="relative flex flex-col items-center text-center p-6 space-y-4">
            <div className="h-16 w-16 rounded-3xl bg-amber-100/70 text-amber-700 flex items-center justify-center shadow-soft">
              <Layers className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">2. AI Vision Inspection</h3>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              The vision neural network analyzes anatomical structure: ear furnishings, cheekbones, coat texture, body shape, and color patterns.
            </p>
          </div>

          <div className="relative flex flex-col items-center text-center p-6 space-y-4">
            <div className="h-16 w-16 rounded-3xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shadow-soft">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">3. Explore Detailed Matches</h3>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              Review primary and alternate breed matches, read physical trait reasoning, and explore comprehensive breed profiles.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. WHAT CHARACTERISTICS IDENTIFY A CAT BREED?
      =================================================== */}
      <section className="w-full bg-stone-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12 space-y-3">
            <Badge variant="dev" className="bg-stone-800 text-stone-300 border-stone-700">
              Phenotypic Markers
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              What Visible Traits Help Identify a Cat Breed?
            </h2>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Cat breeds evolved distinctive phenotypic standards. When evaluating photos, our visual analysis model inspects five key anatomical domains:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-2xl bg-stone-800/80 border border-stone-700/80 p-5 space-y-2">
              <h4 className="font-bold text-brand-400 text-sm uppercase tracking-wide">1. Ears & Tufts</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Lynx tipping (Maine Coon), forward folding (Scottish Fold), or oversized flaring bases (Siamese, Oriental).
              </p>
            </div>

            <div className="rounded-2xl bg-stone-800/80 border border-stone-700/80 p-5 space-y-2">
              <h4 className="font-bold text-brand-400 text-sm uppercase tracking-wide">2. Facial Profile</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Brachycephalic flat muzzle (Persian), wedge-shaped head (Siamese), or square boxy jawline (Maine Coon, Norwegian Forest).
              </p>
            </div>

            <div className="rounded-2xl bg-stone-800/80 border border-stone-700/80 p-5 space-y-2">
              <h4 className="font-bold text-brand-400 text-sm uppercase tracking-wide">3. Coat & Density</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Dense crisp double coats (British Shorthair), plush silky semi-longhair (Ragdoll), or hairlessness (Sphynx).
              </p>
            </div>

            <div className="rounded-2xl bg-stone-800/80 border border-stone-700/80 p-5 space-y-2">
              <h4 className="font-bold text-brand-400 text-sm uppercase tracking-wide">4. Eye Shape & Color</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Almond slanted blue eyes (Siamese), deep copper globes (British Blue), or large expressive ovals (Ragdoll).
              </p>
            </div>

            <div className="rounded-2xl bg-stone-800/80 border border-stone-700/80 p-5 space-y-2">
              <h4 className="font-bold text-brand-400 text-sm uppercase tracking-wide">5. Body Build</h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Heavy cobby build (British/Exotic), long tubular athletic frame (Siamese/Abyssinian), or muscular giant frame (Maine Coon).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. POPULAR BREEDS DIRECTORY PREVIEW
      =================================================== */}
      <section id="popular-breeds" className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="brand" className="mb-2">
              Explore Breeds
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Popular Cat Breeds
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1">
              Discover key identification features, origins, and temperaments.
            </p>
          </div>
          <a href="#breed-identifier">
            <Button variant="outline" size="sm" className="gap-1.5 self-start md:self-auto">
              Scan Your Cat Now
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_BREEDS.map((breed) => (
            <Card
              key={breed.id}
              hoverEffect
              className="overflow-hidden border-stone-200 bg-white flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={breed.imageUrl}
                    alt={breed.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {breed.badge && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="brand" className="bg-white/95 backdrop-blur-sm font-semibold shadow-2xs">
                        {breed.badge}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                    <span>Origin: {breed.origin}</span>
                    <span>{breed.coatLength}</span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900">{breed.name}</h3>

                  <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {breed.shortDescription}
                  </p>

                  {/* Key traits */}
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                      Key Identification Features:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-700">
                      {breed.keyVisualIdentifiers.slice(0, 2).map((trait, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-500 mt-0.5 shrink-0" />
                          <span>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <a href="#breed-identifier">
                  <Button variant="subtle" size="sm" className="w-full text-xs font-semibold justify-center">
                    Check If My Cat Is {breed.name}
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================================================
          6. CAT TRANSLATOR INTERACTIVE TEASER
      =================================================== */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CatTranslatorTeaser />
      </div>

      {/* ===================================================
          7. TRUST & RESPONSIBLE AI COMMITMENT
      =================================================== */}
      <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-stone-200/90 bg-stone-50/70 p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Our Commitment to Responsible Pet AI
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Honest probabilistic estimates without deceptive claims
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-stone-600">
            <div className="p-4 rounded-2xl bg-white border border-stone-200/70 space-y-1.5">
              <h5 className="font-bold text-stone-900">Phenotype vs. Pedigree</h5>
              <p className="leading-relaxed text-xs">
                Visual breed identification predicts physical phenotype. Only registered pedigree paperwork or laboratory genetic testing confirms ancestry.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200/70 space-y-1.5">
              <h5 className="font-bold text-stone-900">Vocalizations Are Not Grammar</h5>
              <p className="leading-relaxed text-xs">
                Cats do not possess a formal spoken human language. Our translator interprets acoustic patterns and context to offer behavioral clues.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200/70 space-y-1.5">
              <h5 className="font-bold text-stone-900">Non-Veterinary Advice</h5>
              <p className="leading-relaxed text-xs">
                CatAnalyzer is an educational exploration tool. If your cat exhibits pain or distress, always consult a licensed veterinarian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          8. FREQUENTLY ASKED QUESTIONS (FAQ)
      =================================================== */}
      <section id="faq" className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <Badge variant="neutral">Got Questions?</Badge>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-stone-500">
            Everything you need to know about AI cat breed identification and sound interpretation.
          </p>
        </div>

        <Accordion>
          {HOMEPAGE_FAQS.map((faq, idx) => (
            <AccordionItem key={idx} title={faq.question} defaultOpen={idx === 0}>
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ===================================================
          9. FINAL CALL TO ACTION
      =================================================== */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl sm:rounded-4xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-soft-lg">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Understand Your Cat?
            </h2>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Upload a photo now to discover your cat&apos;s likely breed heritage and visual characteristics in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href="#breed-identifier">
              <Button size="lg" className="font-semibold shadow-md gap-2">
                <Camera className="h-4 w-4" />
                Upload Cat Photo Free
              </Button>
            </a>
            <a href="#cat-translator">
              <Button variant="outline" size="lg" className="bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700">
                <Volume2 className="h-4 w-4 mr-1.5" />
                Try Sound Interpreter
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
