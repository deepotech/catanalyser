"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalRouteError({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Log sanitized error details to monitoring service without exposing stack traces to the user
    console.error("[Route Error Boundary caught]:", error.message);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-soft">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Something Unexpected Happened
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            We encountered a temporary issue while loading this page. No data was lost, and any uploaded media remains private and unrecorded.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-stone-400 bg-stone-50 py-2 px-3 rounded-xl border border-stone-100">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Zero permanent media storage · Privacy guaranteed</span>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="md"
            onClick={() => reset()}
            className="w-full sm:w-auto font-bold gap-2 shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto font-semibold gap-2">
              <Home className="h-4 w-4 text-stone-400" />
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
