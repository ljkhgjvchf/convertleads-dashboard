"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Avatar, Chip, IconButton, Pagination, Picker, SearchField, stagger, type Tone } from "@/components/ui";
import type { OrderStatus, orders as Orders } from "@/data/home";

const TONE: Record<OrderStatus, Tone> = { Completed: "lime", Processing: "violet", Waiting: "neutral" };
const PRICE: Record<string, (v: number) => boolean> = {
  "All prices": () => true, "Under $100": (v) => v < 100, "$100 – $500": (v) => v >= 100 && v <= 500,
  "$500 – $1,000": (v) => v > 500 && v <= 1000, "Over $1,000": (v) => v > 1000,
};

export function OrdersTable({ rows, total, i = 0 }: { rows: typeof Orders; total: number; i?: number }) {
  const [price, setPrice] = useState("All prices");
  const [product, setProduct] = useState("All products");
  const [q, setQ] = useState("");
  const shown = rows.filter((o) => PRICE[price](parseFloat(o.price.replace(/[$,]/g, "")))
    && (product === "All products" || o.item === product)
    && o.name.toLowerCase().includes(q.toLowerCase()));
  const td = "border-b border-line px-3 py-3";

  return (
    <section className="reveal mt-6" style={stagger(i)}>
      <div className="flex flex-wrap items-end gap-2">
        <div><p className="text-sm font-medium text-ink-2">Total results</p><p className="text-sm font-medium">{total.toLocaleString()} customers</p></div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Picker label="Price" value={price} onChange={setPrice} options={Object.keys(PRICE)} />
          <Picker label="Product" value={product} onChange={setProduct} options={["All products", "Sneakers", "Backpack", "Smart watch", "Headphones", "Sunglasses", "Wallet"]} />
          <Picker label="Region" options={["All regions", "North America", "Europe", "Asia", "Oceania"]} />
          <SearchField value={q} onChange={setQ} />
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-ink-3">
              {["Customer name", "Purchase", "Status", "Last updated", "Price", ""].map((h) => <th key={h} className="border-b border-line px-3 py-2.5 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {shown.map((o) => (
              <tr key={o.name} className="label-in transition-colors hover:bg-surface">
                <td className={td}><span className="flex items-center gap-2.5 font-medium"><Avatar name={o.name} size={28} />{o.name}</span></td>
                <td className={`${td} text-ink-2`}>{o.item}</td>
                <td className={td}><Chip tone={TONE[o.status]}>{o.status}</Chip><span className="ml-2 text-ink-2">{o.delivery}</span></td>
                <td className={`${td} text-ink-2 tabular-nums`}>{o.date}</td>
                <td className={`${td} font-medium tabular-nums`}>{o.price}</td>
                <td className={`${td} text-right`}><IconButton aria-label="Actions" className="ml-auto"><MoreHorizontal size={16} /></IconButton></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={6} className="label-in py-12 text-center text-ink-2">No customers match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      <Pagination last={55} />
    </section>
  );
}
