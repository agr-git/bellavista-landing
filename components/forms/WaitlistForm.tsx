"use client";

/**
 * WaitlistForm — direct consumer waitlist.
 * Wired to POST /api/leads { type: "waitlist", ... } in B9.
 */

import { useState } from "react";
import { FormField, inputCls } from "./FormField";
import { submitLead, errorMessage } from "@/lib/submit-lead";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function WaitlistForm({
  onSubmitted,
}: {
  onSubmitted?: () => void;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "sending") return;
    setState({ kind: "sending" });

    const fd = new FormData(e.currentTarget);
    const fields = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      country: String(fd.get("country") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const res = await submitLead("waitlist", fields);
    if (res.ok) {
      setState({ kind: "success" });
      setTimeout(() => onSubmitted?.(), 1200);
    } else {
      setState({ kind: "error", message: errorMessage(res.code) });
    }
  }

  if (state.kind === "success") {
    return (
      <p className="font-serif italic text-h4 text-accent-2">
        You&apos;re on the list — next drop alert arrives by email.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="font-sans text-body text-ink-2">
        Roasted lots are small and ship from the farm. Join the list and
        we&apos;ll let you know when the next drop opens.
      </p>

      <FormField id="wl-name" label="Name" required>
        <input id="wl-name" name="name" required className={inputCls} />
      </FormField>

      <FormField id="wl-email" label="Email" required>
        <input
          id="wl-email"
          name="email"
          type="email"
          required
          className={inputCls}
        />
      </FormField>

      <FormField id="wl-country" label="Country">
        <input id="wl-country" name="country" className={inputCls} />
      </FormField>

      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      {state.kind === "error" && (
        <p
          role="alert"
          className="font-mono text-meta uppercase text-accent-2"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.kind === "sending"}
        className="font-mono text-meta uppercase bg-accent text-bg px-4 py-2.5 hover:bg-accent-2 disabled:opacity-50 transition-colors"
      >
        {state.kind === "sending" ? "Joining…" : "Join the waitlist ↗"}
      </button>
    </form>
  );
}
