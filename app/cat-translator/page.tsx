import { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Volume2,
  Mic,
  ArrowLeft,
  Info,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Heart,
  HelpCircle,
} from "lucide-react";
import { SoundRecorder } from "@/components/features/cat-translator/sound-recorder";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Cat Translator — Understand Your Cat's Sounds with AI | CatAnalyzer",
  description:
    "Record or upload your cat's sound and get an AI-generated interpretation based on acoustic cadence and situational context. Responsible, ethical, and free.",
  alternates: {
    canonical: "/cat-translator",
  },
  openGraph: {
    title: "Cat Translator — What Is Your Cat Trying to Say? | CatAnalyzer",
    description:
      "Record a meow and give us context. Explore possible feline behavioral intentions with AI bioacoustic interpretation.",
    url: "/cat-translator",
  },
};

const TRANSLATOR_FAQS = [
  {
    question: "Do cats actually have a decoded language like humans?",
    answer:
      "No. Cats do not have formal spoken grammar, syntax, or shared vocabulary. Feline vocalizations are flexible behavioral signals modulated by pitch, duration, and frequency to elicit caregiving or territory responses from humans.",
  },
  {
    question: "Why does situational context matter so much in interpretation?",
    answer:
      "Because the exact same acoustic meow can mean entirely different things depending on what the cat is doing. A rising chirp near the food bowl signals nutritional anticipation, while the same chirp by the front door expresses curiosity or territory patrol.",
  },
  {
    question: "Are cats trying to talk to other cats when they meow?",
    answer:
      "Fascinatingly, adult feral cats rarely meow at each other; they communicate primarily through scent marking, posture, ear angles, and subtle facial expressions. Meowing evolved as a specialized adaptation almost exclusively directed at human caregivers.",
  },
  {
    question: "Can CatAnalyzer diagnose illness, pain, or depression?",
    answer:
      "No. CatAnalyzer is strictly an informational exploration tool. If your cat demonstrates sudden or persistent vocal distress, howling, lethargy, or behavioral changes, please consult a licensed veterinarian promptly.",
  },
  {
    question: "Is my recorded audio saved or shared publicly?",
    answer:
      "No. Audio recordings are processed in temporary memory to generate the interpretation and are not stored in public directories or sold to third parties.",
  },
];

const COMMON_SOUNDS = [
  {
    name: "Meow",
    type: "Human-directed request",
    description:
      "The classic versatile solicitation call. High-pitched meows frequently indicate greeting or pleasure, while urgent, lower repetitive meows signal immediate demands.",
  },
  {
    name: "Purr",
    type: "Low-frequency contentment & soothing",
    description:
      "Produced by laryngeal muscle vibrations (20–140 Hz). Primarily expresses deep relaxation and safety, though cats occasionally purr to self-soothe when injured or anxious.",
  },
  {
    name: "Chirp & Trill",
    type: "Friendly acknowledgment",
    description:
      "A rolling, upbeat birdsong-like sound mothers use to guide kittens, widely adopted by adult companion cats to greet favorite humans warmly.",
  },
  {
    name: "Chatter",
    type: "Predatory arousal / frustration",
    description:
      "Rapid jaw clicking or stuttered squeaks emitted while gazing at birds, squirrels, or insects through windows that cannot be caught.",
  },
  {
    name: "Hiss & Growl",
    type: "Defensive boundary warning",
    description:
      "Involuntary, fear-based warning signals advising an intruder or stressor to back away immediately. Never punish a cat for hissing—it is vital communication.",
  },
  {
    name: "Yowl",
    type: "Territory / reproductive / distress",
    description:
      "A sustained, drawn-out vocal moan associated with mating, territory confrontation, cognitive disorientation in senior cats, or severe discomfort.",
  },
];

