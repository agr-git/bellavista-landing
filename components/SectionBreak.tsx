/**
 * SectionBreak — thin horizontal stripe placed between sections to give
 * the eye a clean visual cut without leaning on the giant 250vh
 * scrolly-chapter spill.
 *
 * Two variants are exposed so we can A/B compare in-place:
 *   - "blue":  dark-theme bg (#1b2437)  → matches scrolly chapter palette
 *   - "cream": cream-theme bg (#fef5e2) → matches Story / Coffee / Journal
 *
 * Height intentionally short (24px) so the break reads as a punctuation
 * mark rather than a section of its own.
 */

type Variant = "blue" | "cream";

const PALETTE: Record<Variant, string> = {
  blue: "#1b2437",
  cream: "#fef5e2",
};

export default function SectionBreak({ variant }: { variant: Variant }) {
  return (
    <div
      aria-hidden
      className="w-full"
      style={{ height: 24, backgroundColor: PALETTE[variant] }}
    />
  );
}
