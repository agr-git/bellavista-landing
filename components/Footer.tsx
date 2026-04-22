/**
 * Footer — Contact slab.
 *
 * - Left: meta label CONTACT · italic h3 · address line
 * - Right: Subscribe CTA (accent) · Admin → button (outline)
 *
 * Subscribe is a minimal inline form (unwired). Admin link points at
 * /admin which is gated by NextAuth in B10.
 */

"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer
      id="contact"
      className="bg-surface border-t border-line px-6 md:px-10 py-12"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        {/* Left */}
        <div className="space-y-3">
          <p className="font-mono text-meta uppercase text-ink-3">Contact</p>
          <h3
            id="contact-heading"
            className="font-serif italic text-h3 text-ink leading-tight max-w-[520px]"
          >
            Come visit. Or stay in touch.
          </h3>
          <p className="font-sans text-body text-ink-2">
            hello@bellavistacoffee.co · @bellavista.coffee
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 md:items-end">
          {subscribed ? (
            <p className="font-mono text-meta uppercase text-accent-2">
              Thanks — we&apos;ll be in touch.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // B7 UI stub; wired in B9 alongside the other forms.
                setSubscribed(true);
              }}
              className="flex items-stretch gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@roastery.com"
                aria-label="Email to subscribe"
                className="bg-bg border border-line px-3 py-2 text-ink font-sans text-body focus:outline-none focus:border-accent-2 transition-colors min-w-[220px]"
              />
              <button
                type="submit"
                className="font-mono text-meta uppercase bg-accent text-bg px-4 py-2 hover:bg-accent-2 transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}

          <Link
            href="/admin"
            className="font-mono text-meta uppercase border border-line text-ink-2 px-4 py-2 hover:border-accent-2 hover:text-ink transition-colors self-start md:self-end"
          >
            Admin →
          </Link>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-10 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-meta uppercase text-ink-3">
          © {new Date().getFullYear()} Bellavista Coffee · Manizales, Colombia
        </p>
        <p className="font-mono text-meta uppercase text-ink-3">
          Documented in drone footage, field notes, and every batch we ship.
        </p>
      </div>
    </footer>
  );
}
