import { ChevronDown, type LucideIcon } from "lucide-react";

/** Styled native select. Controlled when `value` is passed. */
export function Picker({ options, value, onChange, icon: Icon, label }: {
  options: string[]; value?: string; onChange?: (v: string) => void; icon?: LucideIcon; label?: string;
}) {
  return (
    <label className="relative flex shrink-0 items-center gap-1.5 rounded-[10px] border border-line-strong bg-panel py-2 pr-8 pl-3 text-sm font-medium transition-colors hover:border-ink-4">
      {Icon && <Icon size={16} className="text-ink-2" />}
      <select aria-label={label} value={value} onChange={(e) => onChange?.(e.target.value)} className="appearance-none bg-transparent outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-2.5 text-ink-2" />
    </label>
  );
}
