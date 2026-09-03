import { cn } from "@/lib/utils";

export function KpiWidget({
  label,
  value,
  suffix,
  delta,
  tone = "up",
  highlight = false,
}: {
  label: string;
  value: string;
  suffix?: string;
  delta: string;
  tone?: "up" | "down" | "info" | "warn";
  highlight?: boolean;
}) {
  const toneClass = {
    up: "text-up",
    down: "text-down",
    info: "text-info",
    warn: "text-warn",
  }[tone];

  return (
    <div
      className={cn(
        "glass-panel rounded-3xl p-5",
        highlight && "bg-gradient-to-br from-candy/30 to-lilac/30",
      )}
    >
      <div className="text-xs font-medium text-soft">{label}</div>
      <div className="mt-2 font-display text-3xl font-bold text-ink">
        {value}
        {suffix && <span className="text-base text-soft">{suffix}</span>}
      </div>
      <div className={cn("mt-1 text-xs font-semibold", toneClass)}>{delta}</div>
    </div>
  );
}
