"use client";

import { Bell, Home, ListFilter, Plus, type LucideIcon } from "lucide-react";
import { useProfile } from "@/components/shell/profile";
import { Button, IconButton, stagger } from "@/components/ui";

/** Breadcrumb + page title (20/500) + notifications, Filters and the page's primary action. */
export function PageHeader({ icon: Icon = Home, title, crumb, action }: { icon?: LucideIcon; title: string; crumb: string; action: string }) {
  const [profile] = useProfile();
  return (
    <>
      <div className="reveal flex items-center gap-2 text-sm text-ink-2">
        <span>Workspace</span><span className="text-ink-4">›</span><span>{profile.first || "You"}</span><span className="text-ink-4">›</span>
        <span className="flex items-center gap-1 text-ink"><Icon size={14} /> {crumb}</span>
      </div>
      <header className="reveal mt-3 flex flex-wrap items-center gap-2" style={stagger(1)}>
        <h1 className="text-xl font-medium">{title}</h1>
        <IconButton aria-label="Notifications" className="relative ml-auto size-9 text-ink">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-danger text-xs leading-none text-white ring-2 ring-bg">5</span>
        </IconButton>
        <Button><ListFilter size={16} /> Filters</Button>
        <Button variant="primary"><Plus size={16} /> {action}</Button>
      </header>
    </>
  );
}
