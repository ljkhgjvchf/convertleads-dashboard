"use client";

import type { ReactNode } from "react";
import type { HoverProps } from "./shared";

const CX = 130, CY = 122, R = 92, W = 26, START = 215, SWEEP = 250, GAP = 6;

const pt = (a: number) => [CX + R * Math.cos((a * Math.PI) / 180), CY - R * Math.sin((a * Math.PI) / 180)];
const arc = (a1: number, a2: number) => {
  const [x1, y1] = pt(a1), [x2, y2] = pt(a2);
  return `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${a1 - a2 > 180 ? 1 : 0} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
};

/**
 * 250° segmented gauge. Segments draw in one after another; hovering one thickens it,
 * dims the rest and reports its index. `children` renders in the centre.
 */
export function Gauge({ data, active, onActive, height = 220, children }: HoverProps & { height?: number; children?: ReactNode }) {
  const total = data.reduce((a, d) => a + d.v, 0);
  const cap = (W / 2 / R) * (180 / Math.PI); // round caps stick out this many degrees
  let a = START;
  const segs = data.map((d, i) => {
    const span = (SWEEP * d.v) / total;
    let s = a - cap - (i ? GAP / 2 : 0);
    let e = a - span + cap + (i < data.length - 1 ? GAP / 2 : 0);
    a -= span;
    if (e >= s) { const mid = a + span / 2; s = mid + 0.01; e = mid - 0.01; } // too thin: draw a dot
    return { d: arc(s, e), color: String(d.color) };
  });

  return (
    <div className="relative" style={{ height }} onMouseLeave={() => onActive(null)}>
      <svg viewBox="0 0 260 205" className="size-full">
        {segs.map((s, i) => {
          const on = active === i, dim = active !== null && !on;
          const delay = { animationDelay: `${200 + i * 140}ms` };
          return (
            <g key={i} onMouseEnter={() => onActive(i)} className="cursor-pointer">
              <path d={s.d} pathLength={1} strokeDasharray="1 1" fill="none" stroke={s.color} strokeLinecap="round" className="arc-draw"
                style={{ ...delay, strokeWidth: W + 14, opacity: dim ? 0.05 : 0.18 }} />
              <path d={s.d} pathLength={1} strokeDasharray="1 1" fill="none" stroke={s.color} strokeLinecap="round" className="arc-draw"
                style={{ ...delay, strokeWidth: on ? W + 6 : W, opacity: dim ? 0.35 : 1 }} />
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-x-0 text-center" style={{ top: `${(CY / 205) * 100}%`, transform: "translateY(-50%)" }}>{children}</div>
    </div>
  );
}
