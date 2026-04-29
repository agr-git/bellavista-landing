import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beneficio · Bellavista Coffee",
  description:
    "The full record — beneficio details, roasting samples, weekly cup notes — lives on a private Substack.",
  robots: { index: false, follow: false },
};

const SUBSTACK_URL = "https://bellavistacoffee.substack.com";

export default function BeneficioPage() {
  return (
    <main className="theme-dark min-h-screen flex flex-col">
      <section className="flex-1 flex items-center px-6 md:px-10 py-[clamp(96px,15vh,200px)]">
        <div className="max-w-[760px] mx-auto w-full space-y-10">
          <p className="font-mono text-meta uppercase text-accent tracking-[0.2em]">
            Chapter 05 · Beneficio
          </p>

          <h1 className="font-serif text-h1 leading-[0.95] text-ink text-balance">
            The full
            {" "}
            <em className="italic text-accent-2">record</em>.
          </h1>

          <div className="space-y-6 font-sans text-body text-ink-2 leading-relaxed max-w-[560px]">
            <p>
              The site you scrolled through is the public field log — drone
              footage, plot notes, what we ship. The other half of the work
              lives somewhere quieter.
            </p>
            <p>
              To read every journal entry, the beneficio detail (fermentation
              curves, drying logs, water profiles), and the roasting sample
              process notes for every batch we cup, subscribe to the private
              Substack. That&apos;s where the full record lands.
            </p>
            <p className="font-serif italic text-h4 text-ink">
              Versioned, logged, and reviewable — all of it.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
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

          <p className="font-mono text-meta uppercase text-ink-3 pt-8 border-t border-line">
            Private feed · invite-only roasters and trade partners welcome —
            email{" "}
            <a
              href="mailto:hello@bellavistacoffee.co"
              className="text-accent-2 hover:underline"
            >
              hello@bellavistacoffee.co
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
