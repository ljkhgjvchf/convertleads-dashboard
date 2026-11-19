"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Lock, LogOut, Mail } from "lucide-react";
import { Button, Switch } from "@/components/ui";
import { signOut } from "@/components/shell/auth";
import { useProfile, type Profile } from "@/components/shell/profile";
import { Group, Row, fieldCls } from "./parts";

const DEVICE_ID = "593e2611-b9e3-44e2-8a1f-ab3f9d21c07e";
const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Edits save automatically and update the sidebar + account menu. */
export function ProfileSection({ onClose }: { onClose: () => void }) {
  const [p, setP] = useProfile();
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => { const v = e.target.value; setP((prev) => ({ ...prev, [k]: v })); };
  const bad = (v: boolean) => (v ? "" : "ring-2 ring-danger/60");

  const copy = async () => {
    try { await navigator.clipboard.writeText(DEVICE_ID); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  const logoutAll = () => { signOut(); onClose(); router.push("/login"); };

  return (
    <>
      <Group>
        <Row title="Email" desc={!validEmail(p.email) ? <span className="text-danger">Enter a valid email</span> : undefined}>
          <label className={`relative flex w-full items-center sm:w-56 ${bad(validEmail(p.email))} rounded-[10px]`}>
            <Mail size={16} className="pointer-events-none absolute left-3 text-ink-3" />
            <input type="email" aria-label="Email" value={p.email} onChange={set("email")} className={`${fieldCls} pl-9`} />
          </label>
        </Row>
        <Row title="First name" desc={!p.first.trim() ? <span className="text-danger">Required</span> : undefined}>
          <input aria-label="First name" value={p.first} onChange={set("first")} className={`${fieldCls} ${bad(!!p.first.trim())}`} />
        </Row>
        <Row title="Last name">
          <input aria-label="Last name" value={p.last} onChange={set("last")} className={fieldCls} />
        </Row>
        <Row title="Date of birth">
          <input type="date" aria-label="Date of birth" value={p.dob} onChange={set("dob")}
            className="w-full rounded-[10px] border border-line-strong bg-panel px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand/40 sm:w-56" />
        </Row>
      </Group>

      <Group className="mt-4">
        <Row title="Workspace account">
          <Button disabled title="Locked"><Lock size={14} /> Manage</Button>
        </Row>
        <Row title="Public profile" desc="When on, your profile page is visible to anyone">
          <Switch label="Public profile" checked={p.isPublic} onChange={(v) => setP((prev) => ({ ...prev, isPublic: v }))} />
        </Row>
        <Row title="Device ID">
          <span className="flex w-full items-center gap-2 sm:w-56">
            <code className="min-w-0 flex-1 truncate rounded-[10px] bg-surface-2 px-3 py-1.5 text-xs text-ink-2">{DEVICE_ID}</code>
            <Button variant="icon" aria-label="Copy device ID" onClick={copy}>{copied ? <Check size={15} className="text-green" /> : <Copy size={15} />}</Button>
          </span>
        </Row>
        <Row title="Log out from all devices">
          <Button onClick={logoutAll}><LogOut size={16} /> Log out</Button>
        </Row>
      </Group>
      <p className="mt-3 px-3 text-xs text-ink-3">Changes save automatically in this browser.</p>
    </>
  );
}
