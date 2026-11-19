"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./Button";

/** Visual pager: 1–5 … last. Holds its own page state. */
export function Pagination({ last }: { last: number }) {
  const [p, setP] = useState(1);
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
      <Button disabled={p === 1} onClick={() => setP(p - 1)}><ArrowLeft size={16} /> Previous</Button>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 0, last].map((n) => n === 0 ? <span key="gap" className="grid size-8 place-items-center text-ink-3">…</span> : (
          <button key={n} onClick={() => setP(n)} aria-current={p === n ? "page" : undefined}
            className={`size-8 rounded-lg tabular-nums transition-colors ${p === n ? "border border-line-strong bg-panel shadow-card" : "text-ink-2 hover:bg-surface-2"}`}>{n}</button>
        ))}
      </div>
      <Button disabled={p === last} onClick={() => setP(p + 1)}>Next <ArrowRight size={16} /></Button>
    </div>
  );
}
