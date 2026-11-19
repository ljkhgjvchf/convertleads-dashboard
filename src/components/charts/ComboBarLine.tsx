"use client";

import { Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axis, noTip, onMove, riseBar, type HoverProps } from "./shared";

type Props = HoverProps & {
  lineKey: string; height?: number;
  yFmt?: (v: number) => string; lineFmt?: (v: number) => string; lineTicks?: number[];
  barColor?: string; barActive?: string; lineColor?: string;
};

/** Bars on the left axis + a line on the right axis (e.g. spend + ROAS). */
export function ComboBarLine({ data, active, onActive, lineKey, height = 230, yFmt, lineFmt, lineTicks,
  barColor = "var(--color-lime)", barActive = "var(--color-lime-active)", lineColor = "var(--color-blue)" }: Props) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} barCategoryGap="28%" onMouseMove={onMove(onActive)} onMouseLeave={() => onActive(null)}>
          <XAxis dataKey="x" {...axis} interval={0} />
          <YAxis yAxisId="l" {...axis} width={44} tickCount={4} tickFormatter={yFmt} />
          <YAxis yAxisId="r" orientation="right" {...axis} width={36} ticks={lineTicks} domain={lineTicks ? [lineTicks[0], lineTicks.at(-1)!] : undefined} tickFormatter={lineFmt} />
          <Tooltip content={noTip} cursor={false} />
          <Bar yAxisId="l" dataKey="v" fill={barColor} isAnimationActive={false} shape={riseBar(active, barActive)} />
          <Line yAxisId="r" dataKey={lineKey} stroke={lineColor} strokeWidth={2} type="monotone"
            dot={{ r: 3, fill: "var(--color-panel)", stroke: lineColor, strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "var(--color-panel)", stroke: lineColor, strokeWidth: 2.5 }}
            animationBegin={500} animationDuration={1200} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
