"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useIndicator } from "@/components/ui";

type Theme = "light" | "dark";

export function setTheme(t: Theme) {
  const apply = () => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch {}
  };
  // crossfade the whole page where supported
  if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(apply);
  else apply();
}

/** Sun / moon pill, like the reference sidebar. `compact` = one button that flips the theme. */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setT] = useState<Theme>("light");
  useEffect(() => { setT(document.documentElement.dataset.theme === "dark" ? "dark" : "light"); }, []);
  const { ref, box } = useIndicator(theme === "light" ? 0 : 1, compact);
  const pick = (t: Theme) => { setT(t); setTheme(t); };

  if (compact) {
    const next: Theme = theme === "light" ? "dark" : "light";
    const Icon = theme === "light" ? Sun : Moon;
    return (
      <button onClick={() => pick(next)} aria-label={`Use ${next} mode`} title={`Use ${next} mode`}
        className="grid size-9 place-items-center rounded-full bg-surface-2 text-ink transition-colors hover:bg-ink-4/50">
        <Icon key={theme} size={16} className="label-in" />
      </button>
    );
  }

  return (
    <div role="radiogroup" aria-label="Theme" className="relative flex w-fit rounded-full bg-surface-2 p-1">
      <span aria-hidden className="absolute rounded-full bg-panel shadow-card transition-all duration-300 ease-out-quint" style={box} />
      {([["light", Sun, "Use light mode"], ["dark", Moon, "Use dark mode"]] as const).map(([t, Icon, label], i) => (
        <button key={t} ref={ref(i)} role="radio" aria-checked={theme === t} aria-label={label} onClick={() => pick(t)}
          className={`relative grid size-7 place-items-center rounded-full transition-colors ${theme === t ? "text-ink" : "text-ink-3 hover:text-ink"}`}>
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
