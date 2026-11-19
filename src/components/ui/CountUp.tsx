"use client";

import { useEffect, useRef, useState } from "react";

const parse = (value: string) => value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);

/**
 * Animates the number inside a formatted string ("$7,462", "1.94M", "46%").
 * First render counts up from 0; later changes tween from the current number.
 */
export function CountUp({ value, ms = 1000 }: { value: string; ms?: number }) {
  const m = parse(value);
  const target = m ? parseFloat(m[2].replace(/,/g, "")) : 0;
  const [n, setN] = useState(0);
  const cur = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    const from = cur.current;
    const dur = first.current ? ms : 420;
    first.current = false;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { cur.current = target; setN(target); return; }
    let raf = 0, t0 = 0;
    const step = (t: number) => {
      t0 ||= t;
      const p = Math.min((t - t0) / dur, 1);
      cur.current = from + (target - from) * (1 - Math.pow(1 - p, 4));
      setN(cur.current);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  if (!m) return <>{value}</>;
  const dec = (m[2].split(".")[1] ?? "").length;
  const txt = n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: m[2].includes(",") || target >= 1000 });
  return <span className="tabular-nums">{m[1]}{txt}{m[3]}</span>;
}
