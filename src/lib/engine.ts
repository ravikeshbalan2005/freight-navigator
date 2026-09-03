import { PORTS, VESSEL_SPECS } from "./constants";
import type {
  CharterRecommendation,
  CharterRequest,
  ForecastResult,
  MarketDriver,
  Port,
  RatePoint,
  RepositioningSuggestion,
  RiskAlert,
  ScheduleSegment,
  StrategyOption,
  TrendDirection,
  Vessel,
  VesselSpec,
} from "@/types";

const CARGO_FACTOR: Record<string, number> = {
  Coal: 1,
  "Iron Ore": 1.08,
  Grain: 0.94,
  Bauxite: 1.02,
  Fertilizer: 0.97,
};

const portOf = (code: string, ports: Port[] = PORTS) =>
  ports.find((p) => p.code === code) ?? ports[0] ?? PORTS[0]!;

/** Deterministic pseudo-noise so the same request always yields the same forecast. */
const wave = (seed: number, i: number) =>
  Math.sin(seed * 0.7 + i * 0.55) * 1.6 + Math.cos(seed * 1.3 + i * 0.29) * 0.9;

const seedOf = (s: string) =>
  [...s].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 997, 7);

export function buildForecast(req: CharterRequest): ForecastResult {
  const origin = portOf(req.originCode);
  const dest = portOf(req.destinationCode);
  const seed = seedOf(req.originCode + req.destinationCode + req.cargo);
  const base =
    22 +
    (origin.congestion + dest.congestion) / 14 +
    (CARGO_FACTOR[req.cargo] ?? 1) * 6 +
    req.tonnage / 25000;

  const history = 10;
  const horizon = Math.max(4, Math.min(req.horizonWeeks, 12));
  const series: RatePoint[] = [];

  let last = base;
  for (let i = 0; i < history; i += 1) {
    last = base + wave(seed, i) + i * 0.18;
    series.push({
      period: `W-${history - i}`,
      historical: Number(last.toFixed(2)),
      predicted: i === history - 1 ? Number(last.toFixed(2)) : null,
      lower: null,
      upper: null,
    });
  }

  const pressure =
    (dest.congestion - 45) / 55 + (origin.congestion - 45) / 90 + (CARGO_FACTOR[req.cargo] ?? 1) - 1;

  for (let i = 1; i <= horizon; i += 1) {
    const value = last + pressure * i * 0.55 + wave(seed, history + i) * 0.35;
    const spread = 0.45 * i;
    series.push({
      period: `W+${i}`,
      historical: null,
      predicted: Number(value.toFixed(2)),
      lower: Number((value - spread).toFixed(2)),
      upper: Number((value + spread).toFixed(2)),
    });
  }

  const first = series[history - 1]!.historical!;
  const final = series[series.length - 1]!.predicted!;
  const changePct = ((final - first) / first) * 100;
  const trend: TrendDirection = changePct > 1.5 ? "up" : changePct < -1.5 ? "down" : "flat";

  const drivers: MarketDriver[] = [
    {
      label: "Port congestion",
      impact: Math.round((dest.congestion - 40) * 1.4),
      note: `${dest.name} berth queue at ${dest.congestion}%`,
    },
    {
      label: "Vessel supply",
      impact: -Math.round(8 + (seed % 11)),
      note: "Available tonnage in region tightening",
    },
    {
      label: "Cargo demand",
      impact: Math.round(6 + (seed % 17)),
      note: `${req.cargo} liftings above seasonal average`,
    },
    {
      label: "Weather window",
      impact: Math.round(((seed % 13) - 6) * 2),
      note: "Monsoon swell easing along the route",
    },
    {
      label: "Bunker prices",
      impact: Math.round(((seed % 9) - 3) * 3),
      note: "VLSFO steady week on week",
    },
  ];

  const bookingWindow =
    trend === "up" ? "Next 2–3 weeks" : trend === "down" ? "Wait 4–6 weeks" : "Flexible — next 4 weeks";

  return {
    series,
    drivers,
    trend,
    changePct: Number(changePct.toFixed(1)),
    confidence: 0.72 + ((seed % 20) / 100),
    bookingWindow,
  };
}

function scoreVessel(spec: VesselSpec, req: CharterRequest) {
  const dest = portOf(req.destinationCode);
  const origin = portOf(req.originCode);
  const draftOk = spec.draft <= Math.min(dest.maxDraft, origin.maxDraft);
  const loaOk = spec.loa <= Math.min(dest.maxLoa, origin.maxLoa);
  const fits = req.tonnage >= spec.dwtMin * 0.85 && req.tonnage <= spec.dwtMax;
  const utilisation = Math.min(req.tonnage / spec.dwtMax, 1);
  let score = utilisation * 60;
  if (fits) score += 25;
  if (!draftOk) score -= 60;
  if (!loaOk) score -= 40;
  score -= spec.ratePerTonne * 0.4;
  return { score, draftOk, loaOk, utilisation };
}

