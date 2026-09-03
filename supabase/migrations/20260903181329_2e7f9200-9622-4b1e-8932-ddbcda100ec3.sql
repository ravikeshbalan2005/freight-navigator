
CREATE TABLE public.ports (
  code text PRIMARY KEY,
  name text NOT NULL,
  country text NOT NULL,
  max_draft numeric NOT NULL,
  max_loa numeric NOT NULL,
  congestion integer NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ports TO anon, authenticated;
GRANT ALL ON public.ports TO service_role;
ALTER TABLE public.ports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ports are publicly readable" ON public.ports FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.vessel_specs (
  klass text PRIMARY KEY,
  dwt_min integer NOT NULL,
  dwt_max integer NOT NULL,
  loa numeric NOT NULL,
  beam numeric NOT NULL,
  draft numeric NOT NULL,
  rate_per_tonne numeric NOT NULL,
  load_rate integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.vessel_specs TO anon, authenticated;
GRANT ALL ON public.vessel_specs TO service_role;
ALTER TABLE public.vessel_specs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vessel specs are publicly readable" ON public.vessel_specs FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.vessels (
  id text PRIMARY KEY,
  name text NOT NULL,
  klass text NOT NULL,
  status text NOT NULL,
  route text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  idle_days integer NOT NULL DEFAULT 0,
  next_free date NOT NULL
);
GRANT SELECT ON public.vessels TO anon, authenticated;
GRANT ALL ON public.vessels TO service_role;
ALTER TABLE public.vessels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vessels are publicly readable" ON public.vessels FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.schedule_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vessel_id text NOT NULL REFERENCES public.vessels(id) ON DELETE CASCADE,
  label text NOT NULL,
  kind text NOT NULL,
  start_week integer NOT NULL,
  weeks integer NOT NULL
);
GRANT SELECT ON public.schedule_segments TO anon, authenticated;
GRANT ALL ON public.schedule_segments TO service_role;
ALTER TABLE public.schedule_segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schedule is publicly readable" ON public.schedule_segments FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.repositioning_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vessel_id text NOT NULL REFERENCES public.vessels(id) ON DELETE CASCADE,
  from_port text NOT NULL,
  to_port text NOT NULL,
  idle_days_saved integer NOT NULL,
  cargo_hint text NOT NULL
);
GRANT SELECT ON public.repositioning_suggestions TO anon, authenticated;
GRANT ALL ON public.repositioning_suggestions TO service_role;
ALTER TABLE public.repositioning_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Repositioning is publicly readable" ON public.repositioning_suggestions FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.risk_alerts (
  id text PRIMARY KEY,
  title text NOT NULL,
  detail text NOT NULL,
  category text NOT NULL,
  severity text NOT NULL,
  probability integer NOT NULL,
  impact integer NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.risk_alerts TO anon, authenticated;
GRANT ALL ON public.risk_alerts TO service_role;
ALTER TABLE public.risk_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Risk alerts are publicly readable" ON public.risk_alerts FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.ports (code, name, country, max_draft, max_loa, congestion, lat, lng) VALUES
('AUNTL','Newcastle','Australia',16.4,300,42,-32.92,151.78),
('AUPKL','Port Kembla','Australia',15.6,285,78,-34.47,150.9),
('AUHAY','Hay Point','Australia',17.2,300,35,-21.28,149.29),
('INPRD','Paradip','India',13.0,235,66,20.26,86.67),
('INHAL','Haldia','India',8.5,200,51,22.03,88.09),
('INVIZ','Visakhapatnam','India',14.5,250,44,17.69,83.28),
('IDBTU','Balikpapan','Indonesia',14.0,240,29,-1.24,116.85),
('ZARBY','Richards Bay','South Africa',17.5,300,38,-28.8,32.05);

INSERT INTO public.vessel_specs (klass, dwt_min, dwt_max, loa, beam, draft, rate_per_tonne, load_rate, sort_order) VALUES
('Handysize',15000,39000,165,24,9.5,26.1,9000,1),
('Supramax',40000,65000,199,32,11.3,28.4,14000,2),
('Panamax',65001,85000,229,32.2,12.9,29.8,20000,3),
('Capesize',85001,200000,292,45,17.5,33.6,32000,4);

INSERT INTO public.vessels (id, name, klass, status, route, lat, lng, idle_days, next_free) VALUES
('v1','MV Meridian','Supramax','idle','Paradip anchorage',20.1,86.9,4,'2026-09-05'),
('v2','MV Coral Dawn','Panamax','laden','Newcastle → Paradip',-8.4,118.2,0,'2026-09-18'),
('v3','MV Kestrel','Handysize','loading','Haldia berth 4',22.03,88.09,0,'2026-09-09'),
('v4','MV Orion Bay','Capesize','ballast','Richards Bay → Hay Point',-25.6,68.4,1,'2026-09-21'),
('v5','MV Tamarind','Supramax','laden','Balikpapan → Visakhapatnam',2.9,102.4,0,'2026-09-14'),
('v6','MV Sea Lark','Handysize','idle','Port Kembla roads',-34.4,151.1,6,'2026-09-04');

INSERT INTO public.schedule_segments (vessel_id, label, kind, start_week, weeks) VALUES
('v1','Idle at Paradip','idle',0,1),
('v1','Paradip → Haldia','voyage',1,3),
('v2','Newcastle → Paradip','voyage',0,4),
('v2','Idle','idle',4,1),
('v3','Loading Haldia','voyage',0,2),
('v3','Drydock','maintenance',3,2),
('v4','Ballast leg','voyage',0,2),
('v4','Richards Bay → Hay Point','voyage',2,4),
('v5','Balikpapan → Vizag','voyage',0,3),
('v5','Idle','idle',3,2),
('v6','Idle at Kembla','idle',0,2),
('v6','Kembla → Vizag','voyage',2,4);

INSERT INTO public.repositioning_suggestions (vessel_id, from_port, to_port, idle_days_saved, cargo_hint) VALUES
('v1','Paradip','Haldia',3,'18,000 t fertilizer backhaul'),
('v6','Port Kembla','Newcastle',4,'32,000 t coal part-cargo'),
('v5','Visakhapatnam','Paradip',2,'Positioning ahead of laycan');

INSERT INTO public.risk_alerts (id, title, detail, category, severity, probability, impact, occurred_at) VALUES
('r1','High congestion at Port Kembla loading berth','Est. delay 1.5 days · affects 2 vessels','congestion','high',4,4,'2026-09-03T04:10:00Z'),
('r2','Freight volatility spiking on Iron Ore contracts','Suggested hedge window in 48h','volatility','medium',3,4,'2026-09-03T02:40:00Z'),
('r3','MV Meridian idle 4 days — reposition to Haldia','Backhaul cargo available on the Bay of Bengal leg','availability','action',4,2,'2026-09-03T01:15:00Z'),
('r4','Paradip draft restriction after siltation survey','Max sailing draft reduced to 12.6 m for 10 days','congestion','high',3,5,'2026-09-02T21:05:00Z'),
('r5','Cyclone Marlowe tracking the Gulf of Carpentaria','Route deviation may add 1.2 days on AU east coast legs','weather','medium',2,4,'2026-09-02T18:20:00Z'),
('r6','Supramax availability down 9% quarter on quarter','Fewer open positions east of Singapore','supply','medium',4,3,'2026-09-02T12:00:00Z'),
('r7','Bunker spread narrowing at Singapore','Minor cost relief on long ballast legs','volatility','low',2,1,'2026-09-02T08:45:00Z');
