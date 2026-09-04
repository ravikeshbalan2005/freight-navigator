/**
 * Data access layer.
 *
 * Reads live data from the Cloud backend through TanStack server functions.
 * Set `VITE_API_BASE_URL` to route the same calls at an external SIH backend
 * instead.
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
import { fleetFn, forecastFn, optimizeFn, risksFn } from "./freight.functions";

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

export const api = {
  forecast: (req: CharterRequest): Promise<ForecastResult> =>
    USE_REMOTE
      ? remote("/forecast", { method: "POST", body: JSON.stringify(req) })
      : forecastFn({ data: req }),

  optimize: (req: CharterRequest): Promise<CharterRecommendation> =>
    USE_REMOTE
      ? remote("/optimize", { method: "POST", body: JSON.stringify(req) })
      : optimizeFn({ data: req }),

  fleet: (): Promise<{
    vessels: Vessel[];
    schedule: ScheduleSegment[];
    repositioning: RepositioningSuggestion[];
  }> => (USE_REMOTE ? remote("/fleet") : fleetFn()),

  risks: (): Promise<RiskAlert[]> => (USE_REMOTE ? remote("/risks") : risksFn()),
};
