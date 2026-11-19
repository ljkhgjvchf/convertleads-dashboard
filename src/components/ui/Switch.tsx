"use client";

/** iOS-style switch; on = brand gradient with a dotted knob, like the reference. */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-gradient-to-b from-brand to-brand-dark" : "bg-surface-2"}`}>
      <span className={`absolute top-0.5 left-0.5 grid size-5 place-items-center rounded-full bg-white shadow-[0_1px_3px_#00000033] transition-transform duration-300 ease-out-quint ${checked ? "translate-x-5" : ""}`}>
        <span className={`size-2 rounded-full bg-brand transition-[opacity,transform] duration-300 ${checked ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />
      </span>
    </button>
  );
}
