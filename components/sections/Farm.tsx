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
  { label: "Area", value: "4.2 ha" },
  { label: "Plots", value: "3" },
  { label: "Varietals", value: "3" },
  { label: "Process", value: "Washed · Anaerobic · Carbonic", span: true },
  { label: "Planted", value: "2021" },
];

const MILESTONES: { year: string; title: string; accent?: boolean }[] = [
  { year: "2018", title: "First visit" },
  { year: "2020", title: "Quit tech" },
  { year: "2021", title: "Seedlings", accent: true },
  { year: "2023", title: "Beneficio" },
  { year: "2024", title: "First export · 88+ SCA", accent: true },
  { year: "2025", title: "Stay opens" },
];

export default function Farm() {
  return (
    <section
      id="farm"
      className="border-t border-line py-24 px-6 md:px-10"
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
        </div>

        {/* Row 2: milestones */}
        <div className="mt-12 pt-10 border-t border-line">
          <p className="font-mono text-meta uppercase text-ink-3 mb-6">
            Milestones
          </p>
          <ol className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {MILESTONES.map((m) => (
              <li
                key={m.year}
                className={`pt-2 border-t-[1.5px] ${
                  m.accent ? "border-accent" : "border-line"
                }`}
              >
                <p
                  className={`font-serif italic text-[22px] leading-tight ${
                    m.accent ? "text-accent" : "text-ink"
                  }`}
                >
                  {m.year}
                </p>
                <p className="mt-1 font-sans text-[11px] leading-snug text-ink-2">
                  {m.title}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
