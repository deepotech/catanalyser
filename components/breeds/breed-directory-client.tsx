"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BreedData } from "@/lib/data/breeds";

interface BreedDirectoryClientProps {
  breeds: BreedData[];
}

function BreedDirectoryContent({ breeds }: BreedDirectoryClientProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [coatFilter, setCoatFilter] = React.useState<string>("All");
  const [sizeFilter, setSizeFilter] = React.useState<string>("All");
  const [activityFilter, setActivityFilter] = React.useState<string>("All");
  const [groomingFilter, setGroomingFilter] = React.useState<string>("All");
  const [selectedLetter, setSelectedLetter] = React.useState<string>("All");

  // Available unique letters from all breed names
  const letters = React.useMemo(() => {
    const set = new Set<string>();
    breeds.forEach((b) => set.add(b.name[0].toUpperCase()));
    return ["All", ...Array.from(set).sort()];
  }, [breeds]);

  // Filtered breeds
  const filteredBreeds = React.useMemo(() => {
    return breeds.filter((breed) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = breed.name.toLowerCase().includes(query);
        const matchesAlias = breed.aliases.some((a) => a.toLowerCase().includes(query));
        const matchesOrigin = breed.origin.toLowerCase().includes(query);
        if (!matchesName && !matchesAlias && !matchesOrigin) return false;
      }

      // Letter filter
      if (selectedLetter !== "All" && breed.name[0].toUpperCase() !== selectedLetter) {
        return false;
      }

      // Coat filter
      if (coatFilter !== "All" && breed.appearance.coatLength !== coatFilter) {
        return false;
      }

      // Size filter
      if (sizeFilter !== "All" && breed.size !== sizeFilter) {
        return false;
      }

      // Activity filter
      if (activityFilter !== "All" && breed.traits.activityLevel !== activityFilter) {
        return false;
      }

      // Grooming filter
      if (groomingFilter !== "All" && breed.traits.groomingLevel !== groomingFilter) {
        return false;
      }

      return true;
    });
  }, [breeds, searchQuery, selectedLetter, coatFilter, sizeFilter, activityFilter, groomingFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    coatFilter !== "All" ||
    sizeFilter !== "All" ||
    activityFilter !== "All" ||
    groomingFilter !== "All" ||
    selectedLetter !== "All";

  const clearAllFilters = () => {
    setSearchQuery("");
    setCoatFilter("All");
    setSizeFilter("All");
    setActivityFilter("All");
    setGroomingFilter("All");
    setSelectedLetter("All");
  };

  return (
    <div className="space-y-8">
      {/* Search & Main Filter Controls */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-7 shadow-soft space-y-6">
        {/* Top Row: Search + Clear */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by breed name, alias, origin..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-stone-200 bg-stone-50/50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-stone-500 font-medium">
              Showing <strong className="text-stone-900 font-semibold">{filteredBreeds.length}</strong> of {breeds.length} breeds
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-4"
              >
                Reset all
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-100">
          {/* Coat Length */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Coat Length
            </label>
            <select
              value={coatFilter}
              onChange={(e) => setCoatFilter(e.target.value)}
              className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Coats</option>
              <option value="Shorthair">Shorthair</option>
              <option value="Semi-Longhair">Semi-Longhair</option>
              <option value="Longhair">Longhair</option>
              <option value="Hairless">Hairless</option>
            </select>
          </div>

          {/* Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Size
            </label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Very Large">Very Large</option>
            </select>
          </div>

          {/* Activity Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Activity Level
            </label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Energy Levels</option>
              <option value="Calm">Calm</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>

          {/* Grooming Needs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Grooming
            </label>
            <select
              value={groomingFilter}
              onChange={(e) => setGroomingFilter(e.target.value)}
              className="w-full text-xs font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Grooming</option>
              <option value="Low">Low Maintenance</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High Maintenance</option>
            </select>
          </div>
        </div>

        {/* A-Z Letter Index */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-stone-400 mr-2 shrink-0">A-Z:</span>
            {letters.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  className={`min-w-7 h-7 px-2 text-xs font-bold rounded-lg transition-colors shrink-0 ${
                    isSelected
                      ? "bg-brand-500 text-white shadow-xs"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Breed Cards */}
      {filteredBreeds.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBreeds.map((breed) => (
            <Card
              key={breed.id}
              className="group overflow-hidden border-stone-200/80 bg-white hover:border-brand-300 hover:shadow-soft transition-all duration-300 flex flex-col"
            >
              {/* Image Header with Badges */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={breed.imageUrl}
                  alt={`${breed.name} cat breed portrait`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge variant="brand" className="backdrop-blur-md bg-brand-500/90 shadow-xs">
                    {breed.appearance.coatLength}
                  </Badge>
                  {breed.badge && (
                    <Badge variant="dev" className="backdrop-blur-md bg-stone-900/80 text-white shadow-xs">
                      {breed.badge}
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-3 right-3">
                  <Badge variant="neutral" className="bg-white/95 text-stone-700 shadow-xs text-[11px]">
                    {breed.size}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <Link
                      href={`/cat-breeds/${breed.slug}`}
                      className="text-xl font-bold text-stone-900 hover:text-brand-600 transition-colors"
                    >
                      {breed.name}
                    </Link>
                    <span className="text-xs text-stone-400 shrink-0 font-medium">
                      {breed.origin}
                    </span>
                  </div>

                  {breed.aliases.length > 0 && (
                    <p className="text-[11px] text-stone-400 font-medium truncate">
                      Also: {breed.aliases.join(", ")}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                    {breed.shortDescription}
                  </p>
                </div>

                {/* Key Visual Markers Snippet */}
                <div className="space-y-1.5 pt-3 border-t border-stone-100">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block">
                    Phenotypic Markers:
                  </span>
                  <div className="space-y-1">
                    {breed.keyVisualIdentifiers.slice(0, 2).map((marker, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-stone-700 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{marker}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personality Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {breed.traits.personality.slice(0, 3).map((p, idx) => (
                    <span
                      key={idx}
                      className="inline-block text-[11px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-2">
                  <Link
                    href={`/cat-breeds/${breed.slug}`}
                    className="inline-flex items-center justify-center text-xs font-semibold py-2 px-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                  >
                    View Guide
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5 text-stone-400" />
                  </Link>

                  <Link
                    href={`/cat-breed-identifier`}
                    className="inline-flex items-center justify-center text-xs font-semibold py-2 px-3 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1 text-brand-500 fill-current" />
                    Scan Traits
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
            <Filter className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900">No matching breeds found</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              We couldn&apos;t find any cat breeds matching your current filters. Try resetting your criteria or searching for another term.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="font-semibold">
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export function BreedDirectoryClient(props: BreedDirectoryClientProps) {
  return (
    <React.Suspense fallback={<div className="h-48 w-full animate-pulse rounded-3xl bg-stone-100" />}>
      <BreedDirectoryContent {...props} />
    </React.Suspense>
  );
}
