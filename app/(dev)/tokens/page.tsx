/**
 * Design token test page — route: /tokens
 * Lives in the (dev) route group. Delete the whole app/(dev)/ tree before
 * production (see S1_LIVE in PLAN.md).
 * Verifies: every color + every type role + spacing scale resolve from tokens.css.
 */

export default function TestTokens() {
  const colors = [
    { name: "bg", className: "bg-bg", hint: "Page background" },
    { name: "surface", className: "bg-surface", hint: "Elevated cards" },
    { name: "paper", className: "bg-paper", hint: "Light contrast" },
    { name: "accent", className: "bg-accent", hint: "CTAs, active chapter" },
    { name: "accent-2", className: "bg-accent-2", hint: "Italic serif highlights" },
  ];

  const inkSwatches = [
    { name: "ink", className: "text-ink" },
    { name: "ink-2", className: "text-ink-2" },
    { name: "ink-3", className: "text-ink-3" },
  ];

  const spacing = [
    { name: "s-1", value: "4px" },
    { name: "s-2", value: "8px" },
    { name: "s-3", value: "12px" },
    { name: "s-4", value: "16px" },
    { name: "s-5", value: "20px" },
    { name: "s-6", value: "24px" },
    { name: "s-8", value: "32px" },
    { name: "s-10", value: "40px" },
    { name: "s-14", value: "56px" },
    { name: "s-20", value: "80px" },
    { name: "s-30", value: "120px" },
  ];

  return (
    <main className="min-h-screen bg-bg text-ink p-10 space-y-14">
      {/* ------- Header ------- */}
      <header className="border-b border-line pb-6">
        <p className="font-mono text-meta text-ink-3 uppercase">
          /app/(dev)/tokens/page.tsx · B2 token sanity
        </p>
        <h1 className="font-serif text-h1 mt-2">
          Design <em className="text-accent-2">tokens</em>.
        </h1>
        <p className="font-sans text-body text-ink-2 mt-3 max-w-lg">
          If every color, type role, and spacing below renders correctly, the CSS
          var ↔ Tailwind bridge is live. Edit <code>app/styles/tokens.css</code>;
          everything should update in place.
        </p>
      </header>

      {/* ------- Type scale ------- */}
      <section className="space-y-6">
        <h2 className="font-mono text-label text-accent uppercase">
          Type scale (serif + sans + mono)
        </h2>
        <div className="space-y-5">
          <p className="font-serif text-h1">
            h1 · <em className="text-accent-2">Instrument Serif</em>
          </p>
          <p className="font-serif text-h2">
            h2 · Instrument <em className="text-accent-2">Serif</em>
          </p>
          <p className="font-serif text-h3">h3 · Instrument Serif 36px</p>
          <p className="font-serif text-h4">h4 · Instrument Serif 24px</p>
          <p className="font-sans text-body text-ink-2">
            body · Geist 14px. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="font-sans text-small text-ink-3">
            small · Geist 12px · secondary copy.
          </p>
          <p className="font-mono text-label uppercase text-ink-2">
            label · JetBrains Mono 10px · 0.2em tracking
          </p>
          <p className="font-mono text-meta uppercase text-ink-3">
            meta · JetBrains Mono 9px · 0.15em tracking
          </p>
        </div>
      </section>

      {/* ------- Color swatches ------- */}
      <section className="space-y-6">
        <h2 className="font-mono text-label text-accent uppercase">Color swatches</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {colors.map((c) => (
            <div
              key={c.name}
              className={`${c.className} rounded h-24 border border-line-strong p-3 flex flex-col justify-between`}
            >
              <span className="font-mono text-meta uppercase text-bg/80 mix-blend-difference">
                {c.name}
              </span>
              <span className="font-mono text-meta uppercase text-bg/80 mix-blend-difference">
                {c.hint}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-6 pt-2">
          {inkSwatches.map((s) => (
            <p key={s.name} className={`font-sans text-body ${s.className}`}>
              ink · <span className="font-mono text-label">{s.name}</span> · foreground
            </p>
          ))}
        </div>
      </section>

      {/* ------- Spacing scale ------- */}
      <section className="space-y-6">
        <h2 className="font-mono text-label text-accent uppercase">Spacing scale (4pt)</h2>
        <div className="space-y-2">
          {spacing.map((s) => (
            <div key={s.name} className="flex items-center gap-4">
              <span className="font-mono text-meta uppercase text-ink-3 w-16">
                {s.name}
              </span>
              <span
                className="bg-accent h-2 rounded"
                style={{ width: s.value }}
                aria-hidden
              />
              <span className="font-mono text-small text-ink-2">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ------- Radius + shadow ------- */}
      <section className="space-y-4">
        <h2 className="font-mono text-label text-accent uppercase">Radius + shadow</h2>
        <div className="flex gap-6 items-end">
          <div className="bg-surface rounded h-20 w-20 border border-line" />
          <p className="font-mono text-small text-ink-2">
            radius = 2px · applied globally via <code>--radius</code>
          </p>
        </div>
        <div className="flex gap-6 items-end">
          <div className="bg-surface rounded h-20 w-20 shadow-elev" />
          <p className="font-mono text-small text-ink-2">
            shadow-elev = <code>--shadow</code>
          </p>
        </div>
      </section>

      {/* ------- Footer ------- */}
      <footer className="border-t border-line pt-4">
        <p className="font-mono text-meta text-ink-3 uppercase">
          Delete this route before production (S1_LIVE).
        </p>
      </footer>
    </main>
  );
}
