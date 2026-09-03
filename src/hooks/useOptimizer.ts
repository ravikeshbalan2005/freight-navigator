import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CharterRequest } from "@/types";
import { DEFAULT_REQUEST } from "./useForecastData";

export function useOptimizer() {
  const [request, setRequest] = useState<CharterRequest>(DEFAULT_REQUEST);

  const mutation = useMutation({
    mutationFn: (req: CharterRequest) => api.optimize(req),
  });

  const update = useCallback(
    <K extends keyof CharterRequest>(key: K, value: CharterRequest[K]) =>
      setRequest((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const run = useCallback(() => mutation.mutate(request), [mutation, request]);

  return {
    request,
    update,
    run,
    result: mutation.data,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
