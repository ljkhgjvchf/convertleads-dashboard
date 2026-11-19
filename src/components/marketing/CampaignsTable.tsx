"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Globe, Infinity as MetaIcon, Linkedin, Mail, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Chip, IconButton, Pagination, Picker, SearchField, stagger, type Tone } from "@/components/ui";
import { usd } from "@/lib/format";

type Delivery = "Active" | "Paused" | "Draft";
type Objective = "Awareness" | "Traffic" | "Conversions" | "Leads" | "Retargeting";
type Channel = "Google Ads" | "Meta" | "X Ads" | "LinkedIn" | "Email" | "Referral";
export type Campaign = { id: number; name: string; channel: Channel; delivery: Delivery; objective: Objective; date: string; spend: number };

const glyph = (c: string) => <span className="grid size-4 place-items-center text-sm font-bold">{c}</span>;
const CHANNEL_ICON: Record<Channel, ReactNode> = {
  "Google Ads": glyph("G"), Meta: <MetaIcon size={16} />, "X Ads": glyph("𝕏"), LinkedIn: <Linkedin size={16} />, Email: <Mail size={16} />, Referral: <Globe size={16} />,
};
const DOT: Record<Delivery, string> = { Active: "bg-green", Paused: "bg-yellow", Draft: "bg-brand" };
const OBJ: Record<Objective, Tone> = { Awareness: "blue", Traffic: "cyan", Conversions: "lime", Leads: "yellow", Retargeting: "pink" };
const SPEND: Record<string, (v: number) => boolean> = {
  "All spend": () => true, "Under $1,000": (v) => v < 1000, "$1,000 – $5,000": (v) => v >= 1000 && v <= 5000,
  "$5,000 – $20,000": (v) => v > 5000 && v <= 20000, "Over $20,000": (v) => v > 20000,
};
const fmtDate = (d: string) => new Date(d + "T00:00").toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

type SortKey = "name" | "date" | "spend";

