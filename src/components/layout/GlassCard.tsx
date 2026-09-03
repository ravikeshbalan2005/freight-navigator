import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("glass-panel rounded-3xl p-6", className)}>{children}</div>;
}

export function CardTitle({
  title,
  meta,
}: {
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      {meta && <span className="text-xs text-soft">{meta}</span>}
    </div>
  );
}
