import type { ReactNode } from "react";
import { CountUp, Delta } from "@/components/ui";

/** Card header: label (14/500 grey), value (24/500, animated), delta chip, optional control on the right. */
export function StatHead({ label, value, delta, right }: { label: string; value: string; delta?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <p key={label} className="label-in truncate text-sm font-medium text-ink-2">{label}</p>
        <p className="mt-1 flex items-center gap-2 text-2xl font-medium">
          <CountUp value={value} />
          {delta && <Delta v={delta} />}
        </p>
      </div>
      {right}
    </div>
  );
}
