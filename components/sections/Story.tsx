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
 */

import Image from "next/image";

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
              spent eight years managing all type of projects in industries I never thought I was going to work with: Auto, tech, NGO, consulting… All of which gave a set of skill I wouldn&apos;t be able to connect in a single project, up until Bellavista Coffee arrived. My first row of Cenicafé 1 went in the ground in 2024, on a ridge above Manizales I had only visited as a kid. The farm was not too small not too big, the slope was mean, and the learning curve was the steepest thing on the property.
            </p>
            <p>
              What kept me here wasn&apos;t romance — it was the feedback loop. Cherry ripens, you pick it, you process it, you cup it. The result lands eight months later and is deeply honest. Nothing about coffee tolerates handwaving.
            </p>
            <p>
              This site is the field log. Drone footage from each plot, notes from the beneficio, and every batch we ship — published in public and in private, depending on what&apos;s mine to share.
            </p>
          </div>
        </div>

        {/* Col 3: portrait + previously card */}
        <aside className="space-y-4">
          <figure className="space-y-2">
            <div className="relative w-full aspect-[4/5] bg-surface border border-line overflow-hidden">
              <Image
                src="/media/portrait-producer.jpg"
                alt="The producer among the first Cenicafé 1 rows, 2024."
                fill
                sizes="(min-width: 768px) 300px, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="font-serif italic text-small text-ink-3">
              <a
                href="https://www.linkedin.com/in/alejandrogilrivera/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-2 transition-colors"
              >
                Alejo Gil
              </a>
            </figcaption>
          </figure>

          <div className="border border-line p-3 space-y-2">
            <p className="font-mono text-meta uppercase text-ink-3">
              Previously
            </p>
            <p className="font-serif italic text-h4 leading-tight text-ink">
              Project Manager · 8 years · USA → France → Medellín → Manizales.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