export default function CatTranslatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CatAnalyzer Cat Sound Interpreter",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Record or upload your cat's vocalization to receive a probabilistic, context-aware interpretation of possible behavioral meanings.",
  };

  return (
    <div className="flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header & Tool Container */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-16">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-medium">Cat Translator</span>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <Badge variant="brand" className="px-3.5 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 mr-1 inline fill-current" />
            AI Feline Bioacoustic Interpreter
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 leading-tight">
            Cat Translator — <span className="text-brand-500">What Is Your Cat Trying to Say?</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Record a meow and give us a little context. AI can suggest possible interpretations based on the sound contour and situation.
          </p>
        </div>

        {/* Primary Sound Recorder Component */}
        <SoundRecorder />
      </section>

      {/* Section 1: What Is a Cat Translator & How It Works */}
      <section className="w-full bg-stone-100/70 border-y border-stone-200/70 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <Badge variant="neutral">Feline Ethology</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              How AI Interprets Cat Vocalizations
            </h2>
            <p className="text-sm text-stone-600">
              Rather than pretending cats speak English, CatAnalyzer evaluates physical sound parameters alongside behavioral context:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-stone-200 p-6 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-bold text-stone-900">Acoustic Cadence & Pitch</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Evaluates pitch inflection contours (rising vs. falling), burst length, duration, and whether vocalization is gentle, sharp, or urgent.
              </p>
            </Card>

            <Card className="bg-white border-stone-200 p-6 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-bold text-stone-900">Situational Context</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                A meow near food indicates an entirely different intent than a meow at midnight by a closed door. Context is crucial for behavioral accuracy.
              </p>
            </Card>

            <Card className="bg-white border-stone-200 p-6 space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-bold text-stone-900">Probabilistic Meaning</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Returns honest, probable explanations (*&ldquo;Likely food solicitation&rdquo;*) with alternative possibilities and transparent boundaries.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 2: Guide to Common Cat Sounds */}
      <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mb-12 space-y-2">
          <Badge variant="brand">Vocal Repertoire</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Guide to Common Cat Sounds
          </h2>
          <p className="text-sm text-stone-500">
            Understanding the core vocal categories in domesticated feline communication:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMON_SOUNDS.map((sound, idx) => (
            <Card key={idx} className="bg-white border-stone-200 p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-stone-900">{sound.name}</h3>
                  <Badge variant="neutral" className="text-[10px]">
                    {sound.type}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {sound.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 3: Can a Cat Translator Really Understand Cats? (Honest Limits) */}
      <section className="w-full bg-stone-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-3">
            <Badge variant="dev" className="bg-stone-800 text-stone-300 border-stone-700">
              Ethical AI Commitment
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Can an AI Really Translate Cat Language?
            </h2>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              We believe in total transparency. Many mobile apps falsely claim to possess a literal dictionary that translates English into meows and vice versa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-300">
            <div className="rounded-3xl bg-stone-800/80 border border-stone-700/80 p-6 space-y-2">
              <h4 className="font-bold text-white text-base">The Scientific Reality</h4>
              <p className="text-xs leading-relaxed text-stone-400">
                Cats communicate through a multi-modal blend of scent (pheromones), ear rotations, tail positions, pupil dilation, and acoustic inflections. Vocalizations are not words; they are emotional acoustic signals.
              </p>
            </div>

            <div className="rounded-3xl bg-stone-800/80 border border-stone-700/80 p-6 space-y-2">
              <h4 className="font-bold text-white text-base">How CatAnalyzer Helps</h4>
              <p className="text-xs leading-relaxed text-stone-400">
                By combining audio feature extraction with observed situational context, our AI acts as an ethological assistant, helping you interpret patterns and bond with your cat more intuitively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Tips for Recording Better Cat Audio */}
      <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-soft space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600">
              <Mic className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                How to Record a Clearer Cat Sound
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Practical tips for getting the most accurate acoustic interpretation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <span className="font-bold text-stone-900 block">1. Proximity</span>
              <p>Position your device microphone within 2 to 3 feet of your cat when they meow.</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <span className="font-bold text-stone-900 block">2. Minimize Noise</span>
              <p>Pause televisions, turn off noisy fans, and avoid talking during the recording.</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
              <span className="font-bold text-stone-900 block">3. Natural Timing</span>
              <p>Wait for your cat to vocalize naturally. Never force or provoke a sound.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Medical Non-Veterinary Advisory */}
      <section className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 sm:p-8 flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700 shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm text-rose-900">
            <h4 className="font-bold text-base text-rose-950">
              Medical Non-Veterinary Advisory
            </h4>
            <p className="leading-relaxed">
              CatAnalyzer is strictly an educational tool. Sudden, repeated, or strained vocalizations (especially while using the litter box, crying in the night, or accompanied by lethargy) may indicate urinary blockage, arthritis, cognitive dysfunction, or severe pain. Always consult a licensed veterinary doctor immediately if you notice concerning behavioral shifts.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: FAQ Accordion */}
      <section id="faq" className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <Badge variant="neutral">Frequently Asked Questions</Badge>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Cat Translator Questions & Answers
          </h2>
          <p className="text-sm text-stone-500">
            Everything you need to know about feline acoustic communication.
          </p>
        </div>

        <Accordion>
          {TRANSLATOR_FAQS.map((faq, idx) => (
            <AccordionItem key={idx} title={faq.question} defaultOpen={idx === 0}>
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