export function buildRecommendation(req: CharterRequest): CharterRecommendation {
  const forecast = buildForecast(req);
  const dest = portOf(req.destinationCode);
  const origin = portOf(req.originCode);

  const ranked = [...VESSEL_SPECS]
    .map((spec) => ({ spec, ...scoreVessel(spec, req) }))
    .sort((a, b) => b.score - a.score);

  const winner = ranked[0]!;
  const spotCost = winner.spec.ratePerTonne * req.tonnage;
  const multiRate = winner.spec.ratePerTonne * (forecast.trend === "up" ? 0.93 : 0.97);
  const periodRate = winner.spec.ratePerTonne * (forecast.trend === "up" ? 0.9 : 1.02);

  const strategies: StrategyOption[] = [
    {
      name: "Spot voyage",
      costPerTonne: winner.spec.ratePerTonne,
      totalCost: spotCost,
      flexibility: "High — book per voyage",
      riskExposure: "Full exposure to rate spikes",
      recommended: forecast.trend === "down",
    },
    {
      name: "3-voyage contract",
      costPerTonne: Number(multiRate.toFixed(2)),
      totalCost: multiRate * req.tonnage * 3,
      flexibility: "Medium — fixed laycan windows",
      riskExposure: "Rate locked for 3 liftings",
      recommended: forecast.trend === "up",
    },
    {
      name: "6-month period charter",
      costPerTonne: Number(periodRate.toFixed(2)),
      totalCost: periodRate * req.tonnage * 6,
      flexibility: "Low — committed tonnage",
      riskExposure: "Idle-time risk on your account",
      recommended: false,
    },
  ];

  const best = strategies.find((s) => s.recommended) ?? strategies[0]!;
  const estimatedSaving = Math.max(0, (winner.spec.ratePerTonne - best.costPerTonne) * req.tonnage * 3);

  return {
    vessel: winner.spec,
    runnersUp: ranked.slice(1).map((r) => r.spec),
    bookingWindow: forecast.bookingWindow,
    trend: forecast.trend,
    riskLabel: dest.congestion > 60 ? "Moderate congestion risk" : "Low operational risk",
    estimatedSaving,
    reasoning: [
      `${req.tonnage.toLocaleString()} t fits a ${winner.spec.klass} at ${Math.round(winner.utilisation * 100)}% utilisation.`,
      `${dest.name} draft limit ${dest.maxDraft} m clears the ${winner.spec.klass} at ${winner.spec.draft} m.`,
      `${origin.name} LOA limit ${origin.maxLoa} m accommodates ${winner.spec.loa} m.`,
      `Rates trending ${forecast.trend} ${Math.abs(forecast.changePct)}% over the horizon — ${forecast.bookingWindow.toLowerCase()}.`,
      `Load rate ${winner.spec.loadRate.toLocaleString()} t/day keeps port stay under ${Math.ceil(req.tonnage / winner.spec.loadRate) + 1} days.`,
    ],
    strategies,
  };
}

export const FLEET: Vessel[] = [
  { id: "v1", name: "MV Meridian", klass: "Supramax", status: "idle", route: "Paradip anchorage", lat: 20.1, lng: 86.9, idleDays: 4, nextFree: "2026-09-05" },
  { id: "v2", name: "MV Coral Dawn", klass: "Panamax", status: "laden", route: "Newcastle → Paradip", lat: -8.4, lng: 118.2, idleDays: 0, nextFree: "2026-09-18" },
  { id: "v3", name: "MV Kestrel", klass: "Handysize", status: "loading", route: "Haldia berth 4", lat: 22.03, lng: 88.09, idleDays: 0, nextFree: "2026-09-09" },
  { id: "v4", name: "MV Orion Bay", klass: "Capesize", status: "ballast", route: "Richards Bay → Hay Point", lat: -25.6, lng: 68.4, idleDays: 1, nextFree: "2026-09-21" },
  { id: "v5", name: "MV Tamarind", klass: "Supramax", status: "laden", route: "Balikpapan → Visakhapatnam", lat: 2.9, lng: 102.4, idleDays: 0, nextFree: "2026-09-14" },
  { id: "v6", name: "MV Sea Lark", klass: "Handysize", status: "idle", route: "Port Kembla roads", lat: -34.4, lng: 151.1, idleDays: 6, nextFree: "2026-09-04" },
];

