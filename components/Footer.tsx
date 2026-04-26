/**
 * Footer — Contact slab as a transition piece.
 *
 * Per the v3-kraft design, the footer bridges the kraft palette into
 * the dark theme via a diagonal gradient (kraft → kraft-deep → dark
 * blue) with a warm radial bloom on the left side.
 *
 * Because the gradient crosses themes, several values are intentionally
 * hardcoded rather than token-driven — the cream headline / ochre
 * subscribe button stay legible across the full gradient. theme-kraft
 * still applies so child --line / --line-strong inherit kraft values.
 *
 * - Left: meta label CONTACT · 48px italic serif h3 (with accent-2
 *   inner span) · address line
 * - Right: Subscribe CTA (hardcoded ochre) · Admin → outline (cream)
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { submitLead, errorMessage } from "@/lib/submit-lead";

type SubscribeState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState>({ kind: "idle" });
  const subscribed = state.kind === "success";

  return (
    <footer
      id="contact"
      className="theme-kraft relative overflow-hidden border-t border-line px-6 md:px-10 py-16"
      style={{
        background:
          "linear-gradient(135deg, #b8915c 0%, #8a6a3f 40%, #243049 100%)",
        color: "#fef5e2",
      }}
      aria-labelledby="contact-heading"
    >
      {/* Warm radial bloom on the kraft side — softens the gradient ramp. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 50%, rgba(232,155,74,0.25), transparent 55%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        {/* Left */}
        <div className="space-y-3">
          <p
            className="font-mono text-meta uppercase"
            style={{ color: "rgba(254,245,226,0.65)" }}
          >
            Contact
          </p>
          <h3
            id="contact-heading"
            className="font-serif italic leading-[1.05] max-w-[520px]"
            style={{
              color: "#fef5e2",
              fontSize: "48px",
              letterSpacing: "-0.01em",
            }}
          >
            Come visit. Or{" "}
            <span style={{ color: "#f5c98a" }}>stay in touch.</span>
          </h3>
          <p
            className="font-sans text-body"
            style={{ color: "rgba(254,245,226,0.85)" }}
          >
            hello@bellavistacoffee.co · @bellavista.coffee
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 md:items-end">
          {subscribed ? (
            <p
              className="font-mono text-meta uppercase"
              style={{ color: "#f5c98a" }}
            >
              Thanks — we&apos;ll be in touch.
            </p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (state.kind === "sending") return;
                setState({ kind: "sending" });
                const res = await submitLead("subscribe", { email });
                if (res.ok) setState({ kind: "success" });
                else
                  setState({
                    kind: "error",
                    message: errorMessage(res.code),
                  });
              }}
              className="flex flex-col gap-2 items-end"
            >
              <div className="flex items-stretch gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@roastery.com"
                  aria-label="Email to subscribe"
                  className="font-sans text-body px-3 py-2 focus:outline-none transition-colors min-w-[220px]"
                  style={{
                    background: "rgba(27, 36, 55, 0.35)",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "rgba(254,245,226,0.4)",
                    color: "#fef5e2",
                  }}
                />
                <button
                  type="submit"
                  disabled={state.kind === "sending"}
                  className="font-mono text-meta uppercase px-4 py-2 transition-colors disabled:opacity-50"
                  style={{ background: "#e89b4a", color: "#1b2437" }}
                >
                  {state.kind === "sending" ? "Sending…" : "Subscribe"}
                </button>
              </div>
              {state.kind === "error" && (
                <p
                  role="alert"
                  className="font-mono text-meta uppercase"
                  style={{ color: "#f5c98a" }}
                >
                  {state.message}
                </p>
              )}
            </form>
          )}

          <Link
            href="/admin"
            className="font-mono text-meta uppercase px-4 py-2 transition-colors self-start md:self-end"
            style={{
              background: "transparent",
              color: "#fef5e2",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "rgba(254,245,226,0.4)",
            }}
          >
            Admin →
          </Link>
        </div>
      </div>

      <div
        className="relative max-w-[1280px] mx-auto mt-10 pt-6 flex flex-wrap items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(254,245,226,0.18)" }}
      >
        <p
          className="font-mono text-meta uppercase"
          style={{ color: "rgba(254,245,226,0.55)" }}
        >
          © {new Date().getFullYear()} Bellavista Coffee · Manizales, Colombia
        </p>
        <p
          className="font-mono text-meta uppercase"
          style={{ color: "rgba(254,245,226,0.55)" }}
        >
          Documented in drone footage, field notes, and every batch we ship.
        </p>
      </div>
    </footer>
  );
}
