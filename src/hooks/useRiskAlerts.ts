import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RISK_CATEGORIES } from "@/lib/constants";
import type { RiskAlert } from "@/types";

type Category = RiskAlert["category"];

export function useRiskAlerts() {
  const query = useQuery({
    queryKey: ["risks"],
    queryFn: () => api.risks(),
    refetchInterval: 60_000,
  });

  const [active, setActive] = useState<Category[]>(
    RISK_CATEGORIES.map((c) => c.key as Category),
  );

  const toggle = (key: Category) =>
    setActive((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  const alerts = useMemo(
    () => (query.data ?? []).filter((a) => active.includes(a.category)),
    [query.data, active],
  );

  return { ...query, alerts, active, toggle };
}
