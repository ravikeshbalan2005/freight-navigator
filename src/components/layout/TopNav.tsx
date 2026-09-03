import { Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useRiskAlerts } from "@/hooks/useRiskAlerts";

export function TopNav({ greeting }: { greeting: string }) {
  const { alerts } = useRiskAlerts();
  const highPriority = alerts.filter((a) => a.severity === "high").length;

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="font-display text-2xl font-bold text-ink">{greeting}</div>
      <div className="flex items-center gap-3">
        <label className="glass-panel hidden w-64 items-center gap-2 rounded-2xl px-4 py-2.5 md:flex">
          <Search className="size-4 text-soft" />
          <input
            type="search"
            placeholder="Search routes, vessels, cargoes…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-soft"
          />
        </label>
        <Link
          to="/risk"
          aria-label="Risk alerts"
          className="glass-panel relative grid size-11 place-items-center rounded-2xl text-soft"
        >
          <Bell className="size-4" />
          {highPriority > 0 && (
            <span className="absolute right-2.5 top-2 size-2.5 rounded-full bg-candy ring-2 ring-white" />
          )}
        </Link>
        <Link
          to="/settings"
          className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-candy to-lilac font-display font-bold text-ink"
        >
          PS
        </Link>
      </div>
    </header>
  );
}
