import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Info, ShieldAlert, CheckCircle2 } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "destructive" | "success" | "dev";
  title?: string;
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  const icons = {
    info: <Info className="h-4 w-4 text-blue-600 shrink-0" />,
    warning: <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />,
    destructive: <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
    dev: <Info className="h-4 w-4 text-purple-600 shrink-0" />,
  };

  const styles = {
    info: "bg-blue-50/70 border-blue-200 text-blue-900",
    warning: "bg-amber-50/80 border-amber-200 text-amber-900",
    destructive: "bg-rose-50/80 border-rose-200 text-rose-900",
    success: "bg-emerald-50/80 border-emerald-200 text-emerald-900",
    dev: "bg-purple-50/80 border-purple-200 text-purple-900",
  };

  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border p-4 text-xs leading-relaxed",
        styles[variant],
        className
      )}
      {...props}
    >
      <div className="mt-0.5">{icons[variant]}</div>
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold">{title}</h5>}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}
