import type { CargoType, Port, VesselSpec } from "@/types";

export const PORTS: Port[] = [
  { code: "AUNTL", name: "Newcastle", country: "Australia", maxDraft: 16.4, maxLoa: 300, congestion: 42, lat: -32.92, lng: 151.78 },
  { code: "AUPKL", name: "Port Kembla", country: "Australia", maxDraft: 15.6, maxLoa: 285, congestion: 78, lat: -34.47, lng: 150.9 },
  { code: "AUHAY", name: "Hay Point", country: "Australia", maxDraft: 17.2, maxLoa: 300, congestion: 35, lat: -21.28, lng: 149.29 },
  { code: "INPRD", name: "Paradip", country: "India", maxDraft: 13.0, maxLoa: 235, congestion: 66, lat: 20.26, lng: 86.67 },
  { code: "INHAL", name: "Haldia", country: "India", maxDraft: 8.5, maxLoa: 200, congestion: 51, lat: 22.03, lng: 88.09 },
  { code: "INVIZ", name: "Visakhapatnam", country: "India", maxDraft: 14.5, maxLoa: 250, congestion: 44, lat: 17.69, lng: 83.28 },
  { code: "IDBTU", name: "Balikpapan", country: "Indonesia", maxDraft: 14.0, maxLoa: 240, congestion: 29, lat: -1.24, lng: 116.85 },
  { code: "ZARBY", name: "Richards Bay", country: "South Africa", maxDraft: 17.5, maxLoa: 300, congestion: 38, lat: -28.8, lng: 32.05 },
];

export const CARGO_TYPES: CargoType[] = ["Coal", "Iron Ore", "Grain", "Bauxite", "Fertilizer"];

export const VESSEL_SPECS: VesselSpec[] = [
  { klass: "Handysize", dwtMin: 15000, dwtMax: 39000, loa: 165, beam: 24, draft: 9.5, ratePerTonne: 26.1, loadRate: 9000 },
  { klass: "Supramax", dwtMin: 40000, dwtMax: 65000, loa: 199, beam: 32, draft: 11.3, ratePerTonne: 28.4, loadRate: 14000 },
  { klass: "Panamax", dwtMin: 65001, dwtMax: 85000, loa: 229, beam: 32.2, draft: 12.9, ratePerTonne: 29.8, loadRate: 20000 },
  { klass: "Capesize", dwtMin: 85001, dwtMax: 200000, loa: 292, beam: 45, draft: 17.5, ratePerTonne: 33.6, loadRate: 32000 },
];

export const NAV_ITEMS = [
  { to: "/", label: "Command Center", dot: "bg-ink" },
  { to: "/forecast", label: "Freight Forecast", dot: "bg-sky" },
  { to: "/optimizer", label: "Charter Optimizer", dot: "bg-candy" },
  { to: "/fleet", label: "Fleet & Route Planner", dot: "bg-mint" },
  { to: "/risk", label: "Risk Radar", dot: "bg-lilac" },
  { to: "/settings", label: "Settings", dot: "bg-peach" },
] as const;

export const RISK_CATEGORIES = [
  { key: "congestion", label: "Port congestion" },
  { key: "volatility", label: "Price volatility" },
  { key: "weather", label: "Weather" },
  { key: "supply", label: "Supply & demand" },
  { key: "availability", label: "Vessel availability" },
] as const;
