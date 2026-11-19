"use client";

import type { ReactNode } from "react";
import { useIndicator } from "./useIndicator";

/** Underlined tabs with a sliding indicator. `right` renders at the far end of the bar. */
export function Tabs({ options, value, onChange, right }: { options: string[]; value: string; onChange: (v: string) => void; right?: ReactNode }) {
  const { ref, box } = useIndicator(options.indexOf(value));
  return (
    <div role="tablist" className="relative flex items-center gap-4 border-b border-line px-3">
      {options.map((t, i) => (
        <button key={t} ref={ref(i)} role="tab" aria-selected={t === value} onClick={() => onChange(t)}
          className={`py-3 text-sm font-medium whitespace-nowrap transition-colors ${t === value ? "text-brand" : "text-ink-2 hover:text-ink"}`}>{t}</button>
      ))}
      <span aria-hidden className="absolute bottom-[-1px] h-0.5 rounded-full bg-brand transition-all duration-300 ease-out-quint"
        style={{ left: box.left, width: box.width, opacity: box.opacity }} />
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}
