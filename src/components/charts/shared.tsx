import type { Point } from "@/lib/fake";

/** Every chart reports the hovered point index so the card header can show it. */
export type HoverProps = { data: Point[]; active: number | null; onActive: (i: number | null) => void };

export const axis = { tickLine: false, axisLine: false, tick: { fill: "var(--color-axis)", fontSize: 12 } } as const;

/** Recharts mouse state → hovered index. */
export const onMove = (onActive: HoverProps["onActive"]) => (s: { activeTooltipIndex?: number }) =>
  onActive(typeof s.activeTooltipIndex === "number" ? s.activeTooltipIndex : null);

export const noTip = () => null;

type BarShape = { x?: number; y?: number; width?: number; height?: number; fill?: string; index?: number };

/** Bar shape that rises from the baseline with a stagger; hovered bar darkens, the rest fade. */
export const riseBar = (active: number | null, activeFill: string) =>
  function RiseBar(props: unknown) {
    const { x = 0, y = 0, width = 0, height = 0, fill, index = 0 } = props as BarShape;
    const on = active === index;
    return (
      <rect x={x} y={y} width={width} height={Math.max(height, 0)} rx={Math.min(width / 2, 14)}
        fill={on ? activeFill : fill} opacity={active === null || on ? 1 : 0.45} className="bar-rise"
        style={{ transformOrigin: `${x}px ${y + height}px`, animationDelay: `${150 + index * 45}ms` }} />
    );
  };
