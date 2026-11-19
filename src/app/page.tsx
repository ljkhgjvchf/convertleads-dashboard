"use client";

import { Heatmap, HoverArea, HoverBars } from "@/components/charts";
import { KpiRow, PageHeader, StatChartCard } from "@/components/dashboard";
import { OrdersTable } from "@/components/home/OrdersTable";
import { RecentHires } from "@/components/home/RecentHires";
import { useProfile } from "@/components/shell/profile";
import { Tile } from "@/components/ui";
import { activity, contributionStats, earned, hires, kpis, orders, revenue } from "@/data/home";
import { MONTHS } from "@/lib/fake";
import { axisUsdK, num, usd } from "@/lib/format";

export default function Home() {
  const [profile] = useProfile();
  return (
    <>
      <PageHeader title={`Welcome back, ${profile.first || "there"}`} crumb="Home" action="Create ticket" />

      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_3fr]">
        <RecentHires hires={hires} total={56} i={2} />
        <StatChartCard i={3} label="Earned so far" periods={earned} defaultPeriod="Monthly" fmt={usd}>
          {({ series, active, setActive }) => (
            <div className="mt-4"><HoverBars data={series.points} active={active} onActive={setActive} yFmt={axisUsdK} /></div>
          )}
        </StatChartCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <StatChartCard i={4} label="Revenue" periods={revenue} defaultPeriod="Monthly" fmt={usd}>
          {({ series, active, setActive }) => (
            <div className="mt-4">
              <HoverArea data={series.points} active={active} onActive={setActive} yFmt={axisUsdK}
                keys={[{ key: "v", color: "var(--color-lime-active)", fill: "var(--color-lime)" }]} />
            </div>
          )}
        </StatChartCard>

        <StatChartCard i={5} variant="tiles" periods={activity} defaultPeriod="Monthly" fmt={num} deltaMode="none" controlInHeader={false}
          label={(p) => (p ? `Contributions · ${p.x}` : "Contributions this year")}>
          {({ series, active, setActive, control }) => (
            <>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {contributionStats.map(([v, l]) => <Tile key={l} className="p-2.5"><p className="text-sm font-medium">{v}</p><p className="text-sm text-ink-2">{l}</p></Tile>)}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2">
                <p className="text-sm font-medium text-ink-2">Activity</p>{control}
              </div>
              <div className="mt-3 overflow-hidden px-2 pb-2">
                <Heatmap data={series.points} active={active} onActive={setActive} />
                <div className="mt-2 flex justify-between text-xs text-ink-3">{MONTHS.map((m) => <span key={m}>{m}</span>)}</div>
              </div>
            </>
          )}
        </StatChartCard>
      </div>

      <KpiRow items={kpis} start={6} />
      <OrdersTable rows={orders} total={660} i={10} />
    </>
  );
}
