import { MoveRight } from "lucide-react";
import type { RepositioningSuggestion } from "@/types";

export function RepositioningList({ items }: { items: RepositioningSuggestion[] }) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <div key={item.vesselId} className="rounded-2xl bg-glass-strong p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink">{item.vesselName}</span>
            <span className="rounded-full bg-mint/40 px-2.5 py-1 text-[11px] font-semibold text-ink">
              −{item.idleDaysSaved} idle days
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-ink">
            {item.from}
            <MoveRight className="size-4 text-soft" />
            {item.to}
          </div>
          <p className="mt-1 text-xs text-soft">{item.cargoHint}</p>
        </div>
      ))}
    </div>
  );
}
