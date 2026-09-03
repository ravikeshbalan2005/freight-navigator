export type VesselClass = "Handysize" | "Supramax" | "Panamax" | "Capesize";

export type CargoType = "Coal" | "Iron Ore" | "Grain" | "Bauxite" | "Fertilizer";

export type TrendDirection = "up" | "down" | "flat";

export type Severity = "high" | "medium" | "low" | "action";

export interface Port {
  code: string;
  name: string;
  country: string;
  maxDraft: number;
  maxLoa: number;
  congestion: number; // 0-100
  lat: number;
  lng: number;
}

export interface VesselSpec {
  klass: VesselClass;
  dwtMin: number;
  dwtMax: number;
  loa: number;
  beam: number;
  draft: number;
  ratePerTonne: number;
  loadRate: number; // tonnes/day
}

export interface Vessel {
  id: string;
  name: string;
  klass: VesselClass;
  status: "laden" | "ballast" | "idle" | "loading";
  route: string;
  lat: number;
  lng: number;
  idleDays: number;
  nextFree: string;
}

export interface ScheduleSegment {
  vesselId: string;
  vesselName: string;
  klass: VesselClass;
  label: string;
  kind: "voyage" | "idle" | "maintenance";
  startWeek: number;
  weeks: number;
}

export interface RatePoint {
  period: string;
  historical: number | null;
  predicted: number | null;
  lower: number | null;
  upper: number | null;
}

export interface MarketDriver {
  label: string;
  impact: number; // -100..100
  note: string;
}

export interface ForecastResult {
  series: RatePoint[];
  drivers: MarketDriver[];
  trend: TrendDirection;
  changePct: number;
  confidence: number;
  bookingWindow: string;
}

export interface CharterRequest {
  originCode: string;
  destinationCode: string;
  cargo: CargoType;
  tonnage: number;
  laycanStart: string;
  horizonWeeks: number;
}

export interface StrategyOption {
  name: string;
  costPerTonne: number;
  totalCost: number;
  flexibility: string;
  riskExposure: string;
  recommended: boolean;
}

export interface CharterRecommendation {
  vessel: VesselSpec;
  runnersUp: VesselSpec[];
  bookingWindow: string;
  trend: TrendDirection;
  reasoning: string[];
  riskLabel: string;
  strategies: StrategyOption[];
  estimatedSaving: number;
}

export interface RiskAlert {
  id: string;
  title: string;
  detail: string;
  category: "congestion" | "volatility" | "weather" | "supply" | "availability";
  severity: Severity;
  probability: number; // 1-5
  impact: number; // 1-5
  timestamp: string;
}

export interface RepositioningSuggestion {
  vesselId: string;
  vesselName: string;
  from: string;
  to: string;
  idleDaysSaved: number;
  cargoHint: string;
}
