"use client";

import { Fragment, useState } from "react";
import {
  AppWindow, BookOpen, Database, GitBranch, Hexagon, Landmark, Lock, Palette, Plug, Receipt, Terminal, Workflow, Wrench, X,
  type LucideIcon,
} from "lucide-react";
import { IconButton, Modal, useIndicator } from "@/components/ui";
import { GeneralSection } from "./GeneralSection";
import { ProfileSection } from "./ProfileSection";
import { StorageSection } from "./StorageSection";
import { ToolsSection } from "./ToolsSection";

export type SectionId = "general" | "profile" | "tools" | "storage";
type Item = { label: string; icon: LucideIcon; id?: SectionId };

/** Items without an id render locked (same as the sidebar). */
const NAV: { title: string; items: Item[] }[] = [
  { title: "Settings", items: [
    { label: "General", icon: AppWindow, id: "general" }, { label: "Profile", icon: Landmark, id: "profile" },
    { label: "Appearance", icon: Palette }, { label: "Billing", icon: Receipt }, { label: "Rules and workflows", icon: Workflow },
    { label: "Tools", icon: Wrench, id: "tools" }, { label: "Storage", icon: Database, id: "storage" },
  ] },
  { title: "Desktop app", items: [{ label: "General", icon: Hexagon }, { label: "Plugins", icon: Plug }, { label: "Developer", icon: Terminal }] },
  { title: "Customize", items: [{ label: "Skills", icon: BookOpen }, { label: "Git", icon: GitBranch }] },
];
const FLAT = NAV.flatMap((g) => g.items);
const TITLES: Record<SectionId, string> = { general: "General", profile: "Profile", tools: "Tools", storage: "Storage" };

export function SettingsModal({ section, onSection, onClose }: { section: SectionId | null; onSection: (s: SectionId) => void; onClose: () => void }) {
  const [last, setLast] = useState<SectionId>("general");
  const current = section ?? last; // keep content during the close animation
  if (section && section !== last) setLast(section);
  const { ref, box } = useIndicator(FLAT.findIndex((i) => i.id === current), section !== null);
  const [shake, setShake] = useState(-1);
  const item = "relative flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors";
  let n = -1;

  return (
    <Modal open={section !== null} onClose={onClose} label="Settings"
      className="flex h-[min(640px,calc(100dvh-24px))] w-[min(880px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl bg-dialog shadow-menu md:flex-row">
      <nav aria-label="Settings sections" className="relative flex shrink-0 gap-1 overflow-x-auto bg-surface p-2 md:w-60 md:flex-col md:overflow-y-auto">
        <span aria-hidden className="absolute rounded-xl bg-surface-2 transition-all duration-300 ease-out-quint" style={box} />
        {NAV.map((g) => (
          <Fragment key={g.title}>
            <p className="hidden px-3 pt-3 pb-1 text-sm text-ink-3 first:pt-1 md:block">{g.title}</p>
            {g.items.map((it) => {
              const i = ++n, Icon = it.icon;
              return it.id ? (
                <button key={it.label + i} ref={ref(i)} onClick={() => onSection(it.id!)} aria-current={current === it.id ? "page" : undefined}
                  className={`${item} ${current === it.id ? "text-ink" : "text-ink-2 hover:text-ink"}`}>
                  <Icon size={18} /> {it.label}
                </button>
              ) : (
                <span key={it.label + i} ref={ref(i)} role="button" aria-disabled title="Locked" onClick={() => setShake(i)} onAnimationEnd={() => setShake(-1)}
                  className={`${item} cursor-not-allowed text-ink-3 ${shake === i ? "shake" : ""}`}>
                  <Icon size={18} /> {it.label} <Lock size={13} className="ml-auto text-ink-4" />
                </span>
              );
            })}
          </Fragment>
        ))}
      </nav>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 px-5 pt-5 md:px-8 md:pt-7">
          <h2 key={current} className="label-in text-xl font-medium">{TITLES[current]}</h2>
          <IconButton aria-label="Close settings" onClick={onClose} className="rounded-full"><X size={16} /></IconButton>
        </header>
        <div key={current} className="label-in min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-6 md:px-8">
          {current === "general" && <GeneralSection />}
          {current === "profile" && <ProfileSection onClose={onClose} />}
          {current === "tools" && <ToolsSection />}
          {current === "storage" && <StorageSection />}
        </div>
      </div>
    </Modal>
  );
}
