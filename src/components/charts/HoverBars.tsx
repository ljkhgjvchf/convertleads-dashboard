"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axis, noTip, onMove, riseBar, type HoverProps } from "./shared";

type Props = HoverProps & { color?: string; activeColor?: string; track?: boolean; height?: number; yFmt?: (v: number) => string };

/** Rounded bar chart; hovering a bar highlights it and reports its index. */
export function HoverBars({ data, active, onActive, color = "var(--color-lime)", activeColor = "var(--color-lime-active)", track = true, height = 230, yFmt }: Props) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer>
        <BarChart data={data} barCategoryGap="22%" onMouseMove={onMove(onActive)} onMouseLeave={() => onActive(null)}>
          <XAxis dataKey="x" {...axis} interval={0} />
          <YAxis {...axis} width={44} tickCount={4} tickFormatter={yFmt} />
          <Tooltip content={noTip} cursor={false} />
          <Bar dataKey="v" fill={color} isAnimationActive={false} shape={riseBar(active, activeColor)}
            background={track ? { fill: "var(--color-surface-2)", radius: 14 } : undefined} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
