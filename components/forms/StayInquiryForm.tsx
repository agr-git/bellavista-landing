"use client";

/**
 * StayInquiryForm — farmhouse booking inquiry.
 * Accepts a preset (`week` | `weekend`) driven by the Stay section toggle.
 * UI only in B7. Wired in B9.
 */

import { useState } from "react";
import { FormField, inputCls } from "./FormField";

export type StayPreset = "week" | "weekend";

export default function StayInquiryForm({
  preset = "weekend",
  onSubmitted,
}: {
  preset?: StayPreset;
  onSubmitted?: () => void;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setPending(true);
        setTimeout(() => {
          setPending(false);
          onSubmitted?.();
        }, 400);
      }}
      className="space-y-4"
    >
      <p className="font-sans text-body text-ink-2">
        We host small groups — meals and a farm tour are included. Tell us
        your dates and we&apos;ll send availability.
      </p>

      <input type="hidden" name="preset" value={preset} />

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

      <button
        type="submit"
        disabled={pending}
        className="font-mono text-meta uppercase bg-paper text-bg px-4 py-2.5 hover:bg-accent-2 disabled:opacity-50 transition-colors"
      >
        {pending ? "Sending…" : "Check dates ↗"}
      </button>
    </form>
  );
}
