import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft animate-pulse">
        <Sparkles className="h-7 w-7 fill-current animate-spin" style={{ animationDuration: "3s" }} />
      </div>
      <p className="text-xs font-semibold text-stone-400 tracking-wide uppercase">
        Loading CatAnalyzer...
      </p>
    </div>
  );
}
