import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, CardTitle } from "@/components/layout/GlassCard";
import { RiskMatrixGrid } from "@/components/risk/RiskMatrixGrid";
import { RiskFilters } from "@/components/risk/RiskFilters";
import { WarningFeed } from "@/components/risk/WarningFeed";
import { useRiskAlerts } from "@/hooks/useRiskAlerts";

export const Route = createFileRoute("/risk")({
  head: () => ({
    meta: [
      { title: "Risk Radar — Cargolens" },
      {
        name: "description",
        content:
          "Early warnings on freight volatility, port congestion, weather disruption, supply shifts and vessel availability.",
      },
      { property: "og:title", content: "Risk Radar — Cargolens" },
      {
        property: "og:description",
        content: "Probability vs impact matrix and a live feed of chartering risks.",
      },
    ],
  }),
  component: RiskPage,
});

function RiskPage() {
  const { alerts, active, toggle } = useRiskAlerts();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Risk Radar"
        subtitle="Early warnings across congestion, volatility, weather, supply and availability"
      />

      <GlassCard>
        <CardTitle title="Filters" meta={`${alerts.length} alerts shown`} />
        <div className="mt-4">
          <RiskFilters active={active} onToggle={toggle} />
        </div>
      </GlassCard>

      <section className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <CardTitle title="Probability vs Impact" meta="Higher right = act first" />
          <RiskMatrixGrid alerts={alerts} />
        </GlassCard>

        <GlassCard>
          <CardTitle title="Warning Feed" meta="Live" />
          <WarningFeed alerts={alerts} />
        </GlassCard>
      </section>
    </div>
  );
}
