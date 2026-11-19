"use client";

import type { HoverProps } from "./shared";

const LEVELS = ["bg-surface-2", "bg-ink-4", "bg-violet-soft/50", "bg-violet-soft", "bg-violet"];

/** GitHub-style grid, filled column by column (`rows` cells per column). */
export function Heatmap({ data, active, onActive, rows = 7, levels = LEVELS }: HoverProps & { rows?: number; levels?: string[] }) {
  const max = Math.max(1, ...data.map((d) => d.v));
  return (
    <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }} onMouseLeave={() => onActive(null)}>
      {data.map((d, i) => {
        const lvl = Math.min(levels.length - 1, Math.floor((d.v / max) * levels.length));
        return (
          <span key={i} onMouseEnter={() => onActive(i)}
            className={`cell-pop size-2.5 rounded-[3px] transition-[transform,opacity] duration-150 ${levels[lvl]} ${active === i ? "scale-150" : ""}`}
            style={{ animationDelay: `${300 + Math.floor(i / rows) * 18}ms`, opacity: active !== null && active !== i ? 0.55 : 1 }} />
        );
      })}
    </div>
  );
}
