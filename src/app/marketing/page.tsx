"use client";

import { Megaphone } from "lucide-react";
import { ComboBarLine, Funnel, Gauge, HoverArea, RankedBars } from "@/components/charts";
import { KpiRow, PageHeader, StatChartCard } from "@/components/dashboard";
import { CampaignsTable } from "@/components/marketing/CampaignsTable";
import { Card, CountUp, LegendTile } from "@/components/ui";
import { C, adSpend, avgRoas, campaigns, funnel, kpis, sources, spend, visitorKeys, visitors } from "@/data/marketing";
import { sum } from "@/lib/fake";
import { axisK, compact, num, usd, usdK } from "@/lib/format";

const roasFmt = (v: number) => `${v.toFixed(1)}x`;

export default function Marketing() {
  return (
    <>
      <PageHeader icon={Megaphone} title="Marketing" crumb="Marketing" action="New campaign" />
      <KpiRow items={kpis} start={2} />

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <StatChartCard i={6} variant="tiles" control="picker" periods={funnel} defaultPeriod="Last 30 days" fmt={compact} deltaMode="share"
          label={(p) => (p ? `Acquisition funnel · ${p.x}` : "Acquisition funnel")}>
          {({ series, active, setActive }) => (
            <>
              <div className="mt-4"><Funnel data={series.points} active={active} onActive={setActive} /></div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" onMouseLeave={() => setActive(null)}>
                {series.points.map((p, n) => (
                  <div key={p.x} onMouseEnter={() => setActive(n)}>
                    <LegendTile color={String(p.color)} label={p.x} value={compact(p.v)} active={active === n} />
                  </div>
                ))}
              </div>
            </>
          )}
        </StatChartCard>

        <StatChartCard i={7} control="picker" label="Spend by channel" periods={spend} defaultPeriod="Last 30 days" fmt={usd} deltaMode="share">
          {({ series, active, setActive }) => {
            const p = series.points[active ?? 0];
            return (
              <>
                <div className="mt-2">
                  <Gauge data={series.points} active={active} onActive={setActive}>
                    <p className="text-3xl font-medium"><CountUp value={`${Math.round((p.v / sum(series)) * 100)}%`} /></p>
                    <p key={p.x} className="label-in text-xs text-ink-2">{p.x}</p>
                  </Gauge>
                </div>
                <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-sm" onMouseLeave={() => setActive(null)}>
                  {series.points.map((d, n) => (
                    <button key={d.x} onMouseEnter={() => setActive(n)} onFocus={() => setActive(n)} onBlur={() => setActive(null)}
                      className="flex items-center gap-1.5 rounded-md transition-opacity duration-200" style={{ opacity: active !== null && active !== n ? 0.4 : 1 }}>
                      <span className="size-2.5 rounded-[3px]" style={{ background: String(d.color) }} />
                      <span className="text-ink-2">{d.x}</span><span className="font-medium tabular-nums">{usd(d.v)}</span>
                    </button>
                  ))}
                </div>
              </>
            );
          }}
        </StatChartCard>

        <Card i={8} className="overflow-hidden lg:col-span-2 xl:col-span-1">
          <RankedBars groups={sources} label="Sessions" />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <StatChartCard i={9} variant="tiles" control="picker" periods={adSpend} fmt={usdK}
          label={(p, s) => (p ? `Ad spend · ${p.x} · ROAS ${roasFmt(Number(p.roas))}` : `Ad spend · ROAS ${avgRoas(s)}x`)}>
          {({ series, active, setActive }) => {
            const p = active !== null ? series.points[active] : null;
            return (
              <>
                <div className="mt-4">
                  <ComboBarLine data={series.points} active={active} onActive={setActive} lineKey="roas" yFmt={axisK} lineFmt={roasFmt} lineTicks={[0, 2, 4, 6]} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <LegendTile color={C.lime} label={p ? `Ad spend · ${p.x}` : "Ad spend · total"} value={usdK(p ? p.v : sum(series))} />
                  <LegendTile color={C.blue} label={p ? `ROAS · ${p.x}` : "ROAS · average"} value={p ? roasFmt(Number(p.roas)) : `${avgRoas(series)}x`} />
                </div>
              </>
            );
          }}
        </StatChartCard>

        <StatChartCard i={10} variant="tiles" control="picker" label="Visitors" periods={visitors} fmt={num}>
          {({ series, active, setActive }) => {
            const p = active !== null ? series.points[active] : null;
            return (
              <>
                <div className="mt-4"><HoverArea data={series.points} active={active} onActive={setActive} keys={visitorKeys} stacked yFmt={axisK} /></div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {visitorKeys.map((k) => (
                    <LegendTile key={k.key} color={k.color} label={p ? `${k.name} · ${p.x}` : k.name}
                      value={num(p ? Number(p[k.key]) : series.points.reduce((a, q) => a + Number(q[k.key]), 0))} />
                  ))}
                </div>
              </>
            );
          }}
        </StatChartCard>
      </div>

      <CampaignsTable data={campaigns} i={12} />
    </>
  );
}
