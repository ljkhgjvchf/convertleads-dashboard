export const usd = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
export const num = (v: number) => Math.round(v).toLocaleString("en-US");

/** 96400 → "96.4K", 1940000 → "1.94M" */
export const compact = (v: number) =>
  v >= 1e6 ? `${(v / 1e6).toFixed(2)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : `${Math.round(v)}`;
export const usdK = (v: number) => `$${compact(v)}`;

/** Axis ticks: drop trailing ".0" */
export const axisK = (v: number) => (v === 0 ? "0" : v >= 1e3 ? `${+(v / 1e3).toFixed(1)}K` : `${v}`);
export const axisUsdK = (v: number) => (v === 0 ? "$0" : `$${axisK(v)}`);

export const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
