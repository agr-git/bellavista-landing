/**
 * Farm — Chapter 02 · "The farm, and how it got here."
 *
 * Sections:
 * - Chapter header (label + big numeral + h2)
 * - Row 1: 2-col grid [1.3fr | 1fr] — FarmMap + 2×3 stats grid
 * - Row 2 (hairline separated): 6-col milestones with accent top-border
 *   on 2021 and 2024.
 *
 * Stats values use Instrument Serif italic at 22px in accent-2 per spec.
 * "PROCESS" spans 2 columns so the process list fits comfortably.
 */

import FarmMap from "./FarmMap";

const STATS: { label: string; value: string; span?: boolean }[] = [
  { label: "Altitude", value: "1,300 m" },
  { label: "Area", value: "15 ha" },
  { label: "Plots", value: "7" },
  { label: "Varietals", value: "3" },
  { label: "Process", value: "Washed · Honey · Natural", span: true },
  { label: "Renewal", value: "2025" },
];

type MilestoneVariant = "neutral" | "accent" | "objective";

const MILESTONES: { year: string; title: string; variant: MilestoneVariant }[] = [
  { year: "2024", title: "First harvest · drying facility built", variant: "accent" },
  { year: "2024", title: "2nd Prize · specialty expo", variant: "neutral" },
  { year: "2025", title: "Germany export · Castillo Honey · 85.75 SCA", variant: "accent" },
  { year: "2026", title: "Pink Bourbon seedlings", variant: "neutral" },
  { year: "2028", title: "First 88+ SCA export", variant: "objective" },
  { year: "2029", title: "Economic break-even", variant: "objective" },
];

export default function Farm() {
  return (
    <section
      id="farm"
      className="theme-dark border-t border-line py-24 px-6 md:px-10"
      aria-labelledby="farm-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Chapter header */}
        <div className="flex items-end gap-6 mb-12">
          <div className="flex flex-col gap-2 shrink-0">
            <span className="font-mono text-meta uppercase text-ink-3">
              Chapter
            </span>
            <span className="font-serif text-[64px] leading-none text-accent">
              02
            </span>
          </div>
          <h2
            id="farm-heading"
            className="font-serif text-h2 leading-[1] text-ink text-balance max-w-[720px]"
          >
            The farm,{" "}
            <em className="italic text-accent-2">and how it got here.</em>
          </h2>
        </div>

        {/* Row 1: map + stats */}
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr]">
          <FarmMap />

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className={`border border-line p-3 space-y-2 ${
                    s.span ? "col-span-2" : ""
                  }`}
                >
                  <p className="font-mono text-meta uppercase text-ink-3">
                    {s.label}
                  </p>
                  <p className="font-serif italic text-[22px] leading-tight text-accent-2">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-mono text-meta uppercase text-ink-3">
              4 plots not pictured · ask for the others
            </p>
          </div>
        </div>

        {/* Row 2: milestones */}
        <div className="mt-12 pt-10 border-t border-line">
          <p className="font-mono text-meta uppercase text-ink-3 mb-6">
            Milestones
          </p>
          <ol className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {MILESTONES.map((m, i) => {
              const isObjective = m.variant === "objective";
              const isAccent = m.variant === "accent";
              const borderClass = isObjective
                ? "border-line"
                : isAccent
                ? "border-accent"
                : "border-line";
              const borderStyle = isObjective ? "dashed" : "solid";
              const yearColor = isObjective
                ? "text-ink-3"
                : isAccent
                ? "text-accent"
                : "text-ink";
              const titleColor = isObjective ? "text-ink-3" : "text-ink-2";
              return (
                <li
                  key={`${m.year}-${i}`}
                  className={`pt-2 border-t-[1.5px] ${borderClass}`}
                  style={{ borderTopStyle: borderStyle }}
                >
                  {isObjective && (
                    <span className="inline-block font-mono text-[10px] uppercase text-ink-3 border border-line px-[6px] py-[1px] mb-1 tracking-[0.1em]">
                      Objective
                    </span>
                  )}
                  <p
                    className={`font-serif italic text-[22px] leading-tight ${yearColor}`}
                  >
                    {m.year}
                  </p>
                  <p
                    className={`mt-1 font-sans text-[11px] leading-snug ${titleColor}`}
                  >
                    {m.title}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
