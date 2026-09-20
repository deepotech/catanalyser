"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-stone-200/80 py-4 transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-left font-medium text-stone-900 transition-all hover:text-brand-600 focus-visible:outline-none"
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg font-semibold">{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-stone-400 transition-transform duration-200",
            isOpen && "rotate-180 text-brand-600"
          )}
        />
      </button>
      {isOpen && (
        <div className="pt-2 pb-3 text-stone-600 text-sm sm:text-base leading-relaxed animate-in fade-in-50 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("divide-y divide-stone-100", className)}>{children}</div>;
}
