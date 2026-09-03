import { useState } from "react";
import { useMapData } from "@/hooks/useMapData";

/**
 * Lightweight SVG route map — no external map SDK, so it renders identically
 * during SSR and in the browser.
 */
export function InteractiveRouteMap() {
  const { ports, vessels } = useMapData();
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="relative mt-4 h-80 overflow-hidden rounded-2xl bg-gradient-to-br from-sky/30 via-lilac/20 to-mint/30">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * 12.5}
            x2={100}
            y2={i * 12.5}
            stroke="var(--color-glass-border)"
            strokeWidth={0.2}
          />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * 12.5}
            y1={0}
            x2={i * 12.5}
            y2={100}
            stroke="var(--color-glass-border)"
            strokeWidth={0.2}
          />
        ))}
        <path
          d="M 101 82 Q 60 70 51 61"
          fill="none"
          stroke="var(--color-candy)"
          strokeWidth={0.5}
          strokeDasharray="2 1.5"
        />
      </svg>

      {ports.map((p) => (
        <button
          key={p.code}
          type="button"
          onMouseEnter={() => setHover(p.code)}
          onMouseLeave={() => setHover(null)}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <span className="block size-2.5 rounded-full bg-ink ring-4 ring-white/60" />
          <span className="mt-1 block whitespace-nowrap text-[10px] font-semibold text-ink">
            {p.name}
          </span>
          {hover === p.code && (
            <span className="glass-soft absolute left-4 top-0 z-10 w-44 rounded-xl p-2 text-left text-[10px] text-soft shadow-[var(--shadow-glass)]">
              Draft {p.maxDraft} m · LOA {p.maxLoa} m
              <br />
              Congestion {p.congestion}%
            </span>
          )}
        </button>
      ))}

      {vessels.map((v) => (
        <div
          key={v.id}
          title={`${v.name} · ${v.status}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${v.x}%`, top: `${v.y}%` }}
        >
          <span
            className={`block size-3 rotate-45 rounded-sm ${
              v.status === "idle" ? "bg-candy" : "bg-mint"
            } ring-2 ring-white/70`}
          />
        </div>
      ))}

      <div className="glass-soft absolute bottom-3 right-3 rounded-xl px-3 py-2 text-[10px] text-soft">
        <span className="mr-3 inline-flex items-center gap-1.5">
          <span className="size-2 rotate-45 bg-mint" /> Under way
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rotate-45 bg-candy" /> Idle
        </span>
      </div>
    </div>
  );
}
