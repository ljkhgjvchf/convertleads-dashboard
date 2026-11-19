/* Deterministic fake data, so server and client render the same numbers. */

export type Point = { x: string; v: number; [k: string]: string | number };
export type Series = { points: Point[]; delta: string; total?: number };

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const YEARS = ["2021", "2022", "2023", "2024", "2025", "2026"];

const frac = (x: number) => x - Math.floor(x);
export const rand = (i: number, seed = 1) => frac(Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453);

/** n values around `base`, trending up by `growth` per step, with ±jitter/2 noise. */
export function wave(n: number, base: number, { seed = 1, growth = 0.03, jitter = 0.4 } = {}) {
  return Array.from({ length: n }, (_, i) => Math.round(base * (1 + growth * i) * (1 - jitter / 2 + jitter * rand(i, seed))));
}

export const toSeries = (labels: string[], values: number[], delta: string): Series => ({
  points: labels.map((x, i) => ({ x, v: values[i] })),
  delta,
});

export const sum = (s: Series) => s.total ?? s.points.reduce((a, p) => a + p.v, 0);
