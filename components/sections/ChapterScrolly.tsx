"use client";

/**
 * ChapterScrolly — the core cinematic chapter block.
 *
 * Layout strategy:
 * - Section is content-driven: no min-height in viewport units. Vertical
 *   air comes from `padding-block: clamp(64px, 10vh, 160px)` so the
 *   rhythm scales gracefully across phone / tablet / laptop / 4K.
 * - Sticky pin removed (it was a no-op once the parent stopped having
 *   scroll-past runway). Editorial column renders in normal flow; video
 *   column has an explicit aspect ratio so it scales without the height
 *   guessing game across devices.
 * - Inner grid: 2 cols `42% | 58%`.
 * - LEFT col: `position: sticky; top: 0; height: 100vh`.
 *   Sticky + flex has historically misbehaved on iOS Safari; we keep
 *   the sticky child a plain block, no flex parent, no calculated
 *   heights — only 100vh and min-height:250vh on the container.
 * - RIGHT col: normal flow, fills the 250vh spill so the left pins as
 *   the right scrolls past.
 * - On mobile (<768px): pinning drops — plain stacked layout.
 *
 * Progress bar is tied to scroll progress within the section via
 * IntersectionObserver + requestAnimationFrame (no scroll listener
 * storms). Plays nicely with reduced-motion (we still render, just
 * don't animate the video attempt).
 *
 * Pins: numbered 22×22 accent circles, clicking toggles a label card.
 * Label card uses Instrument Serif italic on --bg background.
 */

import { useEffect, useRef, useState } from "react";

export type Pin = {
  n: number;
  xPct: number; // 0-100
  yPct: number; // 0-100
  label: string;
};

export type Stat = {
  label: string;
  value: string;
};

export type ChapterScrollyProps = {
  /** Anchor id so the nav + FarmMap can scroll here */
  id: string;
  /** "03" etc. */
  chapterNumber: string;
  /** "EL BOSQUE" etc. */
  plot: string;
  /** React node so headline can contain italic span */
  headline: React.ReactNode;
  /** 3-5 short paragraphs */
  body: string[];
  stats: Stat[];
  pins: Pin[];
  /** Optional video src; falls back to gradient if missing */
  videoSrc?: string;
  /** e.g. "03 / 05" */
  pageLabel: string;
};

export default function ChapterScrolly({
  id,
  chapterNumber,
  plot,
  headline,
  body,
  stats,
  pins,
  videoSrc,
  pageLabel,
}: ChapterScrollyProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [openPin, setOpenPin] = useState<number | null>(null);

  // Tie progress bar to scroll position through the section.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const tick = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress 0 when section's top hits viewport top; 1 when bottom leaves.
      const total = rect.height - vh;
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? traveled / total : 0);
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="theme-dark relative border-t border-line"
      style={{ paddingBlock: "clamp(64px, 10vh, 160px)" }}
      aria-labelledby={`${id}-heading`}
    >
      <div className="md:grid md:grid-cols-[42%_58%] md:items-stretch">
        {/* LEFT — editorial column (normal flow) */}
        <div className="md:border-r md:border-line">
          <div className="flex flex-col h-full px-6 md:px-[34px]">
            <p className="font-mono text-meta uppercase text-accent tracking-[0.15em]">
              Chapter {chapterNumber} · {plot}
            </p>

            <h2
              id={`${id}-heading`}
              className="mt-6 font-serif text-h2 leading-[1] text-ink text-balance"
            >
              {headline}
            </h2>

            <div className="mt-6 space-y-4 font-sans text-body text-ink-2 leading-relaxed max-w-[440px]">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* stat tiles */}
            <div className="mt-6 grid grid-cols-3 gap-2 max-w-[440px]">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="border border-line p-2"
                >
                  <p className="font-mono text-meta uppercase text-ink-3">
                    {s.label}
                  </p>
                  <p className="font-serif italic text-[16px] leading-tight text-accent-2 mt-1">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* progress footer */}
            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between font-mono text-meta uppercase text-ink-3">
                <span>{pageLabel}</span>
              </div>
              <div className="mt-2 h-[2px] w-full bg-line relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-accent"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — video column, normal flow */}
        <div className="relative mt-8 md:mt-0">
          {/* Aspect-ratio wrapper so the video scales predictably across
              devices instead of guessing a viewport-height. */}
          <div className="relative bg-surface overflow-hidden aspect-[4/3] md:aspect-auto md:h-full md:min-h-[520px]">
            {videoSrc ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            ) : null}

            {/* Decorative gradient fallback */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 40% 35%, rgba(232,155,74,0.18), transparent 55%), linear-gradient(180deg, #1a1a17 0%, #0c0c0a 100%)",
              }}
            />

            {/* center play button */}
            <button
              type="button"
              aria-label={`Play ${plot} footage`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-[1.5px] border-ink flex items-center justify-center hover:border-accent-2 transition-colors group"
            >
              <span className="block w-0 h-0 ml-1 border-y-[8px] border-y-transparent border-l-[12px] border-l-ink group-hover:border-l-accent-2 transition-colors" />
            </button>

            {/* pins */}
            {pins.map((pin) => (
              <div
                key={pin.n}
                className="absolute"
                style={{
                  left: `${pin.xPct}%`,
                  top: `${pin.yPct}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <button
                  type="button"
                  aria-label={pin.label}
                  onClick={() =>
                    setOpenPin(openPin === pin.n ? null : pin.n)
                  }
                  className="w-[22px] h-[22px] rounded-full bg-accent text-bg font-mono text-[10px] font-medium flex items-center justify-center hover:bg-accent-2 transition-colors"
                >
                  {pin.n}
                </button>
                {openPin === pin.n && (
                  <span
                    className="absolute top-1/2 left-[calc(100%+6px)] -translate-y-1/2 whitespace-nowrap font-serif italic text-small bg-bg text-ink px-2 py-[3px] border border-line"
                    role="tooltip"
                  >
                    {pin.label}
                  </span>
                )}
              </div>
            ))}

            {/* scrubber */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
              <div className="relative flex-1 h-[2px] bg-line">
                <div
                  className="absolute inset-y-0 left-0 bg-accent-2"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
                <div
                  className="absolute -top-[3px] w-2 h-2 bg-accent-2"
                  style={{
                    left: `calc(${Math.round(progress * 100)}% - 4px)`,
                  }}
                />
              </div>
              <span className="font-mono text-meta uppercase text-ink-2">
                {formatTime(progress * 108)} / 01:48
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
