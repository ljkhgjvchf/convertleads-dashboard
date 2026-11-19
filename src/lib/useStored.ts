"use client";

import { useCallback, useEffect, useState } from "react";

/*
  useState that persists to localStorage and stays in sync across every
  component using the same key. Per-browser only (demo settings), not shared.
*/
const subs = new Map<string, Set<(v: unknown) => void>>();

const read = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw === null ? fallback : (JSON.parse(raw) as T); } catch { return fallback; }
};

export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    setValue(read(key, initial));
    const set = subs.get(key) ?? new Set();
    const fn = (v: unknown) => setValue(v as T);
    set.add(fn); subs.set(key, set);
    return () => { set.delete(fn); };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback((next: T | ((prev: T) => T)) => {
    const v = typeof next === "function" ? (next as (p: T) => T)(read(key, initial)) : next;
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
    subs.get(key)?.forEach((fn) => fn(v));
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return [value, update] as const;
}
