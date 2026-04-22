/**
 * Dev-only isolation lab for ChapterScrolly.
 *
 * Route: /scrolly (inside the (dev) route group, so no URL prefix).
 * This whole folder is deleted wholesale in S1 before production.
 *
 * Use this page to test iOS Safari sticky behavior, progress bar
 * accuracy, and pin interaction without the surrounding page noise.
 */

import ChapterScrolly from "@/components/sections/ChapterScrolly";

export default function ScrollyLab() {
  return (
    <main className="min-h-screen bg-bg">
      {/* top spacer so you can see the entrance */}
      <div className="h-screen flex items-center justify-center px-10">
        <p className="font-mono text-meta uppercase text-ink-3 text-center">
          Lab · Scroll down to test pin-and-progress. <br />
          Validate on Chrome, iOS Safari, Android Chrome before integrating.
        </p>
      </div>

      <ChapterScrolly
        id="lab-chapter"
        chapterNumber="03"
        plot="EL BOSQUE"
        headline={
          <>
            Pink Bourbon,
            <br />
            <em className="italic text-accent-2">under guamo shade.</em>
          </>
        }
        body={[
          "The middle plot sits on a north-facing slope where morning fog holds until nine and the guamos keep the canopy honest.",
          "We planted Pink Bourbon here in 2021. Small lot, uneven slope, the kind of row that forces a pick plan instead of a timetable.",
          "The cup shows it — jasmine on the nose, a thin line of bergamot, cane sugar underneath.",
          "Processed washed in the beneficio downstream. This block is the backbone of the export selection.",
        ]}
        stats={[
          { label: "Alt", value: "1,420 m" },
          { label: "Area", value: "0.9 ha" },
          { label: "Year", value: "2021" },
        ]}
        pins={[
          { n: 1, xPct: 26, yPct: 34, label: "seedling row" },
          { n: 2, xPct: 62, yPct: 58, label: "guamo shade" },
        ]}
        pageLabel="03 / 05"
      />

      {/* bottom spacer so you can exit cleanly */}
      <div className="h-screen flex items-center justify-center px-10">
        <p className="font-mono text-meta uppercase text-ink-3">
          End of lab — progress bar should read 100%
        </p>
      </div>
    </main>
  );
}
