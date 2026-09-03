import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RatePoint } from "@/types";

export function ForecastChart({ series }: { series: RatePoint[] }) {
  const band = series.map((p) => ({
    ...p,
    bandBase: p.lower,
    bandSpan: p.lower != null && p.upper != null ? p.upper - p.lower : null,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={band} margin={{ top: 10, right: 8, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="var(--color-glass-border)" vertical={false} />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 10, fill: "var(--color-soft)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--color-soft)" }}
            axisLine={false}
            tickLine={false}
            width={48}
            unit="$"
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid var(--color-glass-border)",
              background: "var(--color-popover)",
              fontSize: 12,
              color: "var(--color-ink)",
            }}
          />
          <Area
            dataKey="bandBase"
            stackId="band"
            stroke="none"
            fill="transparent"
            isAnimationActive={false}
          />
          <Area
            dataKey="bandSpan"
            stackId="band"
            stroke="none"
            fill="var(--color-lilac)"
            fillOpacity={0.45}
            name="Confidence band"
          />
          <Line
            type="monotone"
            dataKey="historical"
            name="Historical"
            stroke="var(--color-soft)"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="predicted"
            name="Predicted"
            stroke="var(--color-chart-1)"
            strokeWidth={2.5}
            strokeDasharray="5 4"
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
