/**
 * Chapters — the three plot scrollies, rendered in order:
 *   02 · LA VEGA   → #la-vega
 *   03 · EL BOSQUE → #el-bosque
 *   04 · LA CUMBRE → #la-cumbre
 *
 * Kept as a single composed component so app/page.tsx stays tidy.
 * Plot copy is stubbed from the handoff; tuned for rhythm, not final.
 * Videos will drop in post-ship at /media/<plot>.mp4.
 */

import ChapterScrolly from "./ChapterScrolly";

export default function Chapters() {
  return (
    <>
      <ChapterScrolly
        id="la-vega"
        chapterNumber="02"
        plot="LA VEGA"
        headline={
          <>
            Caturra on the flat,
            <br />
            <em className="italic text-accent-2">where we started.</em>
          </>
        }
        body={[
          "La Vega is the lowest and flattest of the three plots — the block that taught us pruning, fertilization, and how to lose a row to borers.",
          "Two hectares of Caturra, planted 2021. Sun exposure is generous, which is both a gift and a problem on hot years.",
          "Washed process; the cup leans chocolate and brown sugar with a clean finish. It's our B2B workhorse.",
          "Yield here pays for the experiments elsewhere on the farm.",
        ]}
        stats={[
          { label: "Alt", value: "1,300 m" },
          { label: "Area", value: "2.0 ha" },
          { label: "Year", value: "2021" },
        ]}
        pins={[
          { n: 1, xPct: 30, yPct: 40, label: "main Caturra block" },
          { n: 2, xPct: 68, yPct: 62, label: "compost station" },
        ]}
        videoSrc="/media/la-vega.mp4"
        pageLabel="02 / 05"
      />

      <ChapterScrolly
        id="el-bosque"
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
        videoSrc="/media/el-bosque.mp4"
        pageLabel="03 / 05"
      />

      <ChapterScrolly
        id="la-cumbre"
        chapterNumber="04"
        plot="LA CUMBRE"
        headline={
          <>
            Gesha at the top,
            <br />
            <em className="italic text-accent-2">with the wind.</em>
          </>
        }
        body={[
          "The highest plot — steep, cold at night, and slow. Coffee loves slow.",
          "A small Gesha block went in the ground in 2022. It's still finding its voice in the cup, but the structure is already telling.",
          "We experiment here: anaerobic, carbonic, honey. Lab more than field.",
          "Most of what we learn on this ridge ends up shaping how we treat the two lower plots.",
        ]}
        stats={[
          { label: "Alt", value: "1,560 m" },
          { label: "Area", value: "1.3 ha" },
          { label: "Year", value: "2022" },
        ]}
        pins={[
          { n: 1, xPct: 34, yPct: 44, label: "Gesha block" },
          { n: 2, xPct: 70, yPct: 30, label: "exposed edge" },
        ]}
        videoSrc="/media/la-cumbre.mp4"
        pageLabel="04 / 05"
      />
    </>
  );
}
