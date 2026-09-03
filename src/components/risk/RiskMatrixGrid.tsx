import type { RiskAlert } from "@/types";

const LEVELS = [5, 4, 3, 2, 1];

const cellTone = (p: number, i: number) => {
  const s = p * i;
  if (s >= 15) return "bg-danger/20";
  if (s >= 8) return "bg-warn/20";
  return "bg-mint/25";
};

export function RiskMatrixGrid({ alerts }: { alerts: RiskAlert[] }) {
  return (
    <div className="mt-4 grid grid-cols-[auto_repeat(5,1fr)] gap-1.5 text-[10px]">
      {LEVELS.map((p) => (
        <Fragment key={p}>
          <div className="flex items-center justify-end pr-2 text-soft">
            P{p}
          </div>
          {[1, 2, 3, 4, 5].map((i) => {
            const hits = alerts.filter((a) => a.probability === p && a.impact === i);
            return (
              <div
                key={`${p}-${i}`}
                className={`min-h-14 rounded-xl p-1.5 ${cellTone(p, i)}`}
              >
                {hits.map((h) => (
                  <div
                    key={h.id}
                    title={h.title}
                    className="mb-1 truncate rounded-lg bg-glass-strong px-1.5 py-1 text-[10px] font-medium text-ink"
                  >
                    {h.title}
                  </div>
                ))}
              </div>
            );
          })}
        </Fragment>
      ))}
      <div />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={`i${i}`} className="pt-1 text-center text-soft">
          Impact {i}
        </div>
      ))}
    </div>
  );
}
