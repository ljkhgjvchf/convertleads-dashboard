"use client";

import type { HoverProps } from "./shared";

/** Flowing funnel; each stage tapers into the next. Points need `color`. Hover reports the stage index. */
export function Funnel({ data, active, onActive, height = 180 }: HoverProps & { height?: number }) {
  const H = 90, n = data.length, step = 400 / n;
  const top = data[0]?.v || 1;
  const hs = data.map((d) => Math.max((d.v / top) * 78, 5));
  const path = (i: number, pad: number) => {
    const x0 = i * step, a = hs[i] + pad, b = (hs[i + 1] ?? hs[i]) + pad;
    const k1 = x0 + step * 0.55, k2 = x0 + step * 0.8, k3 = x0 + step * 0.75, x1 = x0 + step;
    return `M${x0},${H - a} L${k1},${H - a} C${k2},${H - a} ${k3},${H - b} ${x1},${H - b} L${x1},${H + b} C${k3},${H + b} ${k2},${H + a} ${k1},${H + a} L${x0},${H + a} Z`;
  };
  return (
    <div className="chart-reveal relative" style={{ height }} onMouseLeave={() => onActive(null)}>
      <svg viewBox="0 0 400 180" preserveAspectRatio="none" className="size-full">
        {data.map((d, i) => (
          <g key={d.x} onMouseEnter={() => onActive(i)} className="cursor-pointer transition-opacity duration-200"
            style={{ opacity: active === null || active === i ? 1 : 0.35 }}>
            <path d={path(i, 9)} fill={String(d.color)} opacity={0.22} />
            <path d={path(i, 0)} fill={String(d.color)} />
          </g>
        ))}
      </svg>
      {data.map((d, i) => (
        <span key={d.x} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-panel px-2 py-0.5 text-xs font-semibold tabular-nums shadow-card transition-transform duration-200 ${active === i ? "scale-110" : ""}`}
          style={{ left: `calc(${(i * 100) / n}% + 14px)` }}>{Math.round((d.v / top) * 100)}%</span>
      ))}
    </div>
  );
}
