import { CARGO_TYPES, PORTS } from "@/lib/constants";
import type { CharterRequest } from "@/types";

const box =
  "w-full rounded-2xl bg-glass-strong border border-glass-border px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-ring";

export function CharterInputForm({
  request,
  onChange,
  onSubmit,
  isPending,
}: {
  request: CharterRequest;
  onChange: <K extends keyof CharterRequest>(key: K, value: CharterRequest[K]) => void;
  onSubmit: () => void;
  isPending: boolean;
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-soft">Load port</span>
          <select
            className={box}
            value={request.originCode}
            onChange={(e) => onChange("originCode", e.target.value)}
          >
            {PORTS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name} · draft {p.maxDraft} m
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-soft">Discharge port</span>
          <select
            className={box}
            value={request.destinationCode}
            onChange={(e) => onChange("destinationCode", e.target.value)}
          >
            {PORTS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name} · draft {p.maxDraft} m
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-soft">Cargo</span>
          <select
            className={box}
            value={request.cargo}
            onChange={(e) => onChange("cargo", e.target.value as CharterRequest["cargo"])}
          >
            {CARGO_TYPES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-soft">Quantity (tonnes)</span>
          <input
            type="number"
            className={box}
            min={5000}
            max={200000}
            step={1000}
            value={request.tonnage}
            onChange={(e) => onChange("tonnage", Number(e.target.value))}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-soft">Laycan start</span>
          <input
            type="date"
            className={box}
            value={request.laycanStart}
            onChange={(e) => onChange("laycanStart", e.target.value)}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-soft">
            Planning horizon: {request.horizonWeeks} weeks
          </span>
          <input
            type="range"
            min={4}
            max={12}
            value={request.horizonWeeks}
            onChange={(e) => onChange("horizonWeeks", Number(e.target.value))}
            className="w-full accent-candy"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-gradient-to-r from-sky to-mint py-3 font-display font-bold text-ink shadow-[var(--shadow-accent)] transition hover:brightness-105 disabled:opacity-60"
      >
        {isPending ? "Optimising charter…" : "Run charter optimizer"}
      </button>
    </form>
  );
}
