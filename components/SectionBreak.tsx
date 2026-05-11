/**
 * SectionBreak — thin horizontal stripe placed between sections to give
 * the eye a clean visual cut without leaning on the giant 250vh
 * scrolly-chapter spill.
 *
 * Variants (v2 · Onyx + Paper):
 *   - "onyx":          dark-theme bg (#0c0c0a)  → matches scrolly chapter palette
 *   - "paper":         cream-theme bg (#f6efd9) → matches Story / Coffee / Journal
 *   - "onyx-gradient": warm-graphite gradient on onyx
 *
 * Legacy v1 aliases ("blue", "cream", "blue-gradient") are preserved
 * so callers keep working through the migration.
 *
 * Height intentionally short (12px) so the break reads as a punctuation
 * mark rather than a section of its own.
 */

type Variant =
  | "onyx"
  | "paper"
  | "onyx-gradient"
  | "blue"          // legacy v1 alias → onyx
  | "cream"         // legacy v1 alias → paper
  | "blue-gradient"; // legacy v1 alias → onyx-gradient

const STYLES: Record<Variant, React.CSSProperties> = {
  onyx: { backgroundColor: "#0c0c0a" },
  paper: { backgroundColor: "#f6efd9" },
  "onyx-gradient": {
    backgroundImage:
      "linear-gradient(90deg, #0c0c0a 0%, #1a1a17 50%, #0c0c0a 100%)",
  },
  // Legacy aliases — same colors, kept so existing JSX doesn't break
  blue: { backgroundColor: "#0c0c0a" },
  cream: { backgroundColor: "#f6efd9" },
  "blue-gradient": {
    backgroundImage:
      "linear-gradient(90deg, #0c0c0a 0%, #1a1a17 50%, #0c0c0a 100%)",
  },
};

export default function SectionBreak({ variant }: { variant: Variant }) {
  return (
    <div
      aria-hidden
      className="w-full"
      style={{ height: 12, ...STYLES[variant] }}
    />
  );
}
