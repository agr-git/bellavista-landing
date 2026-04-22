import type { Config } from "tailwindcss";

/**
 * Tailwind consumes design tokens from app/styles/tokens.css via CSS vars.
 * Edit visual values in tokens.css, NOT here. See docs/decisions/ADR-002.
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        paper: "var(--paper)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          2: "var(--accent-2)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        h1: ["var(--fs-h1)", { lineHeight: "var(--lh-h1)", letterSpacing: "var(--ls-h1)" }],
        h2: ["var(--fs-h2)", { lineHeight: "var(--lh-h2)", letterSpacing: "var(--ls-h2)" }],
        h3: ["var(--fs-h3)", { lineHeight: "var(--lh-h3)", letterSpacing: "var(--ls-h3)" }],
        h4: ["var(--fs-h4)", { lineHeight: "var(--lh-h4)", letterSpacing: "var(--ls-h4)" }],
        body: ["var(--fs-body)", { lineHeight: "var(--lh-body)" }],
        small: ["var(--fs-small)", { lineHeight: "var(--lh-small)" }],
        label: ["var(--fs-label)", { lineHeight: "var(--lh-label)", letterSpacing: "var(--ls-label)" }],
        meta: ["var(--fs-meta)", { lineHeight: "var(--lh-meta)", letterSpacing: "var(--ls-meta)" }],
      },
      spacing: {
        1: "var(--s-1)",
        2: "var(--s-2)",
        3: "var(--s-3)",
        4: "var(--s-4)",
        5: "var(--s-5)",
        6: "var(--s-6)",
        8: "var(--s-8)",
        10: "var(--s-10)",
        14: "var(--s-14)",
        20: "var(--s-20)",
        30: "var(--s-30)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      boxShadow: {
        elev: "var(--shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
