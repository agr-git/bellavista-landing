"use client";

/**
 * Sticky top navigation.
 * - Transparent over the hero; fades to bg-bg/95 (backdrop-blur) once the
 *   hero sentinel scrolls out of view.
 * - Anchor links scroll smoothly to their sections.
 * - EN | ES (soon) toggle is rendered disabled in v1 (i18n stubbed, copy TBD).
 */

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#story", label: "Story" },
  { href: "#farm", label: "The Farm" },
  { href: "#coffee", label: "Coffee" },
  { href: "#stay", label: "Stay" },
  { href: "#journal", label: "Journal" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [opaque, setOpaque] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // IntersectionObserver watches the hero sentinel (injected in Hero).
    // When it leaves viewport, fade nav to opaque.
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;

    const obs = new IntersectionObserver(
      ([entry]) => setOpaque(!entry.isIntersecting),
      { rootMargin: "-60px 0px 0px 0px" }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  return (
    <header
      ref={sentinelRef}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        opaque ? "bg-bg/95 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-8 py-4 max-w-[1400px] mx-auto">
        <a
          href="#top"
          className="font-serif text-h4 text-ink hover:text-accent-2 transition-colors"
        >
          Bellavista<span className="text-accent">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-sans text-small text-ink-2 hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            disabled
            aria-label="Language toggle (Spanish coming soon)"
            className="font-mono text-meta uppercase text-ink-3 border border-line rounded px-3 py-1 cursor-not-allowed"
            title="Spanish coming soon"
          >
            EN <span className="text-ink-3/50">| ES (soon)</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
