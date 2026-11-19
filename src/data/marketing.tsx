/* Placeholder data for the Marketing dashboard. Replace with real queries. */
import { Coins, Eye, FileText, Globe, Handshake, Infinity as MetaIcon, Linkedin, Mail, Megaphone, MousePointer2, UserCheck } from "lucide-react";
import type { RankedRow } from "@/components/charts";
import type { Kpi } from "@/components/dashboard";
import type { Campaign } from "@/components/marketing/CampaignsTable";
import { MONTHS, wave, type Series } from "@/lib/fake";

export const C = { lime: "var(--color-lime)", blue: "var(--color-blue)", violet: "var(--color-violet-2)", pink: "var(--color-pink)" };

export const kpis: Kpi[] = [
  { label: "Ad spend", value: "$24,380", delta: "+8.4%", icon: Coins },
  { label: "Impressions", value: "1.94M", delta: "+12.6%", icon: Eye },
  { label: "Conversions", value: "1,286", delta: "+5.2%", icon: UserCheck },
  { label: "Cost per click", value: "$1.24", delta: "-3.1%", icon: MousePointer2 },
];

/* ---- funnel: total = visits ---- */
const F = (visits: number, r: [number, number, number], delta: string): Series => ({
  total: visits, delta,
  points: [
    { x: "Visits", v: visits, color: C.lime },
    { x: "Sign-ups", v: Math.round(visits * r[0]), color: C.blue },
    { x: "Trials", v: Math.round(visits * r[1]), color: C.violet },
    { x: "Customers", v: Math.round(visits * r[2]), color: C.pink },
  ],
});
export const funnel: Record<string, Series> = {
  "Last 7 days": F(22100, [0.43, 0.17, 0.06], "+2.1%"),
  "Last 30 days": F(96400, [0.4, 0.146, 0.054], "+5.8%"),
  "Last 90 days": F(281300, [0.38, 0.14, 0.05], "+11.4%"),
};

/* ---- spend by channel ---- */
const S = (v: number[], delta: string): Series => ({
  delta,
  points: ["Paid search", "Paid social", "Email", "Affiliates"].map((x, i) => ({ x, v: v[i], color: [C.lime, C.blue, C.violet, C.pink][i] })),
});
export const spend: Record<string, Series> = {
  "Last 7 days": S([2620, 1810, 760, 590], "+1.9%"),
  "Last 30 days": S([11400, 7620, 3180, 2680], "+8.4%"),
  "Last 90 days": S([33100, 23400, 9900, 7300], "+12.7%"),
};

/* ---- ad spend + ROAS ---- */
const A = (spendK: number[], roas: number[], delta: string): Series => ({
  delta, points: MONTHS.map((x, i) => ({ x, v: spendK[i], roas: roas[i] })),
});
export const adSpend: Record<string, Series> = {
  "This year": A([13200, 14100, 15300, 14800, 16600, 17900, 18200, 19500, 20600, 20100, 22400, 25000],
    [3.0, 3.1, 3.3, 3.2, 3.5, 3.7, 3.6, 3.9, 4.0, 3.8, 4.0, 4.1], "+9.4%"),
  "Last year": A(wave(12, 11500, { seed: 21, growth: 0.04, jitter: 0.18 }),
    [2.6, 2.7, 2.9, 2.8, 3.0, 3.1, 3.0, 3.2, 3.3, 3.2, 3.4, 3.5], "+6.1%"),
};
export const avgRoas = (s: Series) => (s.points.reduce((a, p) => a + Number(p.roas), 0) / s.points.length).toFixed(1);

