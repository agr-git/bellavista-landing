// 5 palette + type-pairing swatches. Each is a compact board that mimics
// how the hero would feel under the chosen colors and fonts.

const PALETTES = [
  {
    id: 'P1',
    name: 'Cerro',
    story: 'Warm earth + deep forest. Highland coffee grown at altitude.',
    bg: '#f4efe4',
    ink: '#1f2a22',
    accent: '#6b4a2b',
    accent2: '#c98b55',
    paper: '#faf6ec',
    display: "'Instrument Serif', Georgia, serif",
    displayName: 'Instrument Serif',
    sans: "'Geist', system-ui, sans-serif",
    sansName: 'Geist',
  },
  {
    id: 'P2',
    name: 'Neblina',
    story: 'Cool mist greens with terracotta. Reads modern, feels highland.',
    bg: '#eef0ec',
    ink: '#22312c',
    accent: '#b5533a',
    accent2: '#7a9a88',
    paper: '#f7f7f2',
    display: "'Newsreader', serif",
    displayName: 'Newsreader',
    sans: "'Inter Tight', sans-serif",
    sansName: 'Inter Tight',
  },
  {
    id: 'P3',
    name: 'Ceniza',
    story: 'Dark warm ink + bone. Editorial, confident, a little nocturnal.',
    bg: '#1a1613',
    ink: '#f4efe4',
    accent: '#d9a066',
    accent2: '#e8d5b5',
    paper: '#252018',
    display: "'Fraunces', serif",
    displayName: 'Fraunces',
    sans: "'Söhne', 'Geist', sans-serif",
    sansName: 'Söhne / Geist',
  },
  {
    id: 'P4',
    name: 'Guadua',
    story: 'Bamboo green + cream. Softly agricultural, fresh, welcoming.',
    bg: '#faf5e8',
    ink: '#2d3527',
    accent: '#5b6e3a',
    accent2: '#c4a958',
    paper: '#ffffff',
    display: "'Young Serif', serif",
    displayName: 'Young Serif',
    sans: "'DM Sans', sans-serif",
    sansName: 'DM Sans',
  },
  {
    id: 'P5',
    name: 'Amanecer',
    story: 'Dawn ochre on deep blue. Playful, confident, stays warm.',
    bg: '#1b2437',
    ink: '#fef5e2',
    accent: '#e89b4a',
    accent2: '#f5c98a',
    paper: '#2a3446',
    display: "'GT Sectra', 'Roslindale', serif",
    displayName: 'GT Sectra / Roslindale',
    sans: "'Basier', 'Inter Tight', sans-serif",
    sansName: 'Basier / Inter Tight',
  },
];

function PaletteCard({ p }) {
  const onDark = p.bg.length === 7 && parseInt(p.bg.slice(1), 16) < 0x888888;
  return (
    <div style={{
      width: '100%', height: '100%', background: p.bg, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Top metadata */}
      <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: WF2.mono, fontSize: 10, letterSpacing: '0.15em', opacity: 0.7 }}>
        <span>{p.id} · {p.name.toUpperCase()}</span>
        <span>BELLAVISTA</span>
      </div>

      {/* Hero sample */}
      <div style={{ padding: '10px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        <div style={{ fontFamily: WF2.mono, fontSize: 9, letterSpacing: '0.25em', opacity: 0.6 }}>MANIZALES · 1.300 MASL</div>
        <div style={{ fontFamily: p.display, fontSize: 44, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
          From lines of code<br/>
          <span style={{ fontStyle: 'italic', color: p.accent2 }}>to lines of</span> <span style={{ color: p.accent }}>coffee</span> trees.
        </div>
        <div style={{ fontFamily: p.sans, fontSize: 12, opacity: 0.8, maxWidth: 360, lineHeight: 1.5 }}>
          A small production project in the hills of Manizales, documented in drone footage and field notes.
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <div style={{ padding: '6px 12px', background: p.accent, color: p.bg, fontFamily: p.sans, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>Start the tour ↗</div>
          <div style={{ padding: '6px 12px', border: `1px solid ${p.ink}55`, fontFamily: p.sans, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>Read the story</div>
        </div>
      </div>

      {/* Swatches + type specimen */}
      <div style={{ padding: '14px 18px', borderTop: `1px solid ${p.ink}22`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <div style={{ fontFamily: WF2.mono, fontSize: 9, letterSpacing: '0.15em', opacity: 0.6, marginBottom: 6 }}>PALETTE</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[p.bg, p.paper, p.ink, p.accent, p.accent2].map((c, i) => (
              <div key={i} style={{ flex: 1, height: 28, background: c, border: `1px solid ${p.ink}33`, borderRadius: 2 }}/>
            ))}
          </div>
          <div style={{ fontFamily: p.sans, fontSize: 10, opacity: 0.75, marginTop: 6 }}>{p.story}</div>
        </div>
        <div>
          <div style={{ fontFamily: WF2.mono, fontSize: 9, letterSpacing: '0.15em', opacity: 0.6, marginBottom: 6 }}>TYPE</div>
          <div style={{ fontFamily: p.display, fontSize: 18 }}>Aa <span style={{ fontStyle: 'italic' }}>Bellavista</span></div>
          <div style={{ fontFamily: WF2.mono, fontSize: 9, opacity: 0.6, marginTop: 1 }}>{p.displayName.toUpperCase()}</div>
          <div style={{ fontFamily: p.sans, fontSize: 12, fontWeight: 500, marginTop: 6 }}>Aa Manizales 1.300 masl</div>
          <div style={{ fontFamily: WF2.mono, fontSize: 9, opacity: 0.6, marginTop: 1 }}>{p.sansName.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

// Load all display fonts at once
if (typeof document !== 'undefined' && !document.getElementById('palette-fonts')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Newsreader:ital,wght@0,400;1,400&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Young+Serif&family=DM+Sans:wght@400;500&family=Inter+Tight:wght@400;500&display=swap';
  document.head.appendChild(l);
  const s = document.createElement('style');
  s.id = 'palette-fonts';
  document.head.appendChild(s);
}

Object.assign(window, { PALETTES, PaletteCard });
