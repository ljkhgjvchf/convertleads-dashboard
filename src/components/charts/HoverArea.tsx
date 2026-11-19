"use client";

import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axis, noTip, onMove, type HoverProps } from "./shared";

export type AreaKey = { key: string; color: string; fill?: string };

type Props = HoverProps & { keys: AreaKey[]; stacked?: boolean; height?: number; yFmt?: (v: number) => string };

/** Smooth area / stacked-area chart. Hover shows a guide line + dots, no popup. */
export function HoverArea({ data, keys, stacked = false, onActive, height = 240, yFmt }: Props) {
  const uid = useId().replace(/:/g, "");
  return (
    <div className="chart-reveal" style={{ height }}>
      <ResponsiveContainer>
        <AreaChart data={data} onMouseMove={onMove(onActive)} onMouseLeave={() => onActive(null)}>
          <defs>
            {keys.map(({ key, color, fill = color }) => (
              <linearGradient key={key} id={`${uid}-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fill} stopOpacity={0.35} />
                <stop offset="100%" stopColor={fill} stopOpacity={0.03} />
              </linearGradient>
            ))}
          </defs>
          <XAxis dataKey="x" {...axis} interval={0} padding={{ left: 12, right: 12 }} />
          <YAxis {...axis} width={44} tickCount={4} tickFormatter={yFmt} />
          <Tooltip content={noTip} cursor={{ stroke: "var(--color-ink-4)", strokeDasharray: "4 4" }} />
          {keys.map(({ key, color }) => (
            <Area key={key} stackId={stacked ? "s" : undefined} type="monotone" dataKey={key} stroke={color} strokeWidth={2.5}
              fill={`url(#${uid}-${key})`} isAnimationActive={false}
              activeDot={{ r: 5, fill: "var(--color-panel)", stroke: color, strokeWidth: 2.5 }} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
