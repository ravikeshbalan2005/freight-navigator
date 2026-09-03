import { RISK_CATEGORIES } from "@/lib/constants";
import type { RiskAlert } from "@/types";

export function RiskFilters({
  active,
  onToggle,
}: {
  active: RiskAlert["category"][];
  onToggle: (key: RiskAlert["category"]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {RISK_CATEGORIES.map((c) => {
        const on = active.includes(c.key as RiskAlert["category"]);
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onToggle(c.key as RiskAlert["category"])}
            className={`rounded-2xl px-4 py-2 text-xs font-semibold transition ${
              on
                ? "bg-gradient-to-r from-sky to-mint text-ink shadow-[var(--shadow-accent)]"
                : "bg-glass-strong text-soft"
            }`}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
