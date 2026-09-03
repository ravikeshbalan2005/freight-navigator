import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format";
import type { VesselSpec } from "@/types";

export function VesselSpecCard({
  spec,
  recommended = false,
}: {
  spec: VesselSpec;
  recommended?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-glass-strong p-4",
        recommended && "bg-gradient-to-br from-sky/40 to-mint/40 ring-2 ring-ring",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-display font-bold text-ink">{spec.klass}</span>
        {recommended && (
          <span className="rounded-full bg-candy/40 px-2 py-0.5 text-[10px] font-semibold text-ink">
            Recommended
          </span>
        )}
      </div>
      <div className="mt-0.5 text-[11px] text-soft">
        {spec.dwtMin.toLocaleString()}–{spec.dwtMax.toLocaleString()} DWT
      </div>
      <dl className="mt-3 space-y-1.5 text-xs">
        {[
          ["LOA", `${spec.loa} m`],
          ["Beam", `${spec.beam} m`],
          ["Draft", `${spec.draft} m`],
          ["Load rate", `${spec.loadRate.toLocaleString()} t/day`],
          ["Rate", `${formatUsd(spec.ratePerTonne)}/t`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <dt className="text-soft">{k}</dt>
            <dd className="font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
