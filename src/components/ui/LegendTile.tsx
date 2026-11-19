import { tileClass } from "./Card";

/** Colour swatch + label + value, used under charts. */
export function LegendTile({ color, label, value, active = false }: { color: string; label: string; value: string; active?: boolean }) {
  return (
    <div className={`${tileClass} min-w-0 p-2.5 transition-shadow duration-200 ${active ? "ring-2 ring-ink-4" : ""}`}>
      <p className="flex items-center gap-1.5 text-sm text-ink-2"><span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: color }} /><span className="truncate">{label}</span></p>
      <p key={value} className="label-in mt-0.5 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}
