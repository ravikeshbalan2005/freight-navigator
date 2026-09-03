import { formatTimeAgo } from "@/lib/format";
import type { RiskAlert } from "@/types";

const dot: Record<RiskAlert["severity"], string> = {
  high: "bg-danger",
  medium: "bg-warn",
  low: "bg-mint",
  action: "bg-sky",
};

export function WarningFeed({ alerts }: { alerts: RiskAlert[] }) {
  return (
    <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
      {alerts.map((a) => (
        <div key={a.id} className="flex gap-3 rounded-2xl bg-glass-strong p-3">
          <span className={`mt-1.5 size-2 shrink-0 rounded-full ${dot[a.severity]}`} />
          <div>
            <div className="text-sm font-semibold text-ink">{a.title}</div>
            <div className="text-xs text-soft">{a.detail}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wide text-soft">
              {a.category} · {formatTimeAgo(a.timestamp)}
            </div>
          </div>
        </div>
      ))}
      {alerts.length === 0 && (
        <p className="rounded-2xl bg-glass-strong p-4 text-sm text-soft">
          No alerts match the selected filters.
        </p>
      )}
    </div>
  );
}
