import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useFleetSchedule() {
  return useQuery({
    queryKey: ["fleet"],
    queryFn: () => api.fleet(),
    staleTime: 60_000,
  });
}
