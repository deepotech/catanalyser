"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreedData } from "@/lib/data/breeds";

interface ComparePickerProps {
  breeds: BreedData[];
  defaultSlugA?: string;
  defaultSlugB?: string;
}

export function ComparePicker({
  breeds,
  defaultSlugA = "maine-coon",
  defaultSlugB = "norwegian-forest-cat",
}: ComparePickerProps) {
  const router = useRouter();
  const [slugA, setSlugA] = React.useState(defaultSlugA);
  const [slugB, setSlugB] = React.useState(defaultSlugB);

  const isSameBreed = slugA === slugB;

  const handleSwap = () => {
    const temp = slugA;
    setSlugA(slugB);
    setSlugB(temp);
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSameBreed) return;
    router.push(`/compare/${slugA}-vs-${slugB}`);
  };

  return (
    <form
      onSubmit={handleCompare}
      className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-soft space-y-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-stone-900">
          Compare Any Two Cat Breeds
        </h2>
        <span className="text-xs text-stone-400 font-medium">16 Breeds Available</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 sm:gap-4 items-center">
        {/* Breed 1 */}
        <div className="sm:col-span-5 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            First Cat Breed
          </label>
          <select
            value={slugA}
            onChange={(e) => setSlugA(e.target.value)}
            className="w-full text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {breeds.map((b) => (
              <option key={`a-${b.slug}`} value={b.slug}>
                {b.name} ({b.appearance.coatLength})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Icon */}
        <div className="sm:col-span-1 flex justify-center pt-2 sm:pt-6">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap breeds"
            className="h-10 w-10 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        {/* Breed 2 */}
        <div className="sm:col-span-5 space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Second Cat Breed
          </label>
          <select
            value={slugB}
            onChange={(e) => setSlugB(e.target.value)}
            className="w-full text-sm font-semibold text-stone-900 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {breeds.map((b) => (
              <option key={`b-${b.slug}`} value={b.slug}>
                {b.name} ({b.appearance.coatLength})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isSameBreed && (
        <p className="text-xs text-rose-500 font-medium text-center">
          Please select two different breeds to compare.
        </p>
      )}

      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          disabled={isSameBreed}
          size="lg"
          className="w-full sm:w-auto font-bold gap-2 shadow-sm"
        >
          Compare Breeds Side-by-Side
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
