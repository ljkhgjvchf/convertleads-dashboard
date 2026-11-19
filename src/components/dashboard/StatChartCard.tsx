"use client";

import { useState, type ReactNode } from "react";
import { Calendar } from "lucide-react";
import { Card, Picker, Segmented } from "@/components/ui";
import { pct } from "@/lib/format";
import { sum, type Point, type Series } from "@/lib/fake";
import { StatHead } from "./StatHead";

export type StatCtx = {
  series: Series;
  active: number | null;
  setActive: (i: number | null) => void;
  period: string;
  /** the period switch, for cards that place it somewhere other than the header */
  control: ReactNode;
};

type Props = {
  /** Plain label gets " · <hovered x>" appended on hover; a function gets full control. */
  label: string | ((p: Point | null, s: Series) => string);
  /** One fake series per filter option, e.g. { Weekly, Monthly, Yearly }. */
  periods: Record<string, Series>;
  defaultPeriod?: string;
  control?: "segmented" | "picker" | "none";
  controlInHeader?: boolean;
  fmt: (n: number) => string;
  /** Delta shown while hovering: change vs previous point, share of total, or hidden. */
  deltaMode?: "prev" | "share" | "none";
  /** "chart": padded card. "tiles": tight card for content made of tiles. */
  variant?: "chart" | "tiles";
  i?: number;
  className?: string;
  children: (ctx: StatCtx) => ReactNode;
};

/**
 * Card whose header number follows the hovered point of the chart inside it,
 * with a period switch that swaps the whole series.
 */
export function StatChartCard({ label, periods, defaultPeriod, control = "segmented", controlInHeader = true, fmt,
  deltaMode = "prev", variant = "chart", i = 0, className = "", children }: Props) {
  const keys = Object.keys(periods);
  const [period, setPeriod] = useState(defaultPeriod ?? keys[0]);
  const [active, setActive] = useState<number | null>(null);
  const series = periods[period];
  const p = active !== null ? series.points[active] ?? null : null;
  const total = sum(series);

  let delta: string | undefined = series.delta;
  if (p && active !== null) {
    if (deltaMode === "share") delta = `${Math.round((p.v / total) * 100)}%`;
    else if (deltaMode === "none") delta = undefined;
    else { const prev = series.points[active - 1]; delta = prev ? pct(((p.v - prev.v) / prev.v) * 100) : "0.0%"; }
  }
  const text = typeof label === "function" ? label(p, series) : p ? `${label} · ${p.x}` : label;

  const change = (v: string) => { setPeriod(v); setActive(null); };
  const ctl = control === "none" ? null : control === "segmented"
    ? <Segmented options={keys} value={period} onChange={change} />
    : <Picker icon={Calendar} label="Period" options={keys} value={period} onChange={change} />;

  return (
    <Card i={i} className={`${variant === "chart" ? "px-4 pt-4 pb-3" : "p-2"} ${className}`}>
      <div className={variant === "tiles" ? "px-2 pt-2" : ""}>
        <StatHead label={text} value={fmt(p ? p.v : total)} delta={delta} right={controlInHeader ? ctl : undefined} />
      </div>
      {/* keyed so entry animations replay when the period changes */}
      <div key={period}>{children({ series, active, setActive, period, control: ctl })}</div>
    </Card>
  );
}