/* ---- visitors (stacked) ---- */
const V = (o: number[], p: number[], s: number[], delta: string): Series => ({
  delta, points: MONTHS.map((x, i) => ({ x, v: o[i] + p[i] + s[i], organic: o[i], paid: p[i], social: s[i] })),
});
const org = [5000, 5300, 5600, 5500, 5900, 6000, 6300, 6400, 6600, 6900, 7300, 7700];
const paid = [2600, 2700, 2900, 2800, 3000, 3100, 3200, 3300, 3400, 3500, 3800, 4200];
const social = [1400, 1500, 1600, 1500, 1700, 1800, 1800, 1900, 1900, 2000, 2100, 2200];
const last = (a: number[], f: number, seed: number) => a.map((v, i) => Math.round(v * f * (0.94 + 0.12 * Math.abs(Math.sin(i * seed)))));
export const visitors: Record<string, Series> = {
  "This year": V(org, paid, social, "+8.8%"),
  "Last year": V(last(org, 0.8, 3), last(paid, 0.78, 5), last(social, 0.86, 7), "+5.2%"),
};
export const visitorKeys = [
  { key: "organic", name: "Organic", color: C.lime },
  { key: "paid", name: "Paid", color: C.blue },
  { key: "social", name: "Social", color: C.violet },
];

/* ---- sessions by source (5 visible, rest behind the toggle) ---- */
const G = () => <span className="grid size-4 place-items-center text-sm font-bold">G</span>;
const X = () => <span className="grid size-4 place-items-center text-sm font-bold">𝕏</span>;
const i16 = { size: 16 };
export const sources: Record<string, RankedRow[]> = {
  Channels: [
    { name: "Google Ads", pct: 39, icon: <G /> }, { name: "Meta", pct: 25, icon: <MetaIcon {...i16} /> },
    { name: "X Ads", pct: 14, icon: <X /> }, { name: "LinkedIn", pct: 8, icon: <Linkedin {...i16} /> },
    { name: "Email", pct: 7, icon: <Mail {...i16} /> }, { name: "Affiliates", pct: 4, icon: <Handshake {...i16} /> },
    { name: "Referral", pct: 3, icon: <Globe {...i16} /> },
  ],
  Campaigns: [
    "Black Friday push", "Holiday gift guide", "Newsletter promo", "Brand search", "Webinar signups", "Cart retargeting", "Case study promo",
  ].map((name, i) => ({ name, pct: [28, 21, 16, 13, 10, 7, 5][i], icon: <Megaphone {...i16} /> })),
  "Landing pages": ["/pricing", "/features", "/blog/ai-audit", "/demo", "/signup", "/about", "/careers"]
    .map((name, i) => ({ name, pct: [31, 22, 16, 12, 9, 6, 4][i], icon: <FileText {...i16} /> })),
};

/* ---- campaigns table ---- */
export const campaigns: Campaign[] = [
  { id: 1, name: "Black Friday push · Global", channel: "Google Ads", delivery: "Active", objective: "Conversions", date: "2026-11-18", spend: 34800 },
  { id: 2, name: "Holiday gift guide · EU", channel: "Meta", delivery: "Paused", objective: "Traffic", date: "2026-11-12", spend: 30884 },
  { id: 3, name: "Founder story · US", channel: "LinkedIn", delivery: "Active", objective: "Awareness", date: "2026-11-09", spend: 1330 },
  { id: 4, name: "Newsletter promo · IT", channel: "Email", delivery: "Paused", objective: "Leads", date: "2026-11-02", spend: 34445 },
  { id: 5, name: "Spring launch · UK", channel: "Referral", delivery: "Draft", objective: "Awareness", date: "2026-10-28", spend: 0 },
  { id: 6, name: "Brand search · US", channel: "Google Ads", delivery: "Paused", objective: "Leads", date: "2026-10-21", spend: 19116 },
  { id: 7, name: "Cart retargeting · DE", channel: "Meta", delivery: "Draft", objective: "Retargeting", date: "2026-10-14", spend: 0 },
  { id: 8, name: "Webinar signups · EU", channel: "X Ads", delivery: "Active", objective: "Leads", date: "2026-10-06", spend: 25305 },
  { id: 9, name: "Case study promo · UK", channel: "LinkedIn", delivery: "Active", objective: "Conversions", date: "2026-09-29", spend: 333 },
  { id: 10, name: "Product demo video · US", channel: "Meta", delivery: "Active", objective: "Awareness", date: "2026-09-21", spend: 28095 },
];
