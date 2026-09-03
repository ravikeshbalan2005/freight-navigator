import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, CardTitle } from "@/components/layout/GlassCard";
import { ForecastChart } from "@/components/forecast/ForecastChart";
import { MarketDriversPanel } from "@/components/forecast/MarketDriversPanel";
import { RouteSelector } from "@/components/forecast/RouteSelector";
import { DEFAULT_REQUEST, useForecastData } from "@/hooks/useForecastData";
import { formatPct } from "@/lib/format";
import type { CharterRequest } from "@/types";

export const Route = createFileRoute("/forecast")({
  head: () => ({
    meta: [
      { title: "Freight Forecasting — Cargolens" },
      {
        name: "description",
        content:
          "Historical and predicted dry bulk freight rates by route and cargo, with the market drivers behind each move.",
      },
      { property: "og:title", content: "Freight Forecasting — Cargolens" },
      {
        property: "og:description",
        content: "Predict where freight rates are heading before you fix a charter.",
      },
    ],
  }),
  component: ForecastPage,
});

function ForecastPage() {
  const [request, setRequest] = useState<CharterRequest>(DEFAULT_REQUEST);
  const { data } = useForecastData(request);

  const update = <K extends keyof CharterRequest>(key: K, value: CharterRequest[K]) =>
    setRequest((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Freight Forecasting"
        subtitle="Historical rates, AI projection and the drivers moving the market"
      />

      <GlassCard>
        <RouteSelector request={request} onChange={update} />

        <div className="mt-5 flex flex-wrap gap-3">
          <Stat label="Trend" value={data?.trend ?? "—"} />
          <Stat label="Horizon change" value={formatPct(data?.changePct ?? 0)} />
          <Stat label="Model confidence" value={`${Math.round((data?.confidence ?? 0) * 100)}%`} />
          <Stat label="Best booking window" value={data?.bookingWindow ?? "—"} />
        </div>

        {data && <ForecastChart series={data.series} />}

        <div className="mt-3 flex gap-4 text-[11px] text-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-soft" /> Historical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-chart-1" /> Predicted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-lilac" /> Confidence band
          </span>
        </div>
      </GlassCard>

      <GlassCard>
        <CardTitle title="Market Drivers" meta="Why the model expects this move" />
        <MarketDriversPanel drivers={data?.drivers ?? []} />
      </GlassCard>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-glass-strong px-4 py-2">
      <div className="text-[11px] text-soft">{label}</div>
      <div className="font-display text-sm font-bold capitalize text-ink">{value}</div>
    </div>
  );
}
