"use client";

import { useState, type FormEvent } from "react";
import { ChevronsUpDown, Lock, Plus, Trash2 } from "lucide-react";
import { Button, IconButton, Segmented, Switch } from "@/components/ui";
import { WORKSPACES, homeServers, pluginServers, type McpServer } from "@/data/settings";
import { useStored } from "@/lib/useStored";
import { Group, GroupTitle, Row, fieldCls } from "./parts";

const DOT = { ok: "bg-green", error: "bg-danger", off: "bg-ink-4" } as const;

function ServerRow({ s, onChange, onRemove }: { s: McpServer; onChange: (s: McpServer) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const expandable = s.status === "error" || (s.status === "ok" && s.tools.length > 0);
  const toggleConn = () => { setOpen(false); onChange({ ...s, status: s.status === "off" ? "ok" : "off", summary: s.summary ?? "Connected · 0 tools enabled" }); };

  return (
    <div className="px-3 py-3">
      <div className="flex items-center gap-3">
        <span className="relative grid size-9 shrink-0 place-items-center rounded-lg text-sm font-semibold"
          style={{ background: `color-mix(in srgb, ${s.color} 18%, transparent)`, color: s.color }}>
          {s.name[0]}
          <span className={`absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full ring-2 ring-surface transition-colors ${DOT[s.status]}`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="truncate">{s.name}</span>
            <button onClick={toggleConn} className="shrink-0 text-sm font-normal text-ink-3 transition-colors hover:text-ink">{s.status === "off" ? "Connect" : "Log out"}</button>
          </p>
          {s.status === "off" ? <p className="text-sm text-ink-3">Disconnected</p> : (
            <button disabled={!expandable} onClick={() => setOpen((o) => !o)} aria-expanded={open}
              className="flex items-center gap-1 text-left text-sm text-ink-2 transition-colors hover:text-ink disabled:hover:text-ink-2">
              {s.status === "error" ? `Error – ${open ? "Hide" : "Show"} output` : s.summary}
              {s.status === "ok" && expandable && <ChevronsUpDown size={14} />}
            </button>
          )}
        </div>
        <IconButton aria-label={`Remove ${s.name}`} onClick={onRemove} className="hover:border-chip-red hover:bg-chip-red hover:text-chip-red-fg"><Trash2 size={15} /></IconButton>
      </div>
      <div className="grid transition-[grid-template-rows] duration-300 ease-out-quint" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="min-h-0 overflow-hidden">
          {s.status === "error"
            ? <pre className="mt-3 ml-12 overflow-x-auto rounded-lg bg-panel p-3 font-mono text-xs text-danger">{s.log}</pre>
            : <div className="mt-3 ml-12 flex flex-wrap gap-1.5">{s.tools.map((t) => <span key={t} className="rounded-md bg-panel px-1.5 py-0.5 font-mono text-xs text-ink-2 shadow-card">{t}</span>)}</div>}
        </div>
      </div>
    </div>
  );
}

const update = (list: McpServer[], s: McpServer) => list.map((x) => (x.id === s.id ? s : x));

export function ToolsSection() {
  const [ws, setWs] = useState(WORKSPACES[0]);
  const [waitAuth, setWaitAuth] = useStored("settings.tools.waitAuth", true);
  const [servers, setServers] = useState(homeServers);
  const [plugins, setPlugins] = useState(pluginServers);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const setWsList = (fn: (l: McpServer[]) => McpServer[]) => setServers((all) => ({ ...all, [ws]: fn(all[ws]) }));
  const add = (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setWsList((l) => [...l, { id: `${n}-${Date.now()}`, name: n, color: "var(--color-brand)", status: "ok", tools: [], summary: "Connected · 0 tools enabled" }]);
    setName(""); setAdding(false);
  };

  return (
    <>
      <Segmented variant="soft" options={WORKSPACES} value={ws} onChange={(v) => { setWs(v); setAdding(false); }} />

      <GroupTitle title="Authentication" />
      <Group>
        <Row title="Wait for MCP authentication" desc="Wait as long as needed when asked to sign in. When off, sign-in prompts are skipped after 30 seconds.">
          <Switch label="Wait for MCP authentication" checked={waitAuth} onChange={setWaitAuth} />
        </Row>
      </Group>

      <GroupTitle title={`${ws} MCP servers`} desc={`Servers available from ${ws}.`} />
      <Group key={ws} className="label-in">
        {servers[ws].map((s) => (
          <ServerRow key={s.id} s={s} onChange={(n) => setWsList((l) => update(l, n))} onRemove={() => setWsList((l) => l.filter((x) => x.id !== s.id))} />
        ))}
        {adding ? (
          <form onSubmit={add} className="label-in flex flex-wrap items-center gap-2 px-3 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-ink-2"><Plus size={16} /></span>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Server name" aria-label="Server name" className={`${fieldCls} flex-1`} />
            <Button type="submit" variant="primary" disabled={!name.trim()}>Add</Button>
            <Button onClick={() => { setAdding(false); setName(""); }}>Cancel</Button>
          </form>
        ) : (
          <button onClick={() => setAdding(true)} className="flex w-full items-center gap-3 rounded-b-2xl px-3 py-3 text-left transition-colors hover:bg-surface-2/60">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-ink-2"><Plus size={16} /></span>
            <span><span className="block text-sm font-medium">New MCP server</span><span className="block text-sm text-ink-2">Add a custom MCP server</span></span>
          </button>
        )}
      </Group>

      <GroupTitle title="Team MCP servers" desc="Configured in the dashboard" right={<Button disabled title="Locked"><Lock size={14} /> Manage</Button>} />
      <Group className="px-6 py-8 text-center">
        <p className="text-sm font-medium">No team MCP servers</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink-2">Configure MCP servers in the dashboard to make them available here, on desktop and in the cloud.</p>
      </Group>

      <GroupTitle title="Plugin MCP servers" />
      <Group>
        {plugins.map((s) => (
          <ServerRow key={s.id} s={s} onChange={(n) => setPlugins((l) => update(l, n))} onRemove={() => setPlugins((l) => l.filter((x) => x.id !== s.id))} />
        ))}
        {plugins.length === 0 && <p className="px-3 py-6 text-center text-sm text-ink-2">No plugin servers.</p>}
      </Group>
    </>
  );
}
