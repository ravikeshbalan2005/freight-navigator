import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, CardTitle } from "@/components/layout/GlassCard";
import { CharterInputForm } from "@/components/optimizer/CharterInputForm";
import { AiResultsPanel } from "@/components/optimizer/AiResultsPanel";
import { VesselSpecCard } from "@/components/optimizer/VesselSpecCard";
import { StrategyComparison } from "@/components/optimizer/StrategyComparison";
import { useOptimizer } from "@/hooks/useOptimizer";
import { VESSEL_SPECS } from "@/lib/constants";

export const Route = createFileRoute("/optimizer")({
  head: () => ({
    meta: [
      { title: "Charter Optimizer — Cargolens" },
      {
        name: "description",
        content:
          "Recommend Handysize, Supramax, Panamax or Capesize tonnage from cargo size, draft and LOA limits, and compare spot against multi-voyage contracts.",
      },
      { property: "og:title", content: "Charter Optimizer — Cargolens" },
      {
        property: "og:description",
        content: "Pick the right vessel and the right contract shape for every bulk lifting.",
      },
    ],
  }),
  component: OptimizerPage,
});

function OptimizerPage() {
  const { request, update, run, result, isPending } = useOptimizer();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Charter Optimizer"
        subtitle="Match cargo and port constraints to the best vessel class and contract strategy"
      />

      <section className="grid gap-5 lg:grid-cols-2">
        <GlassCard>
          <CardTitle title="Charter Requirements" />
          <div className="mt-4">
            <CharterInputForm
              request={request}
              onChange={update}
              onSubmit={run}
              isPending={isPending}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <CardTitle title="AI Results" meta={result ? "Optimised" : "Awaiting input"} />
          <div className="mt-4">
            <AiResultsPanel recommendation={result} isPending={isPending} />
          </div>
        </GlassCard>
      </section>

      <GlassCard>
        <CardTitle title="Vessel Classes" meta="Specs vs your route limits" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {VESSEL_SPECS.map((spec) => (
            <VesselSpecCard
              key={spec.klass}
              spec={spec}
              recommended={result?.vessel.klass === spec.klass}
            />
          ))}
        </div>
      </GlassCard>

      {result && (
        <GlassCard>
          <CardTitle title="Spot vs Multi-Voyage" meta="Committed cost comparison" />
          <StrategyComparison strategies={result.strategies} />
        </GlassCard>
      )}
    </div>
  );
}
