import type { CSSProperties, ReactNode } from "react";

/** Stagger index for the .reveal entry animation. */
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

/** Grey rounded card. `i` = position in the page's entry stagger. */
export function Card({ i = 0, className = "", children }: { i?: number; className?: string; children: ReactNode }) {
  return <section className={`reveal min-w-0 rounded-2xl bg-surface ${className}`} style={stagger(i)}>{children}</section>;
}

/** White (dark: raised) tile that sits inside a Card. */
export function Tile({ className = "", children, style }: { className?: string; children: ReactNode; style?: CSSProperties }) {
  return <div className={`rounded-[10px] bg-panel shadow-card ${className}`} style={style}>{children}</div>;
}

export const tileClass = "rounded-[10px] bg-panel shadow-card";
