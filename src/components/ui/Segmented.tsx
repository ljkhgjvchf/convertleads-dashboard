"use client";

import { useIndicator } from "./useIndicator";

/**
 * Pill switch with a sliding thumb (Weekly / Monthly / Yearly).
 * variant "raised": white thumb, for grey cards. "soft": grey thumb, for white panels.
 */
export function Segmented({ options, value, onChange, variant = "raised" }: {
  options: string[]; value: string; onChange: (v: string) => void; variant?: "raised" | "soft";
}) {
  const { ref, box } = useIndicator(options.indexOf(value));
  return (
    <div role="tablist" className="relative flex shrink-0 flex-wrap rounded-[10px] p-0.5 text-sm">
      <span aria-hidden className={`absolute rounded-lg transition-all duration-300 ease-out-quint ${variant === "raised" ? "bg-panel shadow-card" : "bg-surface-2"}`} style={box} />
      {options.map((o, i) => (
        <button key={o} ref={ref(i)} role="tab" aria-selected={o === value} onClick={() => onChange(o)}
          className={`relative rounded-lg px-2.5 py-1 font-medium transition-colors duration-200 ${o === value ? "text-ink" : "text-ink-2 hover:text-ink"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}
