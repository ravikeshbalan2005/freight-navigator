import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type {
  CharterRecommendation,
  CharterRequest,
  ForecastResult,
  Port,
  RepositioningSuggestion,
  RiskAlert,
  ScheduleSegment,
  Vessel,
  VesselClass,
  VesselSpec,
} from "@/types";
import { buildForecast, buildRecommendation } from "./engine";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

async function loadReference() {
  const supabase = publicClient();
  const [portsRes, specsRes] = await Promise.all([
    supabase.from("ports").select("*"),
    supabase.from("vessel_specs").select("*").order("sort_order"),
  ]);
  const ports: Port[] = (portsRes.data ?? []).map((p) => ({
    code: p.code,
    name: p.name,
    country: p.country,
    maxDraft: Number(p.max_draft),
    maxLoa: Number(p.max_loa),
    congestion: p.congestion,
    lat: Number(p.lat),
    lng: Number(p.lng),
  }));
  const specs: VesselSpec[] = (specsRes.data ?? []).map((s) => ({
    klass: s.klass as VesselClass,
    dwtMin: s.dwt_min,
    dwtMax: s.dwt_max,
    loa: Number(s.loa),
    beam: Number(s.beam),
    draft: Number(s.draft),
    ratePerTonne: Number(s.rate_per_tonne),
    loadRate: s.load_rate,
  }));
  return { ports, specs };
}

const validateRequest = (data: CharterRequest) => data;

export const forecastFn = createServerFn({ method: "POST" })
  .inputValidator(validateRequest)
  .handler(async ({ data }): Promise<ForecastResult> => {
    const { ports } = await loadReference();
    return buildForecast(data, ports.length ? ports : undefined);
  });

export const optimizeFn = createServerFn({ method: "POST" })
  .inputValidator(validateRequest)
  .handler(async ({ data }): Promise<CharterRecommendation> => {
    const { ports, specs } = await loadReference();
    return buildRecommendation(
      data,
      ports.length ? ports : undefined,
      specs.length ? specs : undefined,
    );
  });

export const fleetFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    vessels: Vessel[];
    schedule: ScheduleSegment[];
    repositioning: RepositioningSuggestion[];
  }> => {
    const supabase = publicClient();
    const [vesselsRes, scheduleRes, repoRes] = await Promise.all([
      supabase.from("vessels").select("*").order("id"),
      supabase.from("schedule_segments").select("*").order("start_week"),
      supabase.from("repositioning_suggestions").select("*"),
    ]);

    const vessels: Vessel[] = (vesselsRes.data ?? []).map((v) => ({
      id: v.id,
      name: v.name,
      klass: v.klass as VesselClass,
      status: v.status as Vessel["status"],
      route: v.route,
      lat: Number(v.lat),
      lng: Number(v.lng),
      idleDays: v.idle_days,
      nextFree: v.next_free,
    }));
    const byId = new Map(vessels.map((v) => [v.id, v]));

    const schedule: ScheduleSegment[] = (scheduleRes.data ?? []).map((s) => ({
      vesselId: s.vessel_id,
      vesselName: byId.get(s.vessel_id)?.name ?? s.vessel_id,
      klass: (byId.get(s.vessel_id)?.klass ?? "Supramax") as VesselClass,
      label: s.label,
      kind: s.kind as ScheduleSegment["kind"],
      startWeek: s.start_week,
      weeks: s.weeks,
    }));

    const repositioning: RepositioningSuggestion[] = (repoRes.data ?? []).map((r) => ({
      vesselId: r.vessel_id,
      vesselName: byId.get(r.vessel_id)?.name ?? r.vessel_id,
      from: r.from_port,
      to: r.to_port,
      idleDaysSaved: r.idle_days_saved,
      cargoHint: r.cargo_hint,
    }));

    return { vessels, schedule, repositioning };
  },
);

export const risksFn = createServerFn({ method: "GET" }).handler(async (): Promise<RiskAlert[]> => {
  const { data } = await publicClient()
    .from("risk_alerts")
    .select("*")
    .order("occurred_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    detail: r.detail,
    category: r.category as RiskAlert["category"],
    severity: r.severity as RiskAlert["severity"],
    probability: r.probability,
    impact: r.impact,
    timestamp: r.occurred_at,
  }));
});
