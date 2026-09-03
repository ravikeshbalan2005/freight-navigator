import { AlertTriangle, Activity, RefreshCw } from "lucide-react";
import type { RiskAlert } from "@/types";

const styles: Record<
  RiskAlert["severity"],
  { row: string; chip: string; icon: typeof AlertTriangle; label: string }
> = {
  high: {
    row: "bg-danger/10 border-danger/20",
    chip: "bg-danger/15 text-danger",
    icon: AlertTriangle,
    label: "High",
  },
  medium: {
    row: "bg-warn/10 border-warn/20",
    chip: "bg-warn/15 text-warn",
    icon: Activity,
    label: "Medium",
  },
  low: {
    row: "bg-mint/20 border-mint/30",
    chip: "bg-mint/40 text-ink",
    icon: Activity,
    label: "Low",
  },
  action: {
    row: "bg-sky/20 border-sky/30",
    chip: "bg-sky/40 text-ink",
    icon: RefreshCw,
    label: "Action",
  },
};

export function ActiveAlertsList({ alerts }: { alerts: RiskAlert[] }) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {alerts.map((alert) => {
        const s = styles[alert.severity];
        const Icon = s.icon;
        return (
          <div
            key={alert.id}
            className={`flex items-center gap-3 rounded-2xl border p-3 ${s.row}`}
          >
            <span className={`grid size-9 place-items-center rounded-xl ${s.chip}`}>
              <Icon className="size-4" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink">{alert.title}</div>
              <div className="text-xs text-soft">{alert.detail}</div>
            </div>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${s.chip}`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
