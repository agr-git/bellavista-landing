"use client";

/**
 * Coffee — Chapter "What we grow."
 *
 * Layout:
 * - h2 "What we *grow.*"
 * - 2-col split with 2px gap — background shows through as --line.
 * - Left card: B2B · Green coffee  → RequestSamplesForm
 * - Right card: Direct · Roasted coffee → WaitlistForm
 * - Below: pull quote slab on --surface.
 *
 * CTAs open the shared Modal with the correct form.
 */

import { useState } from "react";
import Modal from "../Modal";
import RequestSamplesForm from "../forms/RequestSamplesForm";
import WaitlistForm from "../forms/WaitlistForm";

type Lane = "b2b" | "direct" | null;

export default function Coffee() {
  const [open, setOpen] = useState<Lane>(null);

  return (
    <section
      id="coffee"
      className="theme-cream border-t border-line py-24 px-6 md:px-10"
      aria-labelledby="coffee-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        <h2
          id="coffee-heading"
          className="font-serif text-h2 leading-[1] text-ink text-balance mb-12"
        >
          What we <em className="italic text-accent-2">grow.</em>
        </h2>

        {/* split cards — 2px gap via bg-line */}
        <div className="grid md:grid-cols-2 gap-[2px] bg-line">
          {/* B2B */}
          <article className="bg-surface p-6 md:p-8 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <span className="font-mono text-meta uppercase text-accent border border-accent px-2 py-[3px]">
                B2B
              </span>
              <span className="font-mono text-meta uppercase text-ink-3">
                01 / 02
              </span>
            </div>

            <div>
              <h3 className="font-serif text-h3 text-ink">Green coffee</h3>
              <p className="font-sans text-body text-ink-2 mt-1">
                For roasters · full lot specs, samples on request.
              </p>
            </div>

            <div
              className="w-full bg-surface border border-line"
              style={{
                height: 100,
                backgroundImage:
                  "linear-gradient(135deg, rgba(232,155,74,0.16), transparent 60%)",
              }}
              aria-hidden
            />

            <ul className="flex flex-wrap gap-2">
              {["cenicafé 1", "pink bourbon", "castillo", "colombia"].map((chip) => (
                <li
                  key={chip}
                  className="font-mono text-meta uppercase text-ink-2 border border-line px-2 py-[3px]"
                >
                  {chip}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-4 mt-auto pt-4">
              <span className="font-mono text-meta uppercase text-ink-3">
                Lead-gen inquiry form · no cart yet
              </span>
              <button
                type="button"
                onClick={() => setOpen("b2b")}
                className="font-mono text-meta uppercase bg-accent text-bg px-3 py-[7px] hover:bg-accent-2 transition-colors whitespace-nowrap"
              >
                Request samples ↗
              </button>
            </div>
          </article>

          {/* Direct */}
          <article className="bg-surface p-6 md:p-8 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <span className="font-mono text-meta uppercase text-accent border border-accent px-2 py-[3px]">
                Direct
              </span>
              <span className="font-mono text-meta uppercase text-ink-3">
                02 / 02
              </span>
            </div>

            <div>
              <h3 className="font-serif text-h3 text-ink">Roasted coffee</h3>
              <p className="font-sans text-body text-ink-2 mt-1">
                For drinkers · small drops, ships from the farm.
              </p>
            </div>

            <div
              className="w-full bg-surface border border-line"
              style={{
                height: 100,
                backgroundImage:
                  "linear-gradient(135deg, rgba(245,201,138,0.18), transparent 60%)",
              }}
              aria-hidden
            />

            <ul className="flex flex-wrap gap-2">
              {["castillo", "colombia"].map((chip) => (
                <li
                  key={chip}
                  className="font-mono text-meta uppercase text-ink-2 border border-line px-2 py-[3px]"
                >
                  {chip}
                </li>
              ))}
            </ul>

            <p className="font-mono text-meta uppercase text-ink-3">
              Coming soon
            </p>
            <ul className="flex flex-wrap gap-2" style={{ opacity: 0.55 }}>
              {["cenicafé 1", "pink bourbon"].map((chip) => (
                <li
                  key={chip}
                  className="font-mono text-meta uppercase text-ink-2 border border-line px-2 py-[3px]"
                >
                  {chip}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-4 mt-auto pt-4">
              <span className="font-mono text-meta uppercase text-ink-3">
                Join the drop list · small batches
              </span>
              <button
                type="button"
                onClick={() => setOpen("direct")}
                className="font-mono text-meta uppercase bg-accent text-bg px-3 py-[7px] hover:bg-accent-2 transition-colors whitespace-nowrap"
              >
                Next season waitlist ↗
              </button>
            </div>
          </article>
        </div>

        {/* pull quote slab */}
        <blockquote className="mt-16 bg-surface border-t border-line px-6 md:px-[80px] py-12">
          <p className="font-serif text-[36px] leading-[1.15] text-ink text-balance max-w-[900px]">
            &ldquo;We treat every lot like a deploy.{" "}
            <em className="italic text-accent-2">
              Versioned, logged, and reviewable.&rdquo;
            </em>
          </p>
          <footer className="mt-4 font-mono text-meta uppercase text-ink-3">
            — The producer
          </footer>
        </blockquote>
      </div>

      <Modal
        open={open === "b2b"}
        onClose={() => setOpen(null)}
        title="Request samples"
      >
        <RequestSamplesForm onSubmitted={() => setOpen(null)} />
      </Modal>
      <Modal
        open={open === "direct"}
        onClose={() => setOpen(null)}
        title="Join the waitlist"
      >
        <WaitlistForm onSubmitted={() => setOpen(null)} />
      </Modal>
    </section>
  );
}
