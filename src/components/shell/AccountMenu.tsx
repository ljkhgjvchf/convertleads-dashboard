"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Blocks, Building2, ChevronUp, CreditCard, Folder, Landmark, Lock, LogOut, MessageSquare, ShieldCheck, Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { signOut } from "./auth";
import { WORKSPACE } from "./profile";

/** `opens` = Settings section this item jumps to; items without it are locked. */
type Item = { label: string; icon: LucideIcon; count?: number; opens?: "profile" | "general" };
const GROUPS: { title?: string; items: Item[] }[] = [
  { items: [{ label: "View team profile", icon: Landmark }, { label: "Folders", icon: Folder }, { label: "Messages", icon: MessageSquare, count: 94 }, { label: "People", icon: Users }] },
  { title: "Company", items: [{ label: "Billing", icon: CreditCard }, { label: "Company details", icon: Building2 }, { label: "Integrations", icon: Blocks }] },
  { title: "Personal", items: [{ label: "Notifications", icon: Bell, opens: "general" }, { label: "Account details", icon: ShieldCheck, opens: "profile" }] },
];

/* eslint-disable @next/next/no-img-element -- static brand-kit PNGs */
/** Brand-kit mark: dark C on light, white C on dark (never recoloured), with ~10% clear space. */
export const BrandLogo = ({ size = 36 }: { size?: number }) => (
  <span className="grid shrink-0 place-items-center rounded-[10px] bg-panel shadow-card" style={{ width: size, height: size, padding: size * 0.14 }}>
    <img src={WORKSPACE.logoDark} alt={WORKSPACE.name} className="size-full dark:hidden" />
    <img src={WORKSPACE.logoWhite} alt="" aria-hidden className="hidden size-full dark:block" />
  </span>
);

/** Account card at the bottom of the sidebar; opens a menu with Sign out. */
export function AccountMenu({ onOpen, compact = false }: { onOpen: (s: "profile" | "general") => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const out = () => { signOut(); setOpen(false); router.push("/login"); };
  const row = "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium";

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu"
        aria-label={compact ? `${WORKSPACE.name} account menu` : undefined} title={compact ? WORKSPACE.name : undefined}
        className={`flex w-full items-center rounded-xl bg-surface-2 text-left transition-[padding,background-color] duration-300 hover:bg-ink-4/50 ${compact ? "justify-center p-1.5" : "gap-2.5 p-2.5"}`}>
        <BrandLogo />
        <span className={`min-w-0 flex-1 ${compact ? "hidden" : ""}`}>
          <span className="block truncate font-brand text-sm font-semibold">{WORKSPACE.name}</span>
          <span className="block truncate text-sm text-ink-2">{WORKSPACE.site}</span>
        </span>
        <span className={`grid size-6 shrink-0 place-items-center rounded-md bg-panel text-ink-2 shadow-card ${compact ? "hidden" : ""}`}>
          <ChevronUp size={14} className={`transition-transform duration-300 ${open ? "" : "rotate-180"}`} />
        </span>
      </button>

      {open && (
        <div role="menu" className="menu-in absolute bottom-0 left-full z-50 ml-3 w-64 rounded-2xl border border-line-strong bg-panel p-1.5 shadow-menu">
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <BrandLogo />
            <span className="min-w-0"><span className="block font-brand text-sm font-semibold">{WORKSPACE.name}</span><span className="block truncate text-sm text-ink-2">{WORKSPACE.site}</span></span>
          </div>
          {GROUPS.map((g, gi) => (
            <div key={gi} className={gi ? "mt-1 border-t border-line pt-1" : ""}>
              {g.title && <p className="px-2.5 pt-2 pb-1 text-sm text-ink-3">{g.title}</p>}
              {g.items.map(({ label, icon: Icon, count, opens }) => opens ? (
                <button key={label} role="menuitem" onClick={() => { setOpen(false); onOpen(opens); }} className={`${row} text-ink transition-colors hover:bg-surface`}>
                  <Icon size={18} /> {label}
                </button>
              ) : (
                <span key={label} role="menuitem" aria-disabled title="Locked" className={`${row} cursor-not-allowed text-ink-3`}>
                  <Icon size={18} /> {label}
                  {count ? <Badge className="ml-auto bg-surface-2 text-ink-2">{count}</Badge> : <Lock size={13} className="ml-auto text-ink-4" />}
                </span>
              ))}
            </div>
          ))}
          <button role="menuitem" onClick={out} className={`${row} text-ink transition-colors hover:bg-surface`}>
            <LogOut size={18} /> Sign out
          </button>
          <div className="mt-1 flex items-center justify-between border-t border-line px-2.5 pt-2 pb-1 text-xs text-ink-3">
            <span>Dashboard</span><Badge className="bg-surface-2">v1.0</Badge>
          </div>
        </div>
      )}
    </div>
  );
}
