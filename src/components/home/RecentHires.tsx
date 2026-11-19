"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { Avatar, Button, Card, CountUp, tileClass } from "@/components/ui";

type Hire = { name: string; when: string; role: string };

/** 2×2 grid of people with Previous / Next paging. */
export function RecentHires({ hires, total, i = 0 }: { hires: Hire[]; total: number; i?: number }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(hires.length / 4);
  const nav = `${tileClass} flex items-center justify-center gap-1.5 py-1.5 text-sm font-medium transition-all active:scale-[0.97] disabled:pointer-events-none disabled:text-ink-4 disabled:shadow-none`;
  return (
    <Card i={i} className="p-2">
      <div className="flex items-start justify-between px-2 pt-2">
        <div><p className="text-sm font-medium text-ink-2">Recent hires</p><p className="mt-1 text-2xl font-medium"><CountUp value={String(total)} /></p></div>
        <Button variant="ghost">All teams <ChevronDown size={16} /></Button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {hires.slice(page * 4, page * 4 + 4).map((h, n) => (
          <div key={h.name} className={`${tileClass} label-in p-2.5 transition-shadow hover:shadow-md`} style={{ animationDelay: `${n * 50}ms` }}>
            <div className="flex items-center gap-2.5">
              <Avatar name={h.name} />
              <div className="min-w-0"><p className="truncate text-sm font-medium">{h.name}</p><p className="text-sm text-ink-2">{h.when}</p></div>
            </div>
            <p className="mt-2.5 truncate rounded-md bg-surface py-1 text-center text-xs font-medium text-ink-2">{h.role}</p>
          </div>
        ))}
        <button disabled={page === 0} onClick={() => setPage(page - 1)} className={nav}><ArrowLeft size={16} /> Previous</button>
        <button disabled={page === pages - 1} onClick={() => setPage(page + 1)} className={nav}>Next <ArrowRight size={16} /></button>
      </div>
    </Card>
  );
}
