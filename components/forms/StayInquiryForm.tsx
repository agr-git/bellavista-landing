"use client";

/**
 * StayInquiryForm — farmhouse booking inquiry.
 * Wired to POST /api/leads { type: "stay", preset, ... } in B9.
 */

import { useState } from "react";
import { FormField, inputCls } from "./FormField";
import { submitLead, errorMessage } from "@/lib/submit-lead";

export type StayPreset = "week" | "weekend";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function StayInquiryForm({
  preset = "weekend",
  onSubmitted,
}: {
  preset?: StayPreset;
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
      preset,
      arrive: String(fd.get("arrive") ?? ""),
      depart: String(fd.get("depart") ?? ""),
      guests: fd.get("guests") ? Number(fd.get("guests")) : undefined,
      notes: String(fd.get("notes") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const res = await submitLead("stay", fields);
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
        Request received — we&apos;ll confirm availability within a day.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p className="font-sans text-body text-ink-2">
        We host small groups — meals and a farm tour are included. Tell us
        your dates and we&apos;ll send availability.
      </p>

      <FormField id="stay-name" label="Name" required>
        <input id="stay-name" name="name" required className={inputCls} />
      </FormField>

      <FormField id="stay-email" label="Email" required>
        <input
          id="stay-email"
          name="email"
          type="email"
          required
          className={inputCls}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField id="stay-arrive" label="Arrive">
          <input
            id="stay-arrive"
            name="arrive"
            type="date"
            className={inputCls}
          />
        </FormField>
        <FormField id="stay-depart" label="Depart">
          <input
            id="stay-depart"
            name="depart"
            type="date"
            className={inputCls}
          />
        </FormField>
      </div>

      <FormField id="stay-guests" label="Guests">
        <input
          id="stay-guests"
          name="guests"
          type="number"
          min={1}
          max={6}
          defaultValue={2}
          className={inputCls}
        />
      </FormField>

      <FormField id="stay-notes" label="Notes">
        <textarea
          id="stay-notes"
          name="notes"
          rows={3}
          className={inputCls}
          placeholder="Dietary restrictions, transport needs, etc."
        />
      </FormField>

      <p className="font-mono text-meta uppercase text-ink-3">
        Preset · {preset}
      </p>

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
        className="font-mono text-meta uppercase bg-paper text-bg px-4 py-2.5 hover:bg-accent-2 disabled:opacity-50 transition-colors"
      >
        {state.kind === "sending" ? "Sending…" : "Check dates ↗"}
      </button>
    </form>
  );
}
