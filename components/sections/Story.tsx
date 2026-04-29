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
            <figcaption className="font-serif italic text-center pt-1">
              <a
                href="https://www.linkedin.com/in/alejandrogilrivera/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
                style={{ color: "#0A66C2", fontSize: "16px" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Alejo Gil · LinkedIn
              </a>
            </figcaption>
          </figure>

          <div className="border border-line p-3 space-y-2">
            <p
              className="font-mono uppercase tracking-[0.12em]"
              style={{ color: "#0A66C2", fontSize: "13px" }}
            >
              Previously
            </p>
            <p className="font-serif italic text-h4 leading-snug text-ink">
              Tech Project Manager : 8 years
              <br />
              USA → France → Brasil → to...
              <br />
              back home : Manizales
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
