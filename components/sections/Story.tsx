/**
 * Story — Chapter 01 · The Producer.
 *
 * Layout: 3-col [80px | 1fr | 300px] on desktop, stacks on mobile.
 * - Col 1: CHAPTER meta + big "01" numeral in accent serif.
 * - Col 2: h2 "The producer." with italic accent-2 on "producer",
 *          drop cap "I" (72px Instrument Serif italic accent) floated
 *          beside first paragraph, 3 short body paragraphs.
 * - Col 3: Portrait placeholder (4:5) + italic figcaption, then a
 *          Previously card (1px line border) with "Software engineer,
 *          12 years." in italic serif.
 *
 * Image is a placeholder gradient until real portrait ships.
 */

export default function Story() {
  return (
    <section
      id="story"
      className="theme-cream border-t border-line py-24 px-6 md:px-10"
      aria-labelledby="story-heading"
    >
      <div className="max-w-[1280px] mx-auto grid gap-8 md:gap-[30px] md:grid-cols-[80px_1fr_300px]">
        {/* Col 1: chapter marker */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-meta uppercase text-ink-3">
            Chapter
          </span>
          <span className="font-serif text-[64px] leading-none text-accent">
            01
          </span>
        </div>

        {/* Col 2: headline + body */}
        <div className="max-w-[620px]">
          <h2
            id="story-heading"
            className="font-serif text-h2 leading-[1] text-ink text-balance"
          >
            The{" "}
            <em className="italic text-accent-2">producer</em>.
          </h2>

          <div className="mt-8 space-y-5 font-sans text-body text-ink-2 leading-relaxed">
            <p>
              <span
                className="float-left font-serif italic text-accent mr-3 -mt-1 leading-[0.9]"
                style={{ fontSize: "72px" }}
                aria-hidden
              >
                I
              </span>
              spent twelve years writing software before I started writing
              pick plans. The first Caturra row went in the ground in 2021,
              on a ridge above Manizales that I had only visited as a kid.
              The farm was small, the slope was mean, and the learning
              curve was the steepest thing on the property.
            </p>
            <p>
              What kept me here wasn&apos;t romance — it was the feedback
              loop. Cherry ripens, you pick it, you process it, you cup
              it. The results are six months later and deeply honest.
              Nothing about coffee tolerates handwaving.
            </p>
            <p>
              The site you&apos;re reading is the field log. Drone footage
              from the plots, notes from the beneficio, and every batch we
              ship — published in public and in private, depending on
              what&apos;s mine to share.
            </p>
          </div>
        </div>

        {/* Col 3: portrait + previously card */}
        <aside className="space-y-4">
          <figure className="space-y-2">
            <div
              className="w-full aspect-[4/5] bg-surface border border-line"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(232,155,74,0.18) 0%, rgba(36,48,73,1) 60%)",
              }}
              aria-label="Portrait placeholder — producer among first Caturra rows, 2021"
              role="img"
            />
            <figcaption className="font-serif italic text-small text-ink-3">
              Fig 1. Among the first Caturra rows, 2021.
            </figcaption>
          </figure>

          <div className="border border-line p-3 space-y-2">
            <p className="font-mono text-meta uppercase text-ink-3">
              Previously
            </p>
            <p className="font-serif italic text-h4 leading-tight text-ink">
              Software engineer, 12 years.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
