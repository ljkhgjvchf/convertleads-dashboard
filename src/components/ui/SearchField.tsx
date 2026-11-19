import { Search } from "lucide-react";

export function SearchField({ value, onChange, placeholder = "Search" }: { value?: string; onChange?: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex items-center gap-2 rounded-[10px] border border-line-strong bg-panel px-3 py-2 text-sm transition-colors focus-within:border-ink-4">
      <Search size={16} className="shrink-0 text-ink-3" />
      <input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} aria-label={placeholder}
        className="w-32 bg-transparent outline-none placeholder:text-ink-3" />
    </label>
  );
}