export const SCHEDULE: ScheduleSegment[] = [
  { vesselId: "v1", vesselName: "MV Meridian", klass: "Supramax", label: "Idle at Paradip", kind: "idle", startWeek: 0, weeks: 1 },
  { vesselId: "v1", vesselName: "MV Meridian", klass: "Supramax", label: "Paradip → Haldia", kind: "voyage", startWeek: 1, weeks: 3 },
  { vesselId: "v2", vesselName: "MV Coral Dawn", klass: "Panamax", label: "Newcastle → Paradip", kind: "voyage", startWeek: 0, weeks: 4 },
  { vesselId: "v2", vesselName: "MV Coral Dawn", klass: "Panamax", label: "Idle", kind: "idle", startWeek: 4, weeks: 1 },
  { vesselId: "v3", vesselName: "MV Kestrel", klass: "Handysize", label: "Loading Haldia", kind: "voyage", startWeek: 0, weeks: 2 },
  { vesselId: "v3", vesselName: "MV Kestrel", klass: "Handysize", label: "Drydock", kind: "maintenance", startWeek: 3, weeks: 2 },
  { vesselId: "v4", vesselName: "MV Orion Bay", klass: "Capesize", label: "Ballast leg", kind: "voyage", startWeek: 0, weeks: 2 },
  { vesselId: "v4", vesselName: "MV Orion Bay", klass: "Capesize", label: "Richards Bay → Hay Point", kind: "voyage", startWeek: 2, weeks: 4 },
  { vesselId: "v5", vesselName: "MV Tamarind", klass: "Supramax", label: "Balikpapan → Vizag", kind: "voyage", startWeek: 0, weeks: 3 },
  { vesselId: "v5", vesselName: "MV Tamarind", klass: "Supramax", label: "Idle", kind: "idle", startWeek: 3, weeks: 2 },
  { vesselId: "v6", vesselName: "MV Sea Lark", klass: "Handysize", label: "Idle at Kembla", kind: "idle", startWeek: 0, weeks: 2 },
  { vesselId: "v6", vesselName: "MV Sea Lark", klass: "Handysize", label: "Kembla → Vizag", kind: "voyage", startWeek: 2, weeks: 4 },
];

export const REPOSITIONING: RepositioningSuggestion[] = [
  { vesselId: "v1", vesselName: "MV Meridian", from: "Paradip", to: "Haldia", idleDaysSaved: 3, cargoHint: "18,000 t fertilizer backhaul" },
  { vesselId: "v6", vesselName: "MV Sea Lark", from: "Port Kembla", to: "Newcastle", idleDaysSaved: 4, cargoHint: "32,000 t coal part-cargo" },
  { vesselId: "v5", vesselName: "MV Tamarind", from: "Visakhapatnam", to: "Paradip", idleDaysSaved: 2, cargoHint: "Positioning ahead of laycan" },
];

export const RISK_ALERTS: RiskAlert[] = [
  { id: "r1", title: "High congestion at Port Kembla loading berth", detail: "Est. delay 1.5 days · affects 2 vessels", category: "congestion", severity: "high", probability: 4, impact: 4, timestamp: "2026-09-03T04:10:00Z" },
  { id: "r2", title: "Freight volatility spiking on Iron Ore contracts", detail: "Suggested hedge window in 48h", category: "volatility", severity: "medium", probability: 3, impact: 4, timestamp: "2026-09-03T02:40:00Z" },
  { id: "r3", title: "MV Meridian idle 4 days — reposition to Haldia", detail: "Backhaul cargo available on the Bay of Bengal leg", category: "availability", severity: "action", probability: 4, impact: 2, timestamp: "2026-09-03T01:15:00Z" },
  { id: "r4", title: "Paradip draft restriction after siltation survey", detail: "Max sailing draft reduced to 12.6 m for 10 days", category: "congestion", severity: "high", probability: 3, impact: 5, timestamp: "2026-09-02T21:05:00Z" },
  { id: "r5", title: "Cyclone Marlowe tracking the Gulf of Carpentaria", detail: "Route deviation may add 1.2 days on AU east coast legs", category: "weather", severity: "medium", probability: 2, impact: 4, timestamp: "2026-09-02T18:20:00Z" },
  { id: "r6", title: "Supramax availability down 9% quarter on quarter", detail: "Fewer open positions east of Singapore", category: "supply", severity: "medium", probability: 4, impact: 3, timestamp: "2026-09-02T12:00:00Z" },
  { id: "r7", title: "Bunker spread narrowing at Singapore", detail: "Minor cost relief on long ballast legs", category: "volatility", severity: "low", probability: 2, impact: 1, timestamp: "2026-09-02T08:45:00Z" },
];
