"use client";

/**
 * Modal — shared dialog shell.
 *
 * - Controlled via `open` + `onClose`.
 * - Locks body scroll while open.
 * - Closes on ESC and backdrop click.
 * - Minimal focus handling: focuses the dialog root on open. Full focus
 *   trap is a V1 polish task; the surface here is small and keyboard-
 *   friendly via native tab order.
 * - Unstyled title area — children own the form chrome.
 */

import { useEffect, useRef } from "react";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    rootRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div
        ref={rootRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-[520px] bg-surface border border-line shadow-elev outline-none"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <h3
            id="modal-title"
            className="font-serif italic text-h4 text-ink"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-meta uppercase text-ink-3 hover:text-ink transition-colors"
          >
            Close ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
