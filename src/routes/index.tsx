import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, CardTitle } from "@/components/layout/GlassCard";
import { KpiWidget } from "@/components/dashboard/KpiWidget";
import { AiRecommendationCard } from "@/components/dashboard/AiRecommendationCard";
import { ActiveAlertsList } from "@/components/dashboard/ActiveAlertsList";
import { ForecastChart } from "@/components/forecast/ForecastChart";
import { useForecastData, DEFAULT_REQUEST } from "@/hooks/useForecastData";
import { useRiskAlerts } from "@/hooks/useRiskAlerts";
import { useFleetSchedule } from "@/hooks/useFleetSchedule";
import { buildRecommendation } from "@/lib/engine";
import { formatPct } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — Cargolens Freight Intelligence" },
      {
        name: "description",
        content:
          "AI-powered bulk chartering command center: freight rate forecasts, vessel recommendations, idle-time reduction and live risk alerts.",
      },
      { property: "og:title", content: "Command Center — Cargolens Freight Intelligence" },
      {
        property: "og:description",
        content:
          "Predict freight rates, pick the right vessel and lock the best booking window for bulk cargo charters.",
      },
    ],
  }),
  component: CommandCenter,
});

function CommandCenter() {
  const { data: forecast } = useForecastData();
  const { alerts } = useRiskAlerts();
  const { data: fleet } = useFleetSchedule();

  const recommendation = buildRecommendation(DEFAULT_REQUEST);
  const idleDays = fleet ? fleet.vessels.reduce((a, v) => a + v.idleDays, 0) : 0;
  const active = fleet ? fleet.vessels.filter((v) => v.status !== "idle").length : 0;
  const latest = forecast?.series.find((p) => p.period === "W-1")?.historical ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiWidget
          label="Avg Freight Rate"
          value={`$${latest.toFixed(2)}`}
          suffix="/t"
          delta={`${formatPct(forecast?.changePct ?? 0)} forecast horizon`}
          tone={(forecast?.changePct ?? 0) >= 0 ? "up" : "down"}
        />
        <KpiWidget
          label="Active Vessels"
          value={`${active}`}
          suffix={`/${fleet?.vessels.length ?? 0}`}
          delta={`${fleet?.repositioning.length ?? 0} repositioning suggestions`}
          tone="info"
        />
        <KpiWidget
          label="Idle Days (30d)"
          value={idleDays.toFixed(1)}
          delta="Reduce via repositioning"
          tone="warn"
        />
        <KpiWidget
          label="Open Risk Alerts"
          value={`${alerts.length}`}
          delta={`${alerts.filter((a) => a.severity === "high").length} high priority`}
          tone="down"
          highlight
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Freight Rate Forecast</h2>
              <p className="mt-0.5 text-xs text-soft">Newcastle → Paradip · Coal · 50,000 t</p>
            </div>
            <Link
              to="/forecast"
              className="rounded-full bg-glass-strong px-3 py-1 text-[11px] font-semibold text-ink"
            >
              Open forecast
            </Link>
          </div>

          {forecast && <ForecastChart series={forecast.series} />}

          <div className="mt-5 grid grid-cols-3 gap-3">
            {(forecast?.drivers ?? []).slice(0, 3).map((d) => (
              <div key={d.label} className="rounded-2xl bg-glass-strong p-3">
                <div className="text-[11px] text-soft">{d.label}</div>
                <div className="text-sm font-semibold text-ink">
                  {d.impact > 0 ? "Rising" : d.impact < 0 ? "Easing" : "Stable"}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <AiRecommendationCard recommendation={recommendation} />
      </section>

      <GlassCard>
        <CardTitle title="Active Alerts" meta="Live · updated just now" />
        <ActiveAlertsList alerts={alerts.slice(0, 3)} />
      </GlassCard>
    </div>
  );
}
