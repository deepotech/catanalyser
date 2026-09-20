import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "subtle";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-xl";

    const variantStyles = {
      primary:
        "bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] shadow-sm hover:shadow-md",
      secondary:
        "bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98] shadow-sm",
      outline:
        "border border-stone-200 bg-white text-stone-800 hover:bg-stone-50 hover:border-stone-300",
      ghost:
        "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80",
      subtle:
        "bg-brand-50 text-brand-700 hover:bg-brand-100",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs tracking-wide",
      md: "h-11 px-5 text-sm",
      lg: "h-13 px-7 text-base font-semibold",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
