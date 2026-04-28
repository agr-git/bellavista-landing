/**
 * FarmMap — schematic topographic map of the farm.
 *
 * Not a real geo map; an editorial abstraction:
 * - 6 contour lines (soft curves at varying Y, low opacity)
 * - 1 accent-2 stroke = the main ridge trail
 * - 3 plot markers (LA VEGA, EL BOSQUE, LA CUMBRE) — 68×48 rectangles
 *   with 1.5px ink border, accent @ 20% alpha fill, numbered pill.
 * - Annotation top-right: "click plot → chapter"
 *
 * Clicking a plot marker scrolls to the corresponding chapter section.
 * Pure SVG; no JS state. Container height is 260px per spec.
 */

"use client";

const PLOTS = [
  { n: 1, label: "VILLA PAULA", x: 120, y: 172, href: "#villa-paula" },
  { n: 2, label: "BAMBU STREAM", x: 300, y: 128, href: "#bambu-stream" },
  { n: 3, label: "TERRA PRETA", x: 470, y: 74, href: "#terra-preta" },
];

export default function FarmMap() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="relative w-full bg-surface border border-line overflow-hidden"
      style={{ height: 260 }}
      aria-label="Schematic farm map with three plot markers"
    >
      {/* annotation */}
      <span className="absolute top-3 right-4 font-mono text-meta italic text-accent-2 pointer-events-none">
        click plot → chapter
      </span>

      <svg
        viewBox="0 0 600 260"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        {/* 6 contour lines, soft curves */}
        <g
          fill="none"
          stroke="var(--ink-3)"
          strokeOpacity="0.25"
          strokeWidth="1"
        >
          <path d="M-20 60 C 120 40, 280 90, 620 40" />
          <path d="M-20 100 C 140 80, 300 130, 620 80" />
          <path d="M-20 140 C 160 118, 320 170, 620 120" />
          <path d="M-20 180 C 180 158, 340 210, 620 160" />
          <path d="M-20 220 C 200 200, 360 248, 620 208" />
          <path d="M-20 248 C 220 232, 380 276, 620 244" />
        </g>

        {/* ridge trail, accent-2 */}
        <path
          d="M-10 212 C 160 186, 320 238, 610 198"
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth="1.5"
          strokeOpacity="0.9"
        />

        {/* plot markers */}
        {PLOTS.map((p) => (
          <g
            key={p.n}
            role="button"
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onClick={() => scrollTo(p.href)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                scrollTo(p.href);
              }
            }}
            aria-label={`Jump to plot ${p.label}`}
          >
            {/* rectangle */}
            <rect
              x={p.x - 34}
              y={p.y - 24}
              width={68}
              height={48}
              fill="var(--accent)"
              fillOpacity="0.2"
              stroke="var(--ink)"
              strokeWidth="1.5"
            />
            {/* number pill */}
            <rect
              x={p.x - 9}
              y={p.y - 9}
              width={18}
              height={18}
              rx={9}
              fill="var(--accent-2)"
            />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fill="var(--bg)"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              {p.n}
            </text>
            {/* label below */}
            <text
              x={p.x}
              y={p.y + 38}
              textAnchor="middle"
              fill="var(--ink-2)"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "8px",
                letterSpacing: "0.15em",
              }}
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
