import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CharterRequest } from "@/types";

export const DEFAULT_REQUEST: CharterRequest = {
  originCode: "AUNTL",
  destinationCode: "INPRD",
  cargo: "Coal",
  tonnage: 50000,
  laycanStart: "2026-09-18",
  horizonWeeks: 8,
};

export function useForecastData(request: CharterRequest = DEFAULT_REQUEST) {
  return useQuery({
    queryKey: ["forecast", request],
    queryFn: () => api.forecast(request),
    staleTime: 60_000,
  });
}
