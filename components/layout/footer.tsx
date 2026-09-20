import Link from "next/link";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-stone-50 text-stone-600">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
                <Sparkles className="h-4 w-4 fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900">
                Cat<span className="text-brand-500">Analyzer</span>
              </span>
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed">
              Dedicated to helping cat owners understand their cats through transparent AI visual breed recognition and behavioral sound interpretation.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Built with pet care & privacy in mind</span>
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              AI Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cat-breed-identifier" className="hover:text-brand-600 transition-colors">
                  AI Cat Breed Identifier
                </Link>
              </li>
              <li>
                <Link href="/cat-translator" className="hover:text-brand-600 transition-colors">
                  AI Cat Sound Interpreter
                </Link>
              </li>
              <li>
                <span className="text-stone-400 text-xs">
                  My Cat Profile <span className="ml-1 text-[10px] bg-stone-200/70 text-stone-600 px-1.5 py-0.5 rounded">Upcoming</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Explore & Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cat-breeds" className="hover:text-brand-600 transition-colors">
                  Cat Breed Directory
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-brand-600 transition-colors">
                  Side-by-Side Comparisons
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-brand-600 transition-colors">
                  How AI Visual Matching Works
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-brand-600 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Transparency & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ai-disclaimer" className="text-stone-500 hover:text-brand-600 transition-colors">
                  AI Disclaimer & Methodology
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-stone-500 hover:text-brand-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-stone-500 hover:text-brand-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p suppressHydrationWarning>© {new Date().getFullYear()} CatAnalyzer.com. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for cat lovers worldwide</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
