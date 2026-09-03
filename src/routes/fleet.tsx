import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, CardTitle } from "@/components/layout/GlassCard";
import { FleetGanttChart } from "@/components/fleet/FleetGanttChart";
import { InteractiveRouteMap } from "@/components/fleet/InteractiveRouteMap";
import { RepositioningList } from "@/components/fleet/RepositioningList";
import { useFleetSchedule } from "@/hooks/useFleetSchedule";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Fleet & Route Planner — Cargolens" },
      {
        name: "description",
        content:
          "Vessel timeline, live positions and AI repositioning suggestions that cut idle days across the bulk fleet.",
      },
      { property: "og:title", content: "Fleet & Route Planner — Cargolens" },
      {
        property: "og:description",
        content: "See where every vessel is, when it frees up and how to avoid idle time.",
      },
    ],
  }),
  component: FleetPage,
});

function FleetPage() {
  const { data } = useFleetSchedule();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fleet & Route Planner"
        subtitle="Timeline, positions and idle-time reduction across active tonnage"
      />

      <GlassCard>
        <CardTitle title="Fleet Schedule" meta="Next 6 weeks" />
        <FleetGanttChart schedule={data?.schedule ?? []} />
      </GlassCard>

      <section className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <CardTitle title="Route Map" meta="Ports and live vessel positions" />
          <InteractiveRouteMap />
        </GlassCard>

        <GlassCard>
          <CardTitle title="Repositioning" meta="AI suggestions" />
          <RepositioningList items={data?.repositioning ?? []} />
        </GlassCard>
      </section>

      <GlassCard>
        <CardTitle title="Vessel Status" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-soft">
              <tr>
                <th className="px-3 py-2 font-medium">Vessel</th>
                <th className="px-3 py-2 font-medium">Class</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Current leg</th>
                <th className="px-3 py-2 font-medium">Idle days</th>
                <th className="px-3 py-2 font-medium">Next free</th>
              </tr>
            </thead>
            <tbody>
              {(data?.vessels ?? []).map((v) => (
                <tr key={v.id} className="bg-glass-strong">
                  <td className="rounded-l-2xl px-3 py-3 font-semibold text-ink">{v.name}</td>
                  <td className="px-3 py-3 text-soft">{v.klass}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        v.status === "idle" ? "bg-candy/40 text-ink" : "bg-mint/40 text-ink"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-soft">{v.route}</td>
                  <td className="px-3 py-3 text-ink">{v.idleDays}</td>
                  <td className="rounded-r-2xl px-3 py-3 text-soft">{formatDate(v.nextFree)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
