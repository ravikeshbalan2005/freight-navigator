import { formatCompactUsd, formatUsd } from "@/lib/format";
import type { StrategyOption } from "@/types";

export function StrategyComparison({ strategies }: { strategies: StrategyOption[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs text-soft">
            <th className="px-3 py-2 font-medium">Strategy</th>
            <th className="px-3 py-2 font-medium">Rate / t</th>
            <th className="px-3 py-2 font-medium">Committed cost</th>
            <th className="px-3 py-2 font-medium">Flexibility</th>
            <th className="px-3 py-2 font-medium">Risk exposure</th>
          </tr>
        </thead>
        <tbody>
          {strategies.map((s) => (
            <tr
              key={s.name}
              className={`rounded-2xl ${s.recommended ? "bg-gradient-to-r from-sky/30 to-mint/30" : "bg-glass-strong"}`}
            >
              <td className="rounded-l-2xl px-3 py-3 font-semibold text-ink">
                {s.name}
                {s.recommended && (
                  <span className="ml-2 rounded-full bg-candy/40 px-2 py-0.5 text-[10px] font-semibold">
                    Best
                  </span>
                )}
              </td>
              <td className="px-3 py-3 text-ink">{formatUsd(s.costPerTonne)}</td>
              <td className="px-3 py-3 text-ink">{formatCompactUsd(s.totalCost)}</td>
              <td className="px-3 py-3 text-soft">{s.flexibility}</td>
              <td className="rounded-r-2xl px-3 py-3 text-soft">{s.riskExposure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
