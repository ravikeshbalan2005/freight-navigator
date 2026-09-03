import { useMemo } from "react";
import { PORTS } from "@/lib/constants";
import { useFleetSchedule } from "./useFleetSchedule";

/** Projects lat/lng onto a 0-100 percentage grid for the SVG route map. */
const project = (lat: number, lng: number) => ({
  x: ((lng - 20) / 130) * 100,
  y: ((40 - lat) / 90) * 100,
});

export function useMapData() {
  const { data, isLoading } = useFleetSchedule();

  return useMemo(() => {
    const ports = PORTS.map((p) => ({ ...p, ...project(p.lat, p.lng) }));
    const vessels = (data?.vessels ?? []).map((v) => ({ ...v, ...project(v.lat, v.lng) }));
    return { ports, vessels, isLoading };
  }, [data, isLoading]);
}
