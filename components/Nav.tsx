"use client";

/**
 * Sticky top navigation.
 * - Transparent over the hero; fades to bg-bg/95 (backdrop-blur) once the
 *   hero sentinel scrolls out of view.
 * - Anchor links scroll smoothly to their sections.
 * - EN | ES (soon) toggle is rendered disabled in v1 (i18n stubbed, copy TBD).
 */

import { useEffect, useRef, useState } from "react";
import BellavistaWordmark from "./BellavistaWordmark";

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

  // Consistent palette regardless of underlying section theme: dark navy
  // bar with cream text once we're past the hero, fully transparent over
  // the kraft hero so its cinematic isn't broken.
  return (
    <header
      ref={sentinelRef}
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: opaque ? "rgba(12, 12, 10, 0.95)" : "transparent",
        backdropFilter: opaque ? "blur(8px)" : undefined,
        borderBottom: opaque
          ? "1px solid rgba(254, 245, 226, 0.12)"
          : "1px solid transparent",
        color: "#fef5e2",
      }}
    >
      <nav className="flex items-center justify-between px-8 py-4 max-w-[1400px] mx-auto">
        <a
          href="#top"
          aria-label="Bellavista Coffee Farm — home"
          className="hover:opacity-80 transition-opacity flex items-center"
        >
          <BellavistaWordmark
            variant="horizontal"
            theme="onyx"
            wordmarkSize={28}
          />
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-sans text-small hover:opacity-100 transition-opacity"
                style={{ color: "rgba(254, 245, 226, 0.75)" }}
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
            className="font-mono text-meta uppercase rounded px-3 py-1 cursor-not-allowed"
            style={{
              color: "rgba(254, 245, 226, 0.65)",
              border: "1px solid rgba(254, 245, 226, 0.25)",
            }}
            title="Spanish coming soon"
          >
            EN <span style={{ opacity: 0.55 }}>| ES (soon)</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
