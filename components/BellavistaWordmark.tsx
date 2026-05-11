interface Props {
  variant?: "horizontal";
  theme?: "onyx" | "paper";
  showTagline?: boolean;
  wordmarkSize?: number;
  className?: string;
}

const THEME = {
  onyx: {
    stroke: "var(--ink)",
    fillOpacity: 0.06,
    accent: "var(--accent-2)",
    wordmark: "var(--ink)",
    italic: "var(--accent-2)",
    coffeeFarm: "var(--accent-2)",
    tagline: "var(--ink-3)",
    divider: "var(--line)",
  },
  paper: {
    stroke: "var(--ink-on-paper)",
    fillOpacity: 0.06,
    accent: "var(--accent-on-paper)",
    wordmark: "var(--ink-on-paper)",
    italic: "var(--accent-on-paper)",
    coffeeFarm: "var(--accent-on-paper)",
    tagline: "var(--ink-on-paper-3)",
    divider: "var(--line-on-paper)",
  },
} as const;

function RidgeMark({
  size,
  stroke,
  fillOpacity,
  accent,
}: {
  size: number;
  stroke: string;
  fillOpacity: number;
  accent: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path
        d="M8 75 L34 42 L50 58 L70 28 L92 75 Z"
        fill={stroke}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={2}
      />
      <path
        d="M8 75 L34 42 L50 58 L70 28 L92 75"
        stroke={stroke}
        strokeWidth={2}
      />
      <circle cx={70} cy={18} r={2.4} fill={accent} stroke="none" />
      <path d="M8 84 L92 84" stroke={accent} strokeWidth={1.2} />
    </svg>
  );
}

export default function BellavistaWordmark({
  variant = "horizontal",
  theme = "onyx",
  showTagline = false,
  wordmarkSize = 160,
  className,
}: Props) {
  const t = THEME[theme];
  const gap = Math.round(wordmarkSize * 0.3);
  const coffeeFarmSize = Math.max(9, Math.round(wordmarkSize * 0.11));
  const coffeeFarmSpacing = `${(wordmarkSize * 0.003).toFixed(2)}em`;
  const taglineSize = Math.max(8, Math.round(wordmarkSize * 0.08));
  const taglineMargin = Math.round(wordmarkSize * 0.1);

  if (variant === "horizontal") {
    return (
      <div
        className={className}
        style={{ display: "flex", alignItems: "center", gap }}
      >
        <RidgeMark
          size={wordmarkSize}
          stroke={t.stroke}
          fillOpacity={t.fillOpacity}
          accent={t.accent}
        />

        <div
          style={{
            width: 1,
            alignSelf: "stretch",
            background: t.divider,
          }}
        />

        <div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: wordmarkSize,
              lineHeight: 0.94,
              letterSpacing: "-0.025em",
              color: t.wordmark,
              whiteSpace: "nowrap",
            }}
          >
            Bella<em style={{ fontStyle: "italic", color: t.italic }}>vista</em>
          </div>

          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: coffeeFarmSize,
              letterSpacing: coffeeFarmSpacing,
              textTransform: "uppercase" as const,
              color: t.coffeeFarm,
              textAlign: "center" as const,
              marginTop: Math.round(wordmarkSize * 0.11),
            }}
          >
            Coffee Farm
          </div>

          {showTagline && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: taglineSize,
                letterSpacing: "0.32em",
                textTransform: "uppercase" as const,
                color: t.tagline,
                textAlign: "center" as const,
                marginTop: taglineMargin,
              }}
            >
              Stay &middot; Pause &middot; Contemplate
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
