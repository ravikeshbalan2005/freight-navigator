/**
 * Data access layer.
 *
 * The dashboard currently runs on a deterministic in-app simulation of the
 * forecasting engine. Point `API_BASE_URL` at the SIH backend and flip
 * `USE_REMOTE` to route the same calls to real endpoints.
 */
import type {
  CharterRecommendation,
  CharterRequest,
  ForecastResult,
  RepositioningSuggestion,
  RiskAlert,
  ScheduleSegment,
  Vessel,
} from "@/types";
import {
  buildForecast,
  buildRecommendation,
  FLEET,
  REPOSITIONING,
  RISK_ALERTS,
  SCHEDULE,
} from "./engine";

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "";

const USE_REMOTE = API_BASE_URL.length > 0;

async function remote<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

const delay = <T,>(value: T, ms = 320) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const api = {
  forecast: (req: CharterRequest): Promise<ForecastResult> =>
    USE_REMOTE
      ? remote("/forecast", { method: "POST", body: JSON.stringify(req) })
      : delay(buildForecast(req)),

  optimize: (req: CharterRequest): Promise<CharterRecommendation> =>
    USE_REMOTE
      ? remote("/optimize", { method: "POST", body: JSON.stringify(req) })
      : delay(buildRecommendation(req), 550),

  fleet: (): Promise<{ vessels: Vessel[]; schedule: ScheduleSegment[]; repositioning: RepositioningSuggestion[] }> =>
    USE_REMOTE
      ? remote("/fleet")
      : delay({ vessels: FLEET, schedule: SCHEDULE, repositioning: REPOSITIONING }),

  risks: (): Promise<RiskAlert[]> => (USE_REMOTE ? remote("/risks") : delay(RISK_ALERTS)),
};
