"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Centered dialog with backdrop. Closes on Escape or backdrop click,
 * locks page scroll, returns focus to the opener, animates in and out.
 */
export function Modal({ open, onClose, label, className = "", children }: {
  open: boolean; onClose: () => void; label: string; className?: string; children: ReactNode;
}) {
  // render children in the same pass as `open` flips, keep them for the exit animation
  const [prevOpen, setPrevOpen] = useState(open);
  const [closing, setClosing] = useState(false);
  if (prevOpen !== open) { setPrevOpen(open); setClosing(!open); }
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => setClosing(false), 180);
    return () => clearTimeout(t);
  }, [closing]);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const overflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => panel.current?.focus());
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; opener?.focus?.(); };
  }, [open, onClose]);

  if (!open && !closing) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4">
      <div className={`absolute inset-0 bg-black/40 ${closing ? "fade-out" : "fade-in"}`} onClick={onClose} />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
        className={`relative outline-none ${closing ? "modal-out" : "modal-in"} ${className}`}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
