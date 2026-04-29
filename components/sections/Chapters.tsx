/**
 * Chapters — the three plot scrollies, rendered in order:
 *   02 · VILLA PAULA  → #villa-paula
 *   03 · BAMBU STREAM → #bambu-stream
 *   04 · TERRA PRETA  → #terra-preta
 *
 * Plot copy lands from /docs/content-authoring/chapter-{slug}/production.md.
 */

import ChapterScrolly from "./ChapterScrolly";
import SectionBreak from "../SectionBreak";

export default function Chapters() {
  return (
    <>
      <ChapterScrolly
        id="villa-paula"
        chapterNumber="02"
        plot="VILLA PAULA"
        headline={
          <>
            Castillo on the flat,
            <br />
            <em className="italic text-accent-2">pruned and re-spaced.</em>
          </>
        }
        body={[
          "Villa Paula is the lowest and flattest of all of the plots. The name was given by my parents after my sister was born — family. This is where we've learned roya, weeding, and how to lose a row or two to poor water drainage maintenance before we knew what we were watching.",
          "3.8 ha of Castillo. In 2026 we pruned the half-block hard and re-set the distancing — closer plants, wider rows. The other half rolls into the next cycle. A cleaner architecture for a more efficient operation.",
          "Washed process. The cup leans chocolate, brown sugar, clean finish. Castillo will not headline a flavor competition, but it will not let you down — and on this plot, with this work, that's the right contract.",
          "If something goes wrong here, it shows up in the cup eight months later. We log every variable so the next year is a slightly less stupid version of this one.",
        ]}
        stats={[
          { label: "Alt", value: "1,200 m" },
          { label: "Area", value: "3.8 ha" },
          { label: "Year", value: "2026" },
        ]}
        pins={[
          { n: 1, xPct: 30, yPct: 40, label: "main castillo block" },
          { n: 2, xPct: 68, yPct: 62, label: "new distance station" },
        ]}
        videoSrc="/media/villa-paula.mp4"
        pageLabel="02 / 05"
      />

      <SectionBreak variant="cream" />

      <ChapterScrolly
        id="bambu-stream"
        chapterNumber="03"
        plot="BAMBU STREAM"
        headline={
          <>
            Pink Bourbon between
            <br />
            <em className="italic text-accent-2">bamboo and water.</em>
          </>
        }
        body={[
          "The plot sits on the east-facing slope where the morning sunrise first shows. A bamboo stand runs the upper and lower edge; a quebrada cuts the lower one. The plot is named for both.",
          "Pink Bourbon went in here in 2026. Small lot, uneven slope — the kind of row that forces a pick plan instead of a timetable.",
          "The cup will show it once the trees mature: jasmine on the nose, a thin line of bergamot, cane sugar underneath. We'll find out after the first harvest.",
          "This is the block we're betting on for the next export selection. Every year we'll cup it before we let ourselves cup the others — assuming, of course, that everything between now and the first cherry goes to plan.",
        ]}
        stats={[
          { label: "Alt", value: "1,290 m" },
          { label: "Area", value: "1 ha" },
          { label: "Year", value: "2026" },
        ]}
        pins={[
          { n: 1, xPct: 26, yPct: 34, label: "pink bourbon block" },
          { n: 2, xPct: 62, yPct: 58, label: "bamboo + quebrada edge" },
        ]}
        videoSrc="/media/bambu-stream.mp4"
        pageLabel="03 / 05"
      />

      <SectionBreak variant="blue-gradient" />

      <ChapterScrolly
        id="terra-preta"
        chapterNumber="04"
        plot="TERRA PRETA"
        headline={
          <>
            Cenicafé 1 at the top,
            <br />
            <em className="italic text-accent-2">trying to build soil.</em>
          </>
        }
        body={[
          "The best soil. Dark, soft, nutritious — and weed-diverse. Slightly steep. Plantain is a great neighbor. Coffee loves the relationship.",
          "A Cenicafé 1 block went in the ground in 2025. In another plot Cenicafé was a disaster. In this one, a champion — bred for resilience and balanced flavors. The interesting question on this plot is whether the soil can do for the cup what the variety, on its own, won't.",
          "We name this plot for what we're trying to do, not what we've done. Biochar trials. Weed variety. Microorganisms. The first year of amendments is in the soil; the second will be mixed. We're trying to build and maintain soil, not just grow on it.",
          "Most of what we learn on this ridge ends up shaping how we treat the two lower plots. Lab more than field. Lots to learn.",
        ]}
        stats={[
          { label: "Alt", value: "1,300 m" },
          { label: "Area", value: "0.3 ha" },
          { label: "Year", value: "2025" },
        ]}
        pins={[
          { n: 1, xPct: 34, yPct: 44, label: "cenicafé 1 block" },
          { n: 2, xPct: 70, yPct: 30, label: "biochar + microorganisms" },
        ]}
        videoSrc="/media/terra-preta.mp4"
        pageLabel="04 / 05"
      />
    </>
  );
}
