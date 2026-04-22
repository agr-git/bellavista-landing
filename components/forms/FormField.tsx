/**
 * FormField — tiny shared input wrapper so the 3 form UIs look identical.
 * Unwired (no validation, no submit) until B9.
 */

import { ReactNode } from "react";

type BaseProps = {
  id: string;
  label: string;
  required?: boolean;
  children?: ReactNode;
};

export function FormField({ id, label, required, children }: BaseProps) {
  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="font-mono text-meta uppercase text-ink-3">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full bg-bg border border-line px-3 py-2 text-ink font-sans text-body focus:outline-none focus:border-accent-2 transition-colors";
