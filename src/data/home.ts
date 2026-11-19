/* Placeholder data for the Home dashboard. Replace with real queries. */
import { Box, ShoppingBasket, Ticket, Users } from "lucide-react";
import type { Kpi } from "@/components/dashboard";
import { DAYS, MONTHS, YEARS, rand, toSeries, wave, type Series } from "@/lib/fake";

export const earned: Record<string, Series> = {
  Weekly: toSeries(DAYS, wave(7, 1100, { seed: 3, growth: 0.02, jitter: 0.8 }), "+6.2%"),
  Monthly: toSeries(MONTHS, [2100, 6000, 7900, 5800, 2900, 1800, 3100, 4300, 5600, 3800, 9800, 6800], "+14.8%"),
  Yearly: toSeries(YEARS, wave(6, 38000, { seed: 5, growth: 0.22, jitter: 0.2 }), "+21.3%"),
};

export const revenue: Record<string, Series> = {
  Weekly: toSeries(DAYS, wave(7, 2400, { seed: 7, growth: 0.03, jitter: 0.5 }), "+3.1%"),
  Monthly: toSeries(MONTHS, [1600, 2000, 2600, 2300, 3400, 3200, 2900, 3900, 4600, 4100, 3600, 5700], "+9.4%"),
  Yearly: toSeries(YEARS, wave(6, 31000, { seed: 9, growth: 0.2, jitter: 0.15 }), "+18.6%"),
};

// 36 columns × 7 days of contribution counts
const cells = (seed: number, max: number) =>
  Array.from({ length: 36 * 7 }, (_, i) => ({ x: `Week ${Math.floor(i / 7) + 1} · ${DAYS[i % 7]}`, v: Math.floor(rand(i, seed) ** 1.6 * max) }));

export const activity: Record<string, Series> = {
  Weekly: { points: cells(11, 8), delta: "+4.2%" },
  Monthly: { points: cells(13, 14), delta: "+14.8%" },
  Yearly: { points: cells(17, 30), delta: "+31.0%" },
};

export const contributionStats = [["9B", "Lifetime tokens"], ["562.7M", "Peak tokens"], ["12h 54m", "Longest task"], ["62 days", "Top streak"]];

export const hires = [
  { name: "Sara Conti", when: "Joined today", role: "Backend Engineer" },
  { name: "Luca Ferri", when: "2 days ago", role: "UI Designer" },
  { name: "Giulia Marin", when: "5 days ago", role: "User Researcher" },
  { name: "Marco Testa", when: "A week ago", role: "DevOps Engineer" },
  { name: "Elisa Neri", when: "8 days ago", role: "Product Manager" },
  { name: "Tommaso Riva", when: "2 weeks ago", role: "Data Analyst" },
  { name: "Irene Sala", when: "2 weeks ago", role: "Content Lead" },
  { name: "Pietro Fabbri", when: "3 weeks ago", role: "Frontend Engineer" },
];

export const kpis: Kpi[] = [
  { label: "Customers", value: "14,592", delta: "+5.3%", icon: Users },
  { label: "Units sold", value: "385", delta: "-2.1%", icon: Box },
  { label: "Orders", value: "1,394", delta: "0.00%", icon: ShoppingBasket },
  { label: "Support tickets", value: "708", delta: "+12.8%", icon: Ticket },
];

export type OrderStatus = "Waiting" | "Completed" | "Processing";
export const orders: { name: string; item: string; status: OrderStatus; delivery: string; date: string; price: string }[] = [
  { name: "Elena Rossi", item: "Sneakers", status: "Completed", delivery: "Shipped", date: "Nov 18, 2026", price: "$129.00" },
  { name: "Paolo Greco", item: "Backpack", status: "Waiting", delivery: "Delivery waiting", date: "Nov 18, 2026", price: "$89.00" },
  { name: "Chiara Bruno", item: "Smart watch", status: "Processing", delivery: "Confirmed", date: "Nov 17, 2026", price: "$349.00" },
  { name: "Davide Galli", item: "Headphones", status: "Waiting", delivery: "Delivery failed", date: "Nov 16, 2026", price: "$199.00" },
  { name: "Anna Lombardi", item: "Sunglasses", status: "Completed", delivery: "Shipped", date: "Nov 15, 2026", price: "$145.00" },
  { name: "Matteo Costa", item: "Wallet", status: "Processing", delivery: "Confirmed", date: "Nov 14, 2026", price: "$59.00" },
  { name: "Sofia Moretti", item: "Smart watch", status: "Completed", delivery: "Shipped", date: "Nov 13, 2026", price: "$1,120.00" },
  { name: "Andrea Villa", item: "Sneakers", status: "Waiting", delivery: "Delivery waiting", date: "Nov 12, 2026", price: "$129.00" },
];
