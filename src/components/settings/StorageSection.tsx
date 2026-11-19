"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { ArrowDown, ArrowUp, ChevronDown, CloudUpload, FileText, Film, Image as ImageIcon, MoreVertical, Sheet, Trash2, X, type LucideIcon } from "lucide-react";
import { Chip, IconButton, Pagination, Picker, SearchField } from "@/components/ui";
import { OTHER_FILES, files as FILES, type FileKind, type StoredFile } from "@/data/settings";

const MAX = 8 * 1024 * 1024;
const EXT: Record<string, FileKind> = { pdf: "Documents", jpg: "Images", jpeg: "Images", png: "Images", xlsx: "Spreadsheets" };
const KIND: Record<FileKind, { icon: LucideIcon; cls: string }> = {
  Documents: { icon: FileText, cls: "bg-chip-red text-chip-red-fg" },
  Spreadsheets: { icon: Sheet, cls: "bg-chip-blue text-chip-blue-fg" },
  Videos: { icon: Film, cls: "bg-chip-violet text-chip-violet-fg" },
  Images: { icon: ImageIcon, cls: "bg-chip-lime text-chip-lime-fg" },
};

export const fileSize = (b: number) => (b >= 1e6 ? `${+(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);
const fmtDate = (d: string) => new Date(d + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

type Upload = { id: string; name: string; pct: number; error?: string };
type SortKey = "name" | "date" | "size";

/** Drag-and-drop upload (simulated, nothing leaves the browser) + file table. */
export function StorageSection() {
  const [rows, setRows] = useState<StoredFile[]>(FILES);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [drag, setDrag] = useState(false);
  const [kind, setKind] = useState("All types");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: SortKey; dir: 1 | -1 }>({ k: "date", dir: -1 });
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const input = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearInterval), []);

  const patchUpload = (id: string, p: Partial<Upload>) => setUploads((u) => u.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const dismiss = (id: string) => setUploads((u) => u.filter((x) => x.id !== id));

  const handle = (list: FileList | null) => {
    if (!list) return;
    [...list].forEach((f, n) => {
      const id = `${Date.now()}-${n}-${f.name}`;
      const kindOf = EXT[f.name.split(".").pop()?.toLowerCase() ?? ""];
      const error = !kindOf ? "Unsupported file type" : f.size > MAX ? "File is over 8 MB" : undefined;
      setUploads((u) => [...u, { id, name: f.name, pct: 0, error }]);
      if (error) return;
      let pct = 0;
      const t = window.setInterval(() => {
        pct = Math.min(100, pct + 9 + Math.random() * 14);
        patchUpload(id, { pct });
        if (pct < 100) return;
        clearInterval(t);
        setRows((r) => [{ id: Date.now() + n, name: f.name.replace(/\.[^.]+$/, ""), kind: kindOf, date: new Date().toISOString().slice(0, 10), size: f.size }, ...r]);
        timers.current.push(window.setTimeout(() => dismiss(id), 1800));
      }, 110);
      timers.current.push(t);
    });
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files); };

  const shown = useMemo(() => rows
    .filter((r) => (kind === "All types" || r.kind === kind) && r.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : a[sort.k] < b[sort.k] ? -1 : 0) * sort.dir), [rows, kind, q, sort]);

  const allOn = shown.length > 0 && shown.every((r) => picked.has(r.id));
  const toggle = (id: number) => setPicked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const remove = (ids: number[]) => { setRows((r) => r.filter((x) => !ids.includes(x.id))); setPicked(new Set()); };
  const sortBy = (k: SortKey) => setSort((s) => ({ k, dir: s.k === k ? (-s.dir as 1 | -1) : 1 }));
  const th = (k: SortKey, label: string) => (
    <button onClick={() => sortBy(k)} className={`flex items-center gap-1 font-medium transition-colors hover:text-ink ${sort.k === k ? "text-ink" : ""}`}>
      {label}{sort.k === k ? (sort.dir === 1 ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ChevronDown size={14} className="opacity-50" />}
    </button>
  );
  const td = "border-b border-line px-3 py-2.5";

  return (
    <>
      <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed border-line-strong px-6 py-8 text-center transition-colors ${drag ? "!border-brand bg-brand-soft/40" : ""}`}>
        <span className={`mx-auto grid size-10 place-items-center rounded-full bg-surface-2 text-ink-2 transition-transform ${drag ? "scale-110" : ""}`}><CloudUpload size={20} /></span>
        <p className="mt-3 text-sm text-ink-2">Drag and drop to upload or <button onClick={() => input.current?.click()} className="font-medium text-brand hover:underline">select</button></p>
        <p className="mt-1 text-xs text-ink-3">PDF, JPG, PNG, XLSX (max 8 MB)</p>
        <input ref={input} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.xlsx" className="hidden" onChange={(e) => { handle(e.target.files); e.target.value = ""; }} />
      </div>

      {uploads.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {uploads.map((u) => (
            <li key={u.id} className="label-in rounded-xl bg-surface px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 truncate font-medium">{u.name}</span>
                <span className={`shrink-0 ${u.error ? "text-danger" : u.pct >= 100 ? "text-green" : "text-ink-2"}`}>
                  {u.error ?? (u.pct >= 100 ? "Uploaded successfully!" : `Uploading… ${Math.round(u.pct)}%`)}
                </span>
                {(u.error || u.pct >= 100) && <button aria-label="Dismiss" onClick={() => dismiss(u.id)} className="text-ink-3 hover:text-ink"><X size={14} /></button>}
              </div>
              {!u.error && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div className={`h-full rounded-full transition-[width] duration-150 ${u.pct >= 100 ? "bg-green" : "bg-brand"}`} style={{ width: `${u.pct}%` }} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-2xl border border-line">
        <div className="flex flex-wrap items-center gap-2 p-3">
          {picked.size > 0 ? (
            <div className="label-in flex items-center gap-3">
              <p className="text-sm font-medium">{picked.size} selected</p>
              <button onClick={() => remove([...picked])} className="flex items-center gap-1.5 rounded-lg bg-chip-red px-2.5 py-1.5 text-sm font-medium text-chip-red-fg transition-transform active:scale-[0.97]"><Trash2 size={14} /> Delete</button>
            </div>
          ) : (
            <div><p className="text-sm text-ink-2">Stored in</p><p className="text-sm font-medium tabular-nums">{(OTHER_FILES + rows.length).toLocaleString()} files</p></div>
          )}
          <div className="ml-auto flex flex-wrap gap-2">
            <Picker label="File type" value={kind} onChange={setKind} options={["All types", "Documents", "Spreadsheets", "Videos", "Images"]} />
            <Picker label="Order" value={sort.k === "date" && sort.dir === 1 ? "Oldest first" : "Newest first"}
              onChange={(v) => setSort({ k: "date", dir: v === "Oldest first" ? 1 : -1 })} options={["Newest first", "Oldest first"]} />
            <SearchField value={q} onChange={setQ} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-surface text-left text-ink-3">
              <tr>
                <th className="border-y border-line px-3 py-2.5 font-medium"><span className="flex items-center gap-3">
                  <input type="checkbox" checked={allOn} onChange={() => setPicked(allOn ? new Set() : new Set(shown.map((r) => r.id)))} aria-label="Select all files" className="size-4 accent-brand" />
                  {th("name", "File name")}</span></th>
                <th className="border-y border-line px-3 font-medium">{th("date", "Uploaded on")}</th>
                <th className="border-y border-line px-3 font-medium">{th("size", "File size")}</th>
                <th className="border-y border-line px-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const { icon: Icon, cls } = KIND[r.kind];
                return (
                  <tr key={r.id} className={`label-in transition-colors ${picked.has(r.id) ? "bg-brand-soft/40" : "hover:bg-surface"}`}>
                    <td className={td}><span className="flex items-center gap-3">
                      <input type="checkbox" checked={picked.has(r.id)} onChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} className="size-4 accent-brand" />
                      <span className={`grid size-7 shrink-0 place-items-center rounded-md ${cls}`} title={r.kind}><Icon size={15} /></span>
                      <span className="truncate font-medium">{r.name}</span>
                    </span></td>
                    <td className={`${td} tabular-nums`}>{fmtDate(r.date)}</td>
                    <td className={td}><Chip>{fileSize(r.size)}</Chip></td>
                    <td className={td}><span className="flex justify-end gap-1.5">
                      <IconButton aria-label={`Delete ${r.name}`} onClick={() => remove([r.id])} className="hover:border-chip-red hover:bg-chip-red hover:text-chip-red-fg"><Trash2 size={15} /></IconButton>
                      <IconButton aria-label="More"><MoreVertical size={15} /></IconButton>
                    </span></td>
                  </tr>
                );
              })}
              {shown.length === 0 && <tr><td colSpan={4} className="label-in py-10 text-center text-ink-2">No files match.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-3 pb-3"><Pagination last={211} /></div>
      </div>
    </>
  );
}
