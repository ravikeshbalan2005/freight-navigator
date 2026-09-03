import type { MarketDriver } from "@/types";

export function MarketDriversPanel({ drivers }: { drivers: MarketDriver[] }) {
  return (
    <div className="mt-4 space-y-3">
      {drivers.map((d) => {
        const width = Math.min(Math.abs(d.impact), 100);
        const positive = d.impact >= 0;
        return (
          <div key={d.label} className="rounded-2xl bg-glass-strong p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-ink">{d.label}</span>
              <span className={positive ? "text-up font-semibold" : "text-down font-semibold"}>
                {positive ? "+" : ""}
                {d.impact}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${positive ? "bg-mint" : "bg-candy"}`}
                style={{ width: `${width}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-soft">{d.note}</p>
          </div>
        );
      })}
    </div>
  );
}
