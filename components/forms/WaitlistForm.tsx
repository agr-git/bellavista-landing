"use client";

/**
 * WaitlistForm — direct consumer waitlist for small roasted drops.
 * UI only in B7. Wired in B9.
 */

import { useState } from "react";
import { FormField, inputCls } from "./FormField";

export default function WaitlistForm({
  onSubmitted,
}: {
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

      <button
        type="submit"
        disabled={pending}
        className="font-mono text-meta uppercase bg-accent text-bg px-4 py-2.5 hover:bg-accent-2 disabled:opacity-50 transition-colors"
      >
        {pending ? "Joining…" : "Join the waitlist ↗"}
      </button>
    </form>
  );
}
