/**
 * /beneficio — soft paywall + private-Substack landing.
 *
 * Used by:
 *   - 05 BENEFICIO link in the Hero chapter strip
 *   - any private journal entry that the visitor doesn't have access to
 *
 * Design fits the site's existing register: theme-cream surface, the
 * same chapter-marker pattern as Story (col-1 chapter numeral + h2),
 * a body block in the producer's voice, a primary accent CTA, and a
 * Footer at the bottom for contact continuity. No emoji, no upsell
 * copy — just the same field-log register.
 *
 * SUBSTACK_URL is a placeholder. Replace once the real handle exists.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Beneficio · Bellavista Coffee",
  description:
    "The full record — beneficio detail, journal entries, and roasting samples — lives on a private Substack.",
  robots: { index: false, follow: false },
};

const SUBSTACK_URL = "https://bellavistacoffee.substack.com";

export default function BeneficioPage() {
  return (
    <main>
      <section
        id="beneficio"
        className="theme-cream border-t border-line px-6 md:px-10"
        style={{ paddingBlock: "clamp(96px, 14vh, 200px)" }}
        aria-labelledby="beneficio-heading"
      >
        <div className="max-w-[1280px] mx-auto grid gap-8 md:gap-[30px] md:grid-cols-[80px_1fr_300px]">
          {/* Col 1 — chapter marker, matches Story's pattern */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-meta uppercase text-ink-3">
              Chapter
            </span>
            <span className="font-serif text-[64px] leading-none text-accent">
              05
            </span>
          </div>

          {/* Col 2 — headline + body */}
          <div className="max-w-[640px]">
            <p className="font-mono text-meta uppercase text-accent tracking-[0.2em]">
              Beneficio · Private feed
            </p>

            <h1
              id="beneficio-heading"
              className="mt-6 font-serif text-h2 leading-[1] text-ink text-balance"
            >
              The full{" "}
              <em className="italic text-accent-2">record</em>.
            </h1>

            <div className="mt-8 space-y-5 font-sans text-body text-ink-2 leading-relaxed">
              <p>
                The site you scrolled through is the public field log — drone
                footage, plot notes, and the lots we ship. The other half of
                the work lives somewhere quieter.
              </p>
              <p>
                To read every journal entry, the beneficio detail
                (fermentation curves, drying logs, water profiles), and the
                roasting sample notes for every batch we cup, subscribe to
                the private Substack. That&apos;s where the full record
                lands.
              </p>
              <p className="font-serif italic text-h4 leading-tight text-ink">
                Versioned, logged, and reviewable — all of it.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={SUBSTACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-meta uppercase bg-accent text-bg px-5 py-3 hover:bg-accent-2 transition-colors"
              >
                Subscribe on Substack ↗
              </a>
              <Link
                href="/"
                className="font-mono text-meta uppercase text-ink-2 hover:text-ink transition-colors px-2 py-3"
              >
                ← Back to the field log
              </Link>
            </div>
          </div>

          {/* Col 3 — what's behind the paywall, mirrors Story's Previously card */}
          <aside className="space-y-4">
            <div className="border border-line p-4 space-y-3 bg-surface/40">
              <p className="font-mono text-meta uppercase text-ink-3">
                What you get
              </p>
              <ul className="font-sans text-small text-ink-2 leading-relaxed space-y-2">
                <li>· Every journal entry — public + private</li>
                <li>· Beneficio process logs (fermentation, drying, water)</li>
                <li>· Roasting sample notes per batch</li>
                <li>· Weekly cup scores</li>
                <li>· Season-end retrospectives</li>
              </ul>
            </div>

            <div className="border border-line p-4 space-y-2">
              <p className="font-mono text-meta uppercase text-ink-3">
                Trade access
              </p>
              <p className="font-serif italic text-small leading-snug text-ink">
                Roasters and trade partners — write directly:{" "}
                <a
                  href="mailto:hello@bellavistacoffee.co"
                  className="text-accent-2 hover:underline not-italic font-sans"
                >
                  hello@bellavistacoffee.co
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
