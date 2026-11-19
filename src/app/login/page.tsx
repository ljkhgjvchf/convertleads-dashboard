"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/shell/AccountMenu";
import { signIn } from "@/components/shell/auth";
import { DEFAULT_PROFILE, WORKSPACE } from "@/components/shell/profile";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { Button } from "@/components/ui";

const input = "w-full rounded-[10px] border border-line-strong bg-panel px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink-3 focus:border-brand";

/** Demo sign-in screen: any email + password works (see components/shell/auth.ts). */
export default function Login() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => { signIn(); router.push("/"); }, 600);
  };

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <form onSubmit={submit} className="reveal w-full max-w-sm rounded-3xl border border-edge bg-surface p-6 shadow-sidebar">
        <BrandLogo size={40} />
        <h1 className="mt-4 text-xl font-medium">Sign in</h1>
        <p className="mt-1 text-sm text-ink-2">{`Welcome back to ${WORKSPACE.name}.`}</p>

        <label className="mt-6 block text-sm font-medium">Email
          <input type="email" required defaultValue={DEFAULT_PROFILE.email} autoComplete="email" className={`${input} mt-1.5 font-normal`} />
        </label>
        <label className="mt-3 block text-sm font-medium">Password
          <input type="password" required minLength={4} placeholder="••••••••" autoComplete="current-password" className={`${input} mt-1.5 font-normal`} />
        </label>

        <Button type="submit" variant="primary" disabled={busy} className="mt-6 w-full justify-center">
          {busy && <Loader2 size={16} className="animate-spin" />} {busy ? "Signing in…" : "Sign in"}
        </Button>
        <p className="mt-4 text-center text-xs text-ink-3">Demo: any email and password (4+ characters) work.</p>
      </form>
    </div>
  );
}
