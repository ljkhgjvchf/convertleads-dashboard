import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost" | "icon";

const press = "transition-[transform,background-color,border-color,color,filter,opacity] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "gap-1.5 rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-3 py-2 text-white shadow-[0_1px_2px_#0000001a,inset_0_1px_0_#ffffff33] hover:brightness-110",
  outline: "gap-1.5 rounded-[10px] border border-line-strong bg-panel px-3 py-2 hover:border-ink-4 hover:bg-surface",
  ghost: "gap-1 rounded-lg px-2 py-1 hover:bg-surface-2",
  icon: "size-8 justify-center rounded-lg border border-line-strong bg-panel text-ink-2 hover:border-ink-4 hover:text-ink",
};

export const buttonClass = (v: ButtonVariant = "outline") => `inline-flex shrink-0 items-center text-sm font-medium ${press} ${VARIANTS[v]}`;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

export function Button({ variant = "outline", className = "", type = "button", ...rest }: Props) {
  return <button type={type} className={`${buttonClass(variant)} ${className}`} {...rest} />;
}

export function IconButton({ className = "", ...rest }: Omit<Props, "variant"> & { "aria-label": string }) {
  return <Button variant="icon" className={className} {...rest} />;
}
