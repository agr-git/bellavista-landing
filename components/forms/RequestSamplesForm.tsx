"use client";

/**
 * RequestSamplesForm — B2B green coffee sample request.
 *
 * UI only in B7. Wiring to /api/leads with Resend + Notion happens in B9.
 */

import { useState } from "react";
import { FormField, inputCls } from "./FormField";

export default function RequestSamplesForm({
  onSubmitted,
}: {
  onSubmitted?: () => void;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // B7 stub: simulate a tick of latency so the UI feels real.
        setPending(true);
        setTimeout(() => {
          setPending(false);
          onSubmitted?.();
        }, 400);
      }}
      className="space-y-4"
    >
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

      {/* honeypot — will enforce in B9 */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <button
        type="submit"
        disabled={pending}
        className="font-mono text-meta uppercase bg-accent text-bg px-4 py-2.5 hover:bg-accent-2 disabled:opacity-50 transition-colors"
      >
        {pending ? "Sending…" : "Request samples ↗"}
      </button>
    </form>
  );
}
