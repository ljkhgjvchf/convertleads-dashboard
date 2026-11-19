import type { LucideIcon } from "lucide-react";
import { Card, CountUp, Delta, tileClass } from "@/components/ui";

export type Kpi = { label: string; value: string; delta: string; icon: LucideIcon };

export function KpiCard({ label, value, delta, icon: Icon, i = 0 }: Kpi & { i?: number }) {
  return (
    <Card i={i} className="p-4">
      <span className={`${tileClass} grid size-8 place-items-center`}><Icon size={16} /></span>
      <p className="mt-4 text-sm font-medium text-ink-2">{label}</p>
      <p className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-medium"><CountUp value={value} /> <Delta v={delta} /></p>
    </Card>
  );
}

export function KpiRow({ items, start = 0 }: { items: Kpi[]; start?: number }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map((k, n) => <KpiCard key={k.label} {...k} i={start + n} />)}
    </div>
  );
}
