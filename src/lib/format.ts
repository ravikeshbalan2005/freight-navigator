export const formatUsd = (value: number, digits = 2) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

export const formatTonnes = (value: number) => `${value.toLocaleString("en-US")} t`;

export const formatCompactUsd = (value: number) =>
  `$${(value / 1_000_000).toFixed(2)}M`;

export const formatPct = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const formatTimeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
};
