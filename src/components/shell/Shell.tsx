"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Settings } from "lucide-react";
import { IconButton } from "@/components/ui";
import { SettingsModal, type SectionId } from "@/components/settings/SettingsModal";
import { isSignedOut } from "./auth";
import { NAV, Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

/** App frame: sidebar on desktop, tab bar on phones, Settings modal. /login renders bare. */
export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [settings, setSettings] = useState<SectionId | null>(null);
  const close = useCallback(() => setSettings(null), []);
  useEffect(() => { if (path !== "/login" && isSignedOut()) router.replace("/login"); }, [path, router]);

  if (path === "/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen gap-3 p-3">
      <Sidebar path={path} onSettings={() => setSettings("general")} onAccount={setSettings} />
      <main className="min-w-0 flex-1 px-1 pt-3">
        <nav className="mb-4 flex items-center gap-2 lg:hidden">
          <div className="flex flex-1 gap-1 rounded-xl bg-surface p-1">
            {NAV.filter((n) => n.href).map(({ label, icon: Icon, href }) => (
              <Link key={label} href={href!} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${path === href ? "bg-panel text-ink shadow-card" : "text-ink-2"}`}>
                <Icon size={16} /> {label}
              </Link>
            ))}
          </div>
          <IconButton aria-label="Settings" onClick={() => setSettings("general")} className="size-9"><Settings size={16} /></IconButton>
          <ThemeToggle />
        </nav>
        {children}
      </main>
      <SettingsModal section={settings} onSection={setSettings} onClose={close} />
    </div>
  );
}
