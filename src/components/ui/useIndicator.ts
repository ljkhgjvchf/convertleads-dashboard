"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

/** Measures the selected child so a highlight can slide under it. Change `key` to force a re-measure (e.g. when a modal opens). */
export function useIndicator(sel: number, key?: unknown) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [box, setBox] = useState<CSSProperties>({ opacity: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[sel];
      if (el) setBox({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight, opacity: 1 });
      else setBox({ opacity: 0 });
    };
    measure();
    const ro = new ResizeObserver(measure); // re-measure once fonts load or the layout reflows
    refs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [sel, key]);
  return { ref: (i: number) => (el: HTMLElement | null) => { refs.current[i] = el; }, box };
}
