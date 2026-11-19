"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button, Chip, Picker, Switch } from "@/components/ui";
import { useStored } from "@/lib/useStored";
import { Group, GroupTitle, Row } from "./parts";

type General = { provider: string; dest: string; cap: number; critical: boolean; system: boolean; sound: boolean; dispatch: boolean };
const DEFAULTS: General = { provider: "GitHub", dest: "Inside the app", cap: 70, critical: true, system: false, sound: true, dispatch: false };

const NOTIFS: [keyof General, string, string][] = [
  ["critical", "Critical requests", "Get notified when an agent needs you to make a critical decision"],
  ["system", "System notifications", "Show a notification when an agent completes a task"],
  ["sound", "Completion sound", "Play a sound when a task is completed"],
  ["dispatch", "Dispatch alerts", "Push a notification to your phone when the workspace messages you"],
];

export function GeneralSection() {
  const [s, set] = useStored<General>("settings.general", DEFAULTS);
  const [limits, setLimits] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const patch = (p: Partial<General>) => set((prev) => ({ ...prev, ...p }));

  return (
    <>
      <div className="rounded-2xl bg-surface p-3">
        <Chip>Current plan</Chip>
        <p className="mt-2 font-medium">Pro $49/mo</p>
        <p className="text-sm text-ink-2">You are on 5x more usage than Starter.</p>
        <Button className="mt-3" disabled={upgraded} onClick={() => setUpgraded(true)}>
          {upgraded ? <><Check size={16} /> Upgrade requested</> : "Upgrade to Team"}
        </Button>
      </div>

      <div className="mt-4 rounded-2xl bg-surface">
        <Row title="Limits" desc={`Monthly usage cap: ${s.cap}% of your plan`}>
          <Button aria-expanded={limits} onClick={() => setLimits((o) => !o)}>{limits ? "Done" : "Manage limits"}</Button>
        </Row>
        <div className="grid transition-[grid-template-rows] duration-300 ease-out-quint" style={{ gridTemplateRows: limits ? "1fr" : "0fr" }}>
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-line px-3 py-3">
              <input type="range" min={10} max={100} step={5} value={s.cap} onChange={(e) => patch({ cap: +e.target.value })}
                aria-label="Monthly usage cap" className="w-full accent-brand" />
              <div className="mt-1 flex justify-between text-xs text-ink-3"><span>10%</span><span>100%</span></div>
            </div>
          </div>
        </div>
      </div>

      <GroupTitle title="Pull requests" />
      <Group>
        <Row title="Review provider" desc="Pick GitHub or another provider for reviews">
          <Picker label="Review provider" value={s.provider} onChange={(v) => patch({ provider: v })} options={["GitHub", "GitLab", "Bitbucket"]} />
        </Row>
        <Row title="PR destination" desc="Where pull request links open">
          <Picker label="PR destination" value={s.dest} onChange={(v) => patch({ dest: v })} options={["Inside the app", "In the browser"]} />
        </Row>
      </Group>

      <GroupTitle title="Notifications" />
      <Group>
        {NOTIFS.map(([k, title, desc]) => (
          <Row key={k} title={title} desc={desc}>
            <Switch label={title} checked={Boolean(s[k])} onChange={(v) => patch({ [k]: v } as Partial<General>)} />
          </Row>
        ))}
      </Group>
    </>
  );
}
