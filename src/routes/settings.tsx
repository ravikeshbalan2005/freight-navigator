import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, CardTitle } from "@/components/layout/GlassCard";
import { RISK_CATEGORIES } from "@/lib/constants";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — Cargolens" },
      {
        name: "description",
        content:
          "Manage your chartering profile, default trade lane, alert preferences and forecasting data source.",
      },
      { property: "og:title", content: "Profile & Settings — Cargolens" },
      {
        property: "og:description",
        content: "Tune alerts, default routes and the forecasting backend connection.",
      },
    ],
  }),
  component: SettingsPage,
});

const box =
  "w-full rounded-2xl bg-glass-strong border border-glass-border px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-ring";

function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile & Settings" subtitle="Your chartering desk preferences" />

      <section className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <CardTitle title="Profile" />
          <div className="mt-4 flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-candy to-lilac font-display text-lg font-bold text-ink">
              PS
            </div>
            <div>
              <div className="font-display font-bold text-ink">Priya Sharma</div>
              <div className="text-xs text-soft">Chartering Manager · Bulk Procurement</div>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-soft">Company</span>
              <input className={box} defaultValue="Eastern Bulk Carriers" />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-soft">Default trade lane</span>
              <input className={box} defaultValue="Australia → East Coast India" />
            </label>
          </div>
        </GlassCard>

        <GlassCard>
          <CardTitle title="Alert Preferences" />
          <div className="mt-4 space-y-3">
            {RISK_CATEGORIES.map((c) => (
              <label
                key={c.key}
                className="flex items-center justify-between rounded-2xl bg-glass-strong px-4 py-3 text-sm text-ink"
              >
                {c.label}
                <input type="checkbox" defaultChecked className="size-4 accent-candy" />
              </label>
            ))}
          </div>
        </GlassCard>
      </section>

      <GlassCard>
        <CardTitle title="Forecasting Data Source" />
        <p className="mt-3 text-sm text-soft">
          The dashboard runs on the built-in forecasting simulation. Set{" "}
          <code className="rounded bg-glass-strong px-1.5 py-0.5 text-ink">VITE_API_BASE_URL</code>{" "}
          to your SIH backend to route forecast, optimizer, fleet and risk calls to live endpoints.
        </p>
        <div className="mt-3 rounded-2xl bg-glass-strong px-4 py-3 text-sm text-ink">
          Current source: {API_BASE_URL || "built-in simulation engine"}
        </div>
      </GlassCard>
    </div>
  );
}
