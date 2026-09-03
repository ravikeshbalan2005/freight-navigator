import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { CharterRecommendation } from "@/types";

export function AiRecommendationCard({
  recommendation,
}: {
  recommendation?: CharterRecommendation;
}) {
  const strategy =
    recommendation?.strategies.find((s) => s.recommended) ?? recommendation?.strategies[0];

  return (
    <div className="glass-panel flex flex-col rounded-3xl bg-gradient-to-br from-glass-strong to-sky/30 p-6">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-xl bg-gradient-to-br from-candy to-lilac text-sm text-ink">
          <Sparkles className="size-4" />
        </span>
        <h2 className="font-display font-bold text-ink">AI Recommendation</h2>
      </div>

      <div className="mt-4 rounded-2xl bg-glass-strong p-4">
        <div className="text-[11px] text-soft">Vessel type</div>
        <div className="mt-0.5 font-display text-xl font-bold text-ink">
          {recommendation?.vessel.klass ?? "—"}
        </div>
        <div className="text-xs text-soft">
          {recommendation
            ? `Draft ${recommendation.vessel.draft} m · LOA ${recommendation.vessel.loa} m`
            : "Analysing route constraints"}
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-glass-strong p-4">
        <div className="text-[11px] text-soft">Best booking window</div>
        <div className="mt-0.5 font-display text-xl font-bold text-ink">
          {recommendation?.bookingWindow ?? "—"}
        </div>
        <div className="text-xs text-soft">
          Rates trending {recommendation?.trend ?? "—"}
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-glass-strong p-4">
        <div className="text-[11px] text-soft">Suggested strategy</div>
        <div className="mt-0.5 font-display text-lg font-bold text-ink">
          {strategy?.name ?? "—"}
        </div>
        <div className="text-xs text-soft">{strategy?.riskExposure ?? ""}</div>
      </div>

      <Link
        to="/optimizer"
        className="mt-4 rounded-2xl bg-gradient-to-r from-sky to-mint py-3 text-center font-display font-bold text-ink shadow-[var(--shadow-accent)] transition hover:brightness-105"
      >
        Generate Charter Plan
      </Link>
    </div>
  );
}
