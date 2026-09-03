import { CARGO_TYPES, PORTS } from "@/lib/constants";
import type { CharterRequest } from "@/types";

const field =
  "rounded-2xl bg-glass-strong border border-glass-border px-4 py-2 text-sm font-medium text-ink outline-none focus:ring-2 focus:ring-ring";

export function RouteSelector({
  request,
  onChange,
}: {
  request: CharterRequest;
  onChange: <K extends keyof CharterRequest>(key: K, value: CharterRequest[K]) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className={field}>
        <span className="text-soft">Origin: </span>
        <select
          className="bg-transparent font-medium outline-none"
          value={request.originCode}
          onChange={(e) => onChange("originCode", e.target.value)}
        >
          {PORTS.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}, {p.country}
            </option>
          ))}
        </select>
      </label>
      <span className="text-soft">→</span>
      <label className={field}>
        <span className="text-soft">Destination: </span>
        <select
          className="bg-transparent font-medium outline-none"
          value={request.destinationCode}
          onChange={(e) => onChange("destinationCode", e.target.value)}
        >
          {PORTS.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}, {p.country}
            </option>
          ))}
        </select>
      </label>
      <label className={field}>
        <span className="text-soft">Cargo: </span>
        <select
          className="bg-transparent font-medium outline-none"
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
      <label className={field}>
        <span className="text-soft">Tonnage: </span>
        <input
          type="number"
          step={1000}
          min={5000}
          max={200000}
          value={request.tonnage}
          onChange={(e) => onChange("tonnage", Number(e.target.value))}
          className="w-24 bg-transparent font-medium outline-none"
        />
      </label>
    </div>
  );
}
