import type { ReactNode } from "react";

/** Grey rounded block holding rows separated by hairlines. */
export function Group({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`divide-y divide-line rounded-2xl bg-surface ${className}`}>{children}</div>;
}

/** Title + optional description on the left, control on the right. */
export function Row({ title, desc, children }: { title: ReactNode; desc?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-3 sm:flex-nowrap">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        {desc && <p className="text-sm text-ink-2">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

/** Small grey heading above a group. */
export function GroupTitle({ title, desc, right }: { title: string; desc?: string; right?: ReactNode }) {
  return (
    <div className="mt-6 mb-2 flex items-end gap-2 px-3">
      <div className="flex-1"><p className="text-sm text-ink-2">{title}</p>{desc && <p className="text-sm text-ink-3">{desc}</p>}</div>
      {right}
    </div>
  );
}

export const fieldCls = "w-full rounded-[10px] bg-surface-2 px-3 py-1.5 text-sm outline-none transition-colors placeholder:text-ink-3 focus:bg-panel focus:ring-2 focus:ring-brand/40 sm:w-56";
