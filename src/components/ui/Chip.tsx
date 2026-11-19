import type { ReactNode } from "react";

export type Tone = "lime" | "red" | "violet" | "blue" | "cyan" | "yellow" | "pink" | "neutral";

const TONES: Record<Tone, string> = {
  lime: "bg-chip-lime text-chip-lime-fg",
  red: "bg-chip-red text-chip-red-fg",
  violet: "bg-chip-violet text-chip-violet-fg",
  blue: "bg-chip-blue text-chip-blue-fg",
  cyan: "bg-chip-cyan text-chip-cyan-fg",
  yellow: "bg-chip-yellow text-chip-yellow-fg",
  pink: "bg-chip-pink text-chip-pink-fg",
  neutral: "bg-chip-neutral text-chip-neutral-fg",
};

export function Chip({ tone = "neutral", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-sm font-medium tabular-nums transition-colors ${TONES[tone]} ${className}`}>{children}</span>;
}

/** "+14.8%" lime, "-2.1%" red, "0.00%" neutral. */
export function Delta({ v }: { v: string }) {
  const tone: Tone = v.startsWith("-") ? "red" : /^[+]?0(\.0+)?%/.test(v) ? "neutral" : "lime";
  return <Chip tone={tone}>{v}</Chip>;
}

/** Small count badge (sidebar counts, kbd hints, pills). */
export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`rounded-md px-1.5 text-xs font-medium tabular-nums ${className}`}>{children}</span>;
}