/** Filter, search, sort, multi-select, per-row delivery status and delete. */
export function CampaignsTable({ data, i = 0 }: { data: Campaign[]; i?: number }) {
  const [rows, setRows] = useState(data);
  const [delivery, setDelivery] = useState<Record<number, Delivery>>({});
  const [channel, setChannel] = useState("All channels");
  const [objective, setObjective] = useState("All objectives");
  const [range, setRange] = useState("All spend");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: SortKey; dir: 1 | -1 }>({ k: "date", dir: -1 });
  const [picked, setPicked] = useState<Set<number>>(new Set());

  const shown = useMemo(() => rows
    .filter((r) => (channel === "All channels" || r.channel === channel)
      && (objective === "All objectives" || r.objective === objective)
      && SPEND[range](r.spend)
      && r.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : a[sort.k] < b[sort.k] ? -1 : 0) * sort.dir),
  [rows, channel, objective, range, q, sort]);

  const allOn = shown.length > 0 && shown.every((r) => picked.has(r.id));
  const someOn = shown.some((r) => picked.has(r.id));
  const headBox = useRef<HTMLInputElement>(null);
  useEffect(() => { if (headBox.current) headBox.current.indeterminate = someOn && !allOn; }, [someOn, allOn]);

  const toggle = (id: number) => setPicked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleAll = () => setPicked(allOn ? new Set() : new Set(shown.map((r) => r.id)));
  const remove = (ids: number[]) => { setRows((r) => r.filter((x) => !ids.includes(x.id))); setPicked(new Set()); };
  const sortBy = (k: SortKey) => setSort((s) => ({ k, dir: s.k === k ? (-s.dir as 1 | -1) : 1 }));

  const sortTh = (k: SortKey, label: string) => (
    <button onClick={() => sortBy(k)} className={`flex items-center gap-1 font-medium transition-colors hover:text-ink ${sort.k === k ? "text-ink" : ""}`}>
      {label}
      {sort.k === k ? (sort.dir === 1 ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ChevronDown size={14} className="opacity-50" />}
    </button>
  );
  const td = "border-b border-line px-3 py-2.5";
  const th = "border-y border-line px-3 py-2.5 font-medium";

  return (
    <section className="reveal mt-4 rounded-2xl border border-line" style={stagger(i)}>
      <div className="flex flex-wrap items-center gap-2 p-3">
        {picked.size > 0 ? (
          <div className="label-in flex items-center gap-3">
            <p className="text-sm font-medium">{picked.size} selected</p>
            <button onClick={() => remove([...picked])} className="flex items-center gap-1.5 rounded-lg bg-chip-red px-2.5 py-1.5 text-sm font-medium text-chip-red-fg transition-transform active:scale-[0.97]"><Trash2 size={14} /> Delete</button>
          </div>
        ) : (
          <div><p className="text-sm font-medium text-ink-2">Total results</p><p className="text-sm font-medium">{shown.length} campaigns</p></div>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <Picker label="Channel" value={channel} onChange={setChannel} options={["All channels", "Google Ads", "Meta", "X Ads", "LinkedIn", "Email", "Referral"]} />
          <Picker label="Objective" value={objective} onChange={setObjective} options={["All objectives", "Conversions", "Traffic", "Awareness", "Leads", "Retargeting"]} />
          <Picker label="Spend" value={range} onChange={setRange} options={Object.keys(SPEND)} />
          <SearchField value={q} onChange={setQ} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-surface text-left text-ink-3">
            <tr>
              <th className={`${th} pr-1`}><span className="flex items-center gap-3">
                <input ref={headBox} type="checkbox" checked={allOn} onChange={toggleAll} aria-label="Select all" className="size-4 accent-brand" />
                {sortTh("name", "Campaign")}</span></th>
              <th className={th}>Delivery</th>
              <th className={th}>Objective</th>
              <th className={th}>{sortTh("date", "Last updated")}</th>
              <th className={th}>{sortTh("spend", "Spend")}</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const d = delivery[r.id] ?? r.delivery;
              return (
                <tr key={r.id} className={`label-in transition-colors ${picked.has(r.id) ? "bg-brand-soft/40" : "hover:bg-surface"}`}>
                  <td className={`${td} pr-1`}>
                    <span className="flex items-center gap-3">
                      <input type="checkbox" checked={picked.has(r.id)} onChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} className="size-4 accent-brand" />
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-2" title={r.channel}>{CHANNEL_ICON[r.channel]}</span>
                      <span className="truncate font-medium">{r.name}</span>
                    </span>
                  </td>
                  <td className={td}>
                    <label className="relative flex w-32 items-center gap-2 rounded-[10px] border border-line-strong bg-panel py-1.5 pr-7 pl-3 font-medium shadow-card transition-colors hover:border-ink-4">
                      <span className={`size-1.5 shrink-0 rounded-full transition-colors ${DOT[d]}`} />
                      <select aria-label={`Delivery for ${r.name}`} value={d} onChange={(e) => setDelivery((m) => ({ ...m, [r.id]: e.target.value as Delivery }))} className="w-full appearance-none bg-transparent outline-none">
                        {(["Active", "Paused", "Draft"] as const).map((o) => <option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-2 text-ink-2" />
                    </label>
                  </td>
                  <td className={td}><Chip tone={OBJ[r.objective]}>{r.objective}</Chip></td>
                  <td className={`${td} tabular-nums`}>{fmtDate(r.date)}</td>
                  <td className={td}>{r.spend ? <Chip>{usd(r.spend)}</Chip> : <span className="px-1.5 text-ink-3 tabular-nums">{usd(0)}</span>}</td>
                  <td className={td}>
                    <span className="flex justify-end gap-1.5">
                      <IconButton aria-label="Delete" onClick={() => remove([r.id])} className="hover:border-chip-red hover:bg-chip-red hover:text-chip-red-fg"><Trash2 size={15} /></IconButton>
                      <IconButton aria-label="Edit"><Pencil size={15} /></IconButton>
                      <IconButton aria-label="More"><MoreVertical size={15} /></IconButton>
                    </span>
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 && <tr><td colSpan={6} className="label-in py-12 text-center text-ink-2">No campaigns match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="px-3 pb-3"><Pagination last={8} /></div>
    </section>
  );
}
