import Link from "next/link";
import { Sparkles, ArrowLeft, Search, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 border border-brand-100 text-brand-600 shadow-soft">
          <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: "12s" }} />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white text-[11px] font-mono font-bold">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Even the most curious cats sometimes wander off the trail. The page or comparison you are looking for does not exist or has moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button size="md" className="w-full sm:w-auto font-bold gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/cat-breeds" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto font-semibold gap-2">
              <Search className="h-4 w-4 text-stone-400" />
              Explore Breed Directory
            </Button>
          </Link>
        </div>

        {/* Helpful quick routes */}
        <div className="pt-6 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs font-semibold text-stone-600">
          <Link
            href="/cat-breed-identifier"
            className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 hover:text-brand-600 transition-colors"
          >
            AI Breed Identifier →
          </Link>
          <Link
            href="/cat-translator"
            className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 hover:text-brand-600 transition-colors"
          >
            AI Sound Interpreter →
          </Link>
        </div>
      </div>
    </div>
  );
}
