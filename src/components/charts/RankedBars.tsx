"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Tabs } from "@/components/ui";

export type RankedRow = { name: string; pct: number; icon: ReactNode };

/**
 * Tabbed list of horizontal share bars. Shows `visible` rows; the rest expand
 * behind a chevron toggle. Bars grow on mount and morph between tabs.
 */
export function RankedBars({ groups, visible = 5, label }: { groups: Record<string, RankedRow[]>; visible?: number; label?: string }) {
  const tabs = Object.keys(groups);
  const [tab, setTab] = useState(tabs[0]);
  const [open, setOpen] = useState(false);
  const [grown, setGrown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGrown(true), 350); return () => clearTimeout(t); }, []);

  const rows = groups[tab];
  const max = Math.max(...rows.map((r) => r.pct));
  const extra = rows.length > visible;

  const row = (r: RankedRow, i: number) => (
    <li key={i} className="group relative flex h-9 items-center px-2.5 text-sm">
      <span className="absolute inset-y-0 left-0 rounded-lg bg-brand-soft transition-[width,background-color] duration-700 ease-out-quint group-hover:bg-brand-soft-hover"
        style={{ width: grown ? `${(r.pct / max) * 100}%` : "0%", transitionDelay: `${(i % visible) * 50}ms` }} />
      <span key={tab + r.name} className="label-in relative flex min-w-0 items-center gap-2 font-medium" style={{ animationDelay: `${i * 35}ms` }}>
        <span className="shrink-0 text-ink-2">{r.icon}</span><span className="truncate">{r.name}</span>
      </span>
      <span className="relative ml-auto pl-2 font-medium tabular-nums">{r.pct}%</span>
    </li>
  );

  return (
    <div className="flex h-full flex-col">
      <Tabs options={tabs} value={tab} onChange={setTab}
        right={label && <span className="hidden text-xs font-medium tracking-wider text-ink-3 uppercase sm:block">{label}</span>} />
      <div className={`relative p-2 ${extra ? "pb-9" : ""}`}>
        <ul className="flex flex-col gap-1.5">{rows.slice(0, visible).map(row)}</ul>
        {extra && (
          <>
            <div className="grid transition-[grid-template-rows] duration-500 ease-out-quint" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
              <div className="min-h-0 overflow-hidden">
                <ul className="flex flex-col gap-1.5 pt-1.5">{rows.slice(visible).map((r, i) => row(r, i + visible))}</ul>
              </div>
            </div>
            <div aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-9 h-12 bg-gradient-to-t from-surface to-transparent transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Show fewer rows" : "Show all rows"}
              className="absolute bottom-2 left-1/2 grid h-6 w-10 -translate-x-1/2 place-items-center rounded-full border border-line-strong bg-panel text-ink-2 shadow-card transition-[transform,color] hover:text-ink active:scale-95">
              <ChevronDown size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
