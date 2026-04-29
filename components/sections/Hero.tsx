"use client";

/**
 * Hero — full-bleed cinematic, 100vh.
 *
 * - Background: placeholder gradient (drone video swaps in post-ship).
 *   The <video> element is wired: if /media/hero.mp4 is present at build,
 *   it'll autoplay muted looped. Otherwise falls back to the CSS gradient.
 * - Headline: "From lines of code / to lines of coffee trees" with italic
 *   + --accent-2 on "to lines of".
 * - Primary CTA: 72px circular play button (toggles mute, scrolls to #story).
 * - Chapter strip: 5 chapters with IntersectionObserver-driven active
 *   underline (scrolls to matching section on click).
 * - Gradient overlay keeps text legible.
 *
 * B4 scope. Real drone video is a post-ship asset.
 */

import { useEffect, useRef, useState } from "react";

const CHAPTERS = [
  { n: "01", label: "THE PRODUCER", href: "#story" },
  { n: "02", label: "VILLA PAULA", href: "#villa-paula" },
  { n: "03", label: "BAMBU STREAM", href: "#bambu-stream" },
  { n: "04", label: "TERRA PRETA", href: "#terra-preta" },
  { n: "05", label: "BENEFICIO", href: "/beneficio" },
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [activeChapter, setActiveChapter] = useState<string>("#story");

  // Track which chapter section is in view
  useEffect(() => {
    const ids = CHAPTERS.map((c) => c.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveChapter(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const handlePlay = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = false;
      setMuted(false);
      v.play().catch(() => {
        /* autoplay-with-sound may be blocked; ignore */
      });
    }
    // Scroll to first chapter
    document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="theme-kraft relative min-h-screen w-full overflow-hidden">
      {/* Nav sentinel */}
      <div id="nav-sentinel" className="absolute top-0 h-[60vh] w-full pointer-events-none" />

      {/* Background — video or gradient fallback */}
      <div className="absolute inset-0 z-0">
        {/* 1. Fallback / decorative gradient — bottom layer.
            When the video loads it paints on top of this; when the
            video 404s (or before it buffers) the gradient shows.
            Theme-aware colors via CSS vars (themes.css). */}
        <div
          aria-hidden
          className="absolute inset-0 bg-bg"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 20%, var(--hero-radial-1), transparent 60%), radial-gradient(ellipse at 70% 80%, var(--hero-radial-2), transparent 55%), linear-gradient(180deg, var(--surface) 0%, var(--bg) 60%)",
          }}
        />
        {/* 2. Video — sits on top of the gradient when it loads. */}
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          loop
          playsInline
          poster="/media/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        {/* 3. Legibility overlay — top of everything. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--hero-overlay-top) 0%, var(--hero-overlay-mid) 35%, var(--hero-overlay-bot) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top spacer (nav is fixed) */}
        <div className="h-20" />

        {/* Center text block */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-[760px] text-center space-y-6">
            <p className="font-mono text-meta uppercase text-ink-3 tracking-[0.15em]">
              Manizales · Colombia · 1,300 MASL
            </p>
            <h1 className="font-serif text-h1 leading-[0.92] text-ink text-balance">
              From Excel rows
              <br />
              <em className="not-italic">
                <span className="italic text-accent-2">to rows of </span>
                coffee trees.
              </em>
            </h1>
            <p className="font-sans text-body text-ink-2/90 max-w-[440px] mx-auto leading-relaxed">
              A mid-size production project on a ridge above Manizales — documented in drone footage, field notes, and every batch we ship.
            </p>

            {/* Primary CTA — whole row is the click target */}
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Start the tour — scroll to The producer"
                className="group flex items-center gap-4 cursor-pointer"
              >
                <span className="relative w-[72px] h-[72px] rounded-full border-[1.5px] border-ink flex items-center justify-center group-hover:border-accent-2 transition-colors">
                  <span className="block w-0 h-0 ml-1 border-y-[10px] border-y-transparent border-l-[14px] border-l-ink group-hover:border-l-accent-2 transition-colors" />
                </span>
                <span className="text-left">
                  <span className="block font-serif italic text-h4 text-ink group-hover:text-accent-2 transition-colors">
                    Start the tour
                  </span>
                  <span className="block font-mono text-meta uppercase text-ink-3 mt-1">
                    5 chapters · 08:42
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Chapter strip */}
        <div className="border-t border-line backdrop-blur-sm bg-bg/20">
          <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center gap-6 overflow-x-auto">
            <span className="font-mono text-small font-semibold uppercase text-ink whitespace-nowrap">
              ↓ Scroll to explore
            </span>
            <ul className="flex items-center gap-6 ml-auto">
              {CHAPTERS.map((c) => {
                const isActive = activeChapter === c.href;
                return (
                  <li key={c.n}>
                    <a
                      href={c.href}
                      className={`font-mono text-small font-semibold uppercase whitespace-nowrap transition-colors inline-block pb-1 border-b-[1.5px] text-ink hover:text-accent-2 ${
                        isActive ? "border-accent-2" : "border-transparent"
                      }`}
                    >
                      {c.n} {c.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
