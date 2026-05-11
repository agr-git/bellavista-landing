"use client";

/**
 * Stay — Chapter 05 · "Sleep at Bellavista."
 *
 * Header: h2 + Week/Weekend toggle (drives the StayInquiryForm preset).
 * Body: 6-col × 3-row bento grid (8px gaps).
 *   col 1-4 row 1-2  → hero porch photo
 *   col 5-6 row 1    → guest bedroom
 *   col 5-6 row 2    → kitchen garden
 *   col 1-2 row 3    → sunrise / ridge view
 *   col 3-4 row 3    → second living shot
 *   col 5-6 row 3    → price card (dashed border, "Check dates")
 *
 * Imagery (BRAND_V2 · 2026-05-10): real photography from
 *   /public/media/stay/stay-{01,06,11,16,20}.jpg
 * The v2 onyx gradient still renders underneath each cell as a
 * load-time fallback. To swap which photo goes in which cell, edit
 * the `image` field on the CELLS entry below.
 */

import Image from "next/image";
import { useState } from "react";
import Modal from "../Modal";
import StayInquiryForm, { StayPreset } from "../forms/StayInquiryForm";

type Cell = {
  label: string;
  /** Tailwind grid col/row classes — desktop only */
  classes: string;
  /** Gradient to suggest subject (also acts as load fallback) */
  bg: string;
  /** Public path to the photo for this cell */
  image: string;
  /** Object-position hint when the photo crops oddly in its cell */
  position?: string;
};

const CELLS: Cell[] = [
  {
    label: "Porch, sunrise",
    classes: "md:col-span-4 md:row-span-2",
    bg: "linear-gradient(135deg, rgba(232,155,74,0.18), rgba(26,26,23,1) 70%)",
    image: "/media/stay/stay-01.jpg",
    position: "center",
  },
  {
    label: "Guest suite",
    classes: "md:col-span-2 md:row-span-1",
    bg: "linear-gradient(135deg, rgba(245,201,138,0.15), rgba(26,26,23,1) 70%)",
    image: "/media/stay/stay-06.jpg",
  },
  {
    label: "Kitchen",
    classes: "md:col-span-2 md:row-span-1",
    bg: "linear-gradient(135deg, rgba(232,155,74,0.12), rgba(12,12,10,1) 70%)",
    image: "/media/stay/stay-11.jpg",
  },
  {
    label: "Ridge at first light",
    classes: "md:col-span-2 md:row-span-1",
    bg: "linear-gradient(135deg, rgba(245,201,138,0.22), rgba(26,26,23,1) 70%)",
    image: "/media/stay/stay-16.jpg",
  },
  {
    label: "From the farmhouse",
    classes: "md:col-span-2 md:row-span-1",
    bg: "linear-gradient(135deg, rgba(232,155,74,0.16), rgba(12,12,10,1) 70%)",
    image: "/media/stay/stay-20.jpg",
  },
];

export default function Stay() {
  const [preset, setPreset] = useState<StayPreset>("weekend");
  const [open, setOpen] = useState(false);

  return (
    <section
      id="stay"
      className="theme-dark border-t border-line py-24 px-6 md:px-10"
      aria-labelledby="stay-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <h2
            id="stay-heading"
            className="font-serif text-h2 leading-[1] text-ink text-balance"
          >
            Sleep at <em className="italic text-accent-2">Bellavista.</em>
          </h2>

          <div
            role="tablist"
            aria-label="Stay duration"
            className="flex items-center border border-line p-[2px]"
          >
            {(["week", "weekend"] as StayPreset[]).map((p) => {
              const active = preset === p;
              return (
                <button
                  key={p}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPreset(p)}
                  className={`font-mono text-meta uppercase px-3 py-2 transition-colors ${
                    active
                      ? "bg-accent text-bg"
                      : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 md:grid-rows-3 gap-2 auto-rows-[140px] md:auto-rows-[180px]">
          {CELLS.map((c, idx) => (
            <div
              key={c.label}
              className={`relative overflow-hidden bg-surface border border-line ${c.classes}`}
              style={{ backgroundImage: c.bg }}
              aria-label={c.label}
            >
              {/* Photo (next/image fill); gradient above acts as load fallback. */}
              <Image
                src={c.image}
                alt={c.label}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={idx === 0}
                className="object-cover"
                style={{ objectPosition: c.position ?? "center" }}
              />
              {/* Bottom-left scrim so the label stays legible over photography. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 0%, rgba(12,12,10,0.7) 100%)",
                }}
              />
              <span className="absolute bottom-2 left-3 font-mono text-meta uppercase text-ink z-10">
                {c.label}
              </span>
            </div>
          ))}

          {/* Price card */}
          <div
            className="md:col-span-2 md:row-span-1 border border-dashed p-4 flex flex-col justify-between bg-surface"
            style={{ borderColor: "var(--line-strong)" }}
          >
            <div>
              <p className="font-mono text-meta uppercase text-ink-3">From</p>
              <p className="font-serif italic text-[34px] leading-tight text-accent-2 mt-1">
                $150 USD/night
              </p>
              <p className="font-sans text-[11px] leading-snug text-ink-2 mt-2">
                Fully equipped kitchen, Starlink Wi-Fi, big working desk
              </p>
              <p className="font-mono text-[10px] uppercase text-ink-3 mt-2 leading-snug tracking-[0.1em]">
                Extra · Farm tour, roasting experience, bird watching
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 w-full font-mono text-meta uppercase bg-paper text-bg px-3 py-2 hover:bg-accent-2 transition-colors"
            >
              Check dates ↗
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Book the farmhouse · ${preset}`}
      >
        <StayInquiryForm preset={preset} onSubmitted={() => setOpen(false)} />
      </Modal>
    </section>
  );
}
