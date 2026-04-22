"use client";

/**
 * RequestSamplesForm — B2B green-coffee sample request.
 *
 * Wired to POST /api/leads { type: "b2b", ... } in B9.
 * Loading / success / error states surface inline.
 */

import { useState } from "react";
import { FormField, inputCls } from "./FormField";
import { submitLead, errorMessage } from "@/lib/submit-lead";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function RequestSamplesForm({
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
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      country: String(fd.get("country") ?? ""),
      volume: fd.get("volume") ? Number(fd.get("volume")) : undefined,
      notes: String(fd.get("notes") ?? ""),
      website: String(fd.get("website") ?? ""), // honeypot
    };

    const res = await submitLead("b2b", fields);
    if (res.ok) {
      setState({ kind: "success" });
      // Give the user a beat to read the success before the modal closes.
      setTimeout(() => onSubmitted?.(), 1200);
    } else {
      setState({ kind: "error", message: errorMessage(res.code) });
    }
  }

  if (state.kind === "success") {
    return (
      <p className="font-serif italic text-h4 text-accent-2">
        Got it — we&apos;ll be in touch within two business days.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="font-sans text-body text-ink-2">
        Tell us a bit about your roastery — we&apos;ll send current lot
        sheets and a sample kit.
      </p>

      <FormField id="b2b-name" label="Roastery / Company" required>
        <input id="b2b-name" name="company" required className={inputCls} />
      </FormField>

      <FormField id="b2b-email" label="Email" required>
        <input
          id="b2b-email"
          name="email"
          type="email"
          required
          className={inputCls}
        />
      </FormField>

      <FormField id="b2b-country" label="Shipping country">
        <input id="b2b-country" name="country" className={inputCls} />
      </FormField>

      <FormField id="b2b-volume" label="Approx. annual volume (kg)">
        <input
          id="b2b-volume"
          name="volume"
          type="number"
          min={0}
          className={inputCls}
        />
      </FormField>

      <FormField id="b2b-notes" label="Notes">
        <textarea
          id="b2b-notes"
          name="notes"
          rows={3}
          className={inputCls}
          placeholder="Profiles you're looking for, process preferences, etc."
        />
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
        {state.kind === "sending" ? "Sending…" : "Request samples ↗"}
      </button>
    </form>
  );
}
