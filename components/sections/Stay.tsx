"use client";

/**
 * Stay — Chapter 05 · "Sleep at Bellavista."
 *
 * Header: h2 + Week/Weekend toggle (drives the StayInquiryForm preset).
 * Body: 6-col × 3-row bento grid (8px gaps).
 *   col 1-4 row 1-2  → hero porch photo
 *   col 5-6 row 1    → guest bedroom
 *   col 5-6 row 2    → kitchen garden
 *   col 1-2 row 3    → sunrise
 *   col 3-4 row 3    → house tour video
 *   col 5-6 row 3    → price card (dashed border, "Check dates")
 *
 * Photos are token-driven gradient placeholders until real photography
 * lands (per handoff, imagery is the one ❌ in fidelity).
 */

import { useState } from "react";
import Modal from "../Modal";
import StayInquiryForm, { StayPreset } from "../forms/StayInquiryForm";

type Cell = {
  label: string;
  /** Tailwind grid col/row classes — desktop only */
  classes: string;
  /** Gradient to suggest subject */
  bg: string;
};

const CELLS: Cell[] = [
  {
    label: "Porch, sunrise",
    classes: "md:col-span-4 md:row-span-2",
    bg: "linear-gradient(135deg, rgba(232,155,74,0.25), rgba(36,48,73,1) 70%)",
  },
  {
    label: "Guest bedroom",
    classes: "md:col-span-2 md:row-span-1",
    bg: "linear-gradient(135deg, rgba(245,201,138,0.2), rgba(36,48,73,1) 70%)",
  },
  {
    label: "Kitchen garden",
    classes: "md:col-span-2 md:row-span-1",
    bg: "linear-gradient(135deg, rgba(232,155,74,0.15), rgba(27,36,55,1) 70%)",
  },
  {
    label: "Sunrise ridge",
    classes: "md:col-span-2 md:row-span-1",
    bg: "linear-gradient(135deg, rgba(245,201,138,0.28), rgba(36,48,73,1) 70%)",
  },
  {
    label: "House tour · 1:32",
    classes: "md:col-span-2 md:row-span-1",
    bg: "linear-gradient(135deg, rgba(232,155,74,0.2), rgba(27,36,55,1) 70%)",
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
          {CELLS.map((c) => (
            <div
              key={c.label}
              className={`relative overflow-hidden bg-surface border border-line ${c.classes}`}
              style={{ backgroundImage: c.bg }}
              aria-label={c.label}
            >
              <span className="absolute bottom-2 left-3 font-mono text-meta uppercase text-ink-3">
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
                $ / night
              </p>
              <p className="font-sans text-[11px] leading-snug text-ink-2 mt-2">
                All meals + farm tour included.
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
