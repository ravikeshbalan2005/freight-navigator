import { Sparkles } from "lucide-react";
import { formatCompactUsd } from "@/lib/format";
import type { CharterRecommendation } from "@/types";

export function AiResultsPanel({
  recommendation,
  isPending,
}: {
  recommendation?: CharterRecommendation;
  isPending: boolean;
}) {
  if (isPending) {
    return (
      <div className="rounded-2xl bg-glass-strong p-6 text-sm text-soft">
        Scoring vessel classes against port constraints…
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="rounded-2xl bg-glass-strong p-6 text-sm text-soft">
        Enter your cargo and route, then run the optimizer to see the recommended vessel,
        booking window and contract strategy.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-sky/40 to-mint/40 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-soft">
          <Sparkles className="size-4" /> AI decision
        </div>
        <p className="mt-2 font-display text-xl font-bold leading-snug text-ink">
          Charter a {recommendation.vessel.klass} — {recommendation.bookingWindow.toLowerCase()}.
        </p>
        <p className="mt-1 text-sm text-soft">
          {recommendation.riskLabel} · estimated saving{" "}
          {formatCompactUsd(recommendation.estimatedSaving)} over three spot voyages.
        </p>
      </div>

      <div className="rounded-2xl bg-glass-strong p-5">
        <h3 className="font-display font-bold text-ink">Why this recommendation</h3>
        <ul className="mt-3 space-y-2 text-sm text-soft">
          {recommendation.reasoning.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-candy" />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
