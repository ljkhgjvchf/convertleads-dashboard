"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  Calendar, ChevronsUpDown, Columns3, Home, ImagePlus, Landmark, LifeBuoy, Lock, Megaphone, MessageCircle,
  PanelLeftClose, PanelLeftOpen, Search, Settings, Sparkles, User, type LucideIcon,
} from "lucide-react";
import { Avatar, Badge, useIndicator } from "@/components/ui";
import { useStored } from "@/lib/useStored";
import { AccountMenu } from "./AccountMenu";
import { fullName, useProfile } from "./profile";
import { ThemeToggle } from "./ThemeToggle";

export type NavItem = { label: string; icon: LucideIcon; href?: string; count?: number };

/** Items without an href render locked. */
export const NAV: NavItem[] = [
  { label: "Home", icon: Home, href: "/", count: 152 },
  { label: "Project board", icon: Columns3 },
  { label: "Marketing", icon: Megaphone, href: "/marketing" },
  { label: "Calendar", icon: Calendar },
  { label: "Finance", icon: Landmark },
  { label: "Reports", icon: Sparkles },
  { label: "AI Chat", icon: MessageCircle },
  { label: "AI Images", icon: ImagePlus },
  { label: "Profile", icon: User },
];
const SUPPORT: NavItem = { label: "Support", icon: LifeBuoy };

/** Text that fades and folds away when the sidebar collapses. */
const Label = ({ on, children, className = "" }: { on: boolean; children: React.ReactNode; className?: string }) => (
  <span className={`inline-block min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-out-quint ${on ? "max-w-[180px] opacity-100" : "max-w-0 opacity-0"} ${className}`}>{children}</span>
);

export function Sidebar({ path, onSettings, onAccount }: { path: string; onSettings: () => void; onAccount: (s: "profile" | "general") => void }) {
  const [collapsed, setCollapsed] = useStored("sidebar.collapsed", false);
  const open = !collapsed;
  const active = Math.max(0, NAV.findIndex((n) => n.href === path));
  const { ref, box } = useIndicator(active, collapsed);
  const [shake, setShake] = useState(-1);
  const [profile] = useProfile();
  const search = useRef<HTMLInputElement>(null);

  const itemCls = `relative flex items-center rounded-xl py-2 text-sm font-medium transition-[colors,padding,gap] duration-300 ${open ? "gap-2.5 px-3" : "justify-center gap-0 px-0"}`;
  const tip = (label: string) => (open ? undefined : label);

  const locked = (item: NavItem, i: number, setRef?: (el: HTMLElement | null) => void) => {
    const Icon = item.icon;
    return (
      <span key={item.label} ref={setRef} role="link" aria-disabled aria-label={item.label} title={open ? "Locked" : `${item.label} (locked)`}
        onClick={() => setShake(i)} onAnimationEnd={() => setShake(-1)}
        className={`${itemCls} cursor-not-allowed text-ink-3 ${shake === i ? "shake" : ""}`}>
        <Icon size={18} className="shrink-0" /> <Label on={open}>{item.label}</Label>
        {open && <Lock size={13} className="ml-auto shrink-0 text-ink-4" />}
      </span>
    );
  };

  const expandAndSearch = () => { setCollapsed(false); setTimeout(() => search.current?.focus(), 320); };

  return (
    <aside className={`sticky top-3 z-30 hidden h-[calc(100vh-24px)] shrink-0 flex-col rounded-3xl border border-edge bg-surface p-3 shadow-sidebar transition-[width] duration-300 ease-out-quint lg:flex ${open ? "w-[260px]" : "w-[72px]"}`}>
      <div className={`flex items-center gap-2 ${open ? "px-1" : "flex-col"}`}>
        <Avatar name={fullName(profile)} src={profile.photo} size={32} />
        <Label on={open} className="text-sm font-medium">{fullName(profile)}</Label>
        {open && <ChevronsUpDown size={14} className="shrink-0 text-ink-3" />}
        <button onClick={() => setCollapsed(open)} aria-label={open ? "Collapse sidebar" : "Expand sidebar"} title={open ? "Collapse sidebar" : "Expand sidebar"}
          className={`grid size-8 shrink-0 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink ${open ? "ml-auto" : ""}`}>
          {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      {open ? (
        <label className="mt-4 flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-sm text-ink-2 transition-shadow focus-within:bg-panel focus-within:shadow-card">
          <Search size={16} className="shrink-0" />
          <input ref={search} placeholder="Quick Search" className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-ink-2" />
          <Badge className="bg-ink-4/60">⌘K</Badge>
        </label>
      ) : (
        <button onClick={expandAndSearch} aria-label="Quick search" title="Quick search"
          className="mt-4 grid h-9 place-items-center rounded-xl bg-surface-2 text-ink-2 transition-colors hover:text-ink"><Search size={16} /></button>
      )}

      <nav className="relative mt-3 flex flex-col gap-1">
        <span aria-hidden className="absolute rounded-xl bg-gradient-to-b from-accent to-accent-dark shadow-[0_2px_6px_#fa5d2940,inset_0_1px_0_#ffffff33] transition-all duration-300 ease-out-quint" style={box} />
        {NAV.map((item, i) => {
          if (!item.href) return locked(item, i, ref(i));
          const on = i === active, Icon = item.icon;
          return (
            <Link key={item.label} ref={ref(i)} href={item.href} aria-current={on ? "page" : undefined} aria-label={tip(item.label)} title={tip(item.label)}
              className={`${itemCls} ${on ? "text-white" : "text-ink-2 hover:bg-surface-2 hover:text-ink"}`}>
              <Icon size={18} className="shrink-0" /> <Label on={open}>{item.label}</Label>
              {item.count && open && <Badge className={`ml-auto transition-colors duration-300 ${on ? "bg-white/20" : "bg-surface-2 text-ink-2"}`}>{item.count}</Badge>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <div className={`mb-2 ${open ? "px-1" : "flex justify-center"}`}><ThemeToggle compact={!open} /></div>
        {locked(SUPPORT, 100)}
        <button onClick={onSettings} aria-label={tip("Settings")} title={tip("Settings")} className={`${itemCls} text-ink-2 hover:bg-surface-2 hover:text-ink`}>
          <Settings size={18} className="shrink-0" /> <Label on={open}>Settings</Label>
        </button>
        <div className="mt-2"><AccountMenu onOpen={onAccount} compact={!open} /></div>
      </div>
    </aside>
  );
}
