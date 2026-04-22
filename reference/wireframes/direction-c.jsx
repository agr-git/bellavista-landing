// Direction C — CINEMATIC REFINED (Ceniza palette by default)
// Full-bleed cinematic feel, using Story · Farm · Coffee · Stay · Journal · Contact.
// Carries forward: dark video hero (from D3), bento stay (from D3),
// split green/roasted, journal with public/private.
//
// Color tokens come from a palette prop so the same frames render under
// Ceniza (warm dark + bone + ochre) or Amanecer (deep blue + dawn ochre).

const PALETTES_C = {
  ceniza: {
    id: 'Ceniza',
    bg: '#1a1613',
    surface: '#221c17',
    paper: '#f4efe4',
    ink: '#f4efe4',
    ink2: '#c9bfae',
    ink3: '#8a7e6c',
    line: 'rgba(244,239,228,0.16)',
    lineStrong: 'rgba(244,239,228,0.32)',
    accent: '#d9a066',
    accent2: '#e8d5b5',
    shadow: 'rgba(0,0,0,0.4)',
  },
  amanecer: {
    id: 'Amanecer',
    bg: '#1b2437',
    surface: '#243049',
    paper: '#fef5e2',
    ink: '#fef5e2',
    ink2: '#c5cad6',
    ink3: '#8893a6',
    line: 'rgba(254,245,226,0.14)',
    lineStrong: 'rgba(254,245,226,0.28)',
    accent: '#e89b4a',
    accent2: '#f5c98a',
    shadow: 'rgba(0,0,0,0.35)',
  },
};

if (typeof document !== 'undefined' && !document.getElementById('wfc-fonts')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
}

// Video placeholder (dark-mode)
function VidC({ p, h = 160, label = 'video', style = {} }) {
  return (
    <div style={{
      position: 'relative', height: h, width: '100%', background: p.surface,
      border: `1px solid ${p.line}`, borderRadius: 2, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...style,
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={p.ink} strokeWidth="1"/>
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={p.ink} strokeWidth="1"/>
      </svg>
      <div style={{
        position: 'relative', width: 44, height: 44, borderRadius: 22,
        border: `1.5px solid ${p.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: `12px solid ${p.ink}`,
          borderTop: '8px solid transparent', borderBottom: '8px solid transparent', marginLeft: 3,
        }}/>
      </div>
      <div style={{
        position: 'absolute', bottom: 8, left: 8, fontSize: 9,
        color: p.ink, opacity: 0.7, fontFamily: "'JetBrains Mono', monospace",
        textTransform: 'uppercase', letterSpacing: '0.12em',
      }}>{label}</div>
    </div>
  );
}

function ImgC({ p, h = 120, label = 'image', style = {}, full = false }) {
  return (
    <div style={{
      position: 'relative', height: full ? '100%' : h, width: '100%',
      background: p.surface, border: `1px solid ${p.line}`, borderRadius: 2, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...style,
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.25 }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={p.ink} strokeWidth="1"/>
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={p.ink} strokeWidth="1"/>
      </svg>
      <div style={{
        position: 'relative', fontSize: 9, color: p.ink, opacity: 0.65,
        fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase',
        letterSpacing: '0.12em', padding: '2px 6px',
        background: p.bg, borderRadius: 2,
      }}>{label}</div>
    </div>
  );
}

function LinesC({ p, n = 3, w }) {
  const widths = w || Array.from({ length: n }, (_, i) => `${92 - i * 7}%`);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ height: 5, width: widths[i] || widths[widths.length - 1], background: p.ink, borderRadius: 2, opacity: 0.25 }}/>
      ))}
    </div>
  );
}

function TagC({ p, children, accent = false }) {
  return (
    <span style={{
      display: 'inline-block', fontFamily: "'JetBrains Mono', monospace",
      fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
      padding: '4px 8px', borderRadius: 2,
      border: `1px solid ${accent ? p.accent : p.lineStrong}`,
      color: accent ? p.accent : p.ink, background: 'transparent', opacity: accent ? 1 : 0.85,
    }}>{children}</span>
  );
}

function NoteC({ p, children, style = {} }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: p.accent2, ...style,
    }}>→ {children}</div>
  );
}

function NavC({ p, items, compact = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: compact ? '14px 28px' : '18px 32px',
      borderBottom: `1px solid ${p.line}`, color: p.ink,
    }}>
      <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.25em' }}>BELLAVISTA</div>
      <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
        {items.map((it, i) => (
          <div key={i} style={{
            fontFamily: "'Geist', sans-serif", fontSize: 10, color: p.ink,
            opacity: it.active ? 1 : 0.6, fontWeight: it.active ? 500 : 400,
            textTransform: 'uppercase', letterSpacing: '0.14em',
          }}>{it.label}</div>
        ))}
        <div style={{ width: 1, height: 12, background: p.ink, opacity: 0.25 }}/>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink, opacity: 0.7 }}>EN/ES</div>
      </div>
    </div>
  );
}

const NAV_C = [
  { label: 'Story', active: true },
  { label: 'The Farm' },
  { label: 'Coffee' },
  { label: 'Stay' },
  { label: 'Journal' },
  { label: 'Contact' },
];

function FrameC({ p, children }) {
  const FONT = "'Geist', system-ui, sans-serif";
  return (
    <div style={{
      height: '100%', width: '100%', background: p.bg, color: p.ink,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: FONT, boxSizing: 'border-box',
    }}>{children}</div>
  );
}

// ─── C1 · FULL-BLEED CINEMATIC HERO ──────────────────────────
function DC_Home({ p }) {
  return (
    <FrameC p={p}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Video bg */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: p.surface }}/>
          <svg width="100%" height="100%" style={{ opacity: 0.25 }} preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke={p.ink} strokeWidth="1"/>
            <line x1="100%" y1="0" x2="0" y2="100%" stroke={p.ink} strokeWidth="1"/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${p.bg}55 0%, ${p.bg}22 35%, ${p.bg}ee 100%)` }}/>
          <div style={{
            position: 'absolute', bottom: 16, right: 18, fontSize: 9, color: p.ink, opacity: 0.5,
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em',
          }}>LOOPING · 4K · AUTO-PLAY MUTED</div>
        </div>

        <NavC p={p} items={NAV_C} compact/>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 40, position: 'relative', textAlign: 'center' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em',
            color: p.ink, opacity: 0.7, marginBottom: 22,
          }}>MANIZALES · COLOMBIA · 1.300 MASL</div>
          <div style={{
            fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 84, lineHeight: 0.92,
            letterSpacing: '-0.025em', color: p.ink, maxWidth: 760,
          }}>
            From lines of code<br/>
            <span style={{ fontStyle: 'italic', color: p.accent2 }}>to lines of</span> coffee trees.
          </div>
          <div style={{
            fontFamily: "'Geist', sans-serif", fontSize: 14, color: p.ink, opacity: 0.8,
            marginTop: 22, maxWidth: 440, lineHeight: 1.55,
          }}>
            A small production project in the hills of Manizales — documented in drone footage, field notes, and every batch of coffee we ship.
          </div>

          <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 36,
                border: `1.5px solid ${p.ink}`, background: `${p.bg}66`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 0, height: 0,
                  borderLeft: `18px solid ${p.ink}`,
                  borderTop: '12px solid transparent', borderBottom: '12px solid transparent', marginLeft: 5,
                }}/>
              </div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 22, color: p.ink }}>Start the tour</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink, opacity: 0.6, letterSpacing: '0.15em', marginTop: 2 }}>5 CHAPTERS · 08:42</div>
            </div>
          </div>
          <NoteC p={p} style={{ position: 'absolute', left: 24, top: 24 }}>full-bleed drone loop · autoplay muted</NoteC>
        </div>

        {/* Chapter strip */}
        <div style={{
          position: 'relative', padding: '14px 28px',
          borderTop: `1px solid ${p.line}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink, opacity: 0.6, letterSpacing: '0.2em' }}>↓ SCROLL TO EXPLORE</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['01 CASA', '02 LA VEGA', '03 EL BOSQUE', '04 LA CUMBRE', '05 BENEFICIO'].map((c, i) => (
              <div key={i} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                color: p.ink, opacity: i === 0 ? 1 : 0.45, letterSpacing: '0.14em',
                borderBottom: i === 0 ? `1.5px solid ${p.accent2}` : 'none', paddingBottom: 4,
              }}>{c}</div>
            ))}
          </div>
        </div>
      </div>
    </FrameC>
  );
}

// ─── C2 · CHAPTER 01 · STORY / PRODUCER ──────────────────────
function DC_Story({ p }) {
  return (
    <FrameC p={p}>
      <NavC p={p} items={NAV_C} compact/>
      <div style={{ padding: '40px 40px 32px', display: 'grid', gridTemplateColumns: '80px 1fr 300px', gap: 30 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3, letterSpacing: '0.2em' }}>CHAPTER</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 64, color: p.accent, lineHeight: 1, marginTop: 4 }}>01</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 44, lineHeight: 1, letterSpacing: '-0.02em', color: p.ink }}>
            The <span style={{ fontStyle: 'italic', color: p.accent2 }}>producer.</span>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 14 }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 72, color: p.accent, lineHeight: 0.7 }}>I</div>
            <div style={{ flex: 1 }}><LinesC p={p} n={6}/></div>
          </div>
          <div style={{ marginTop: 18 }}><LinesC p={p} n={3} w={['90%', '84%', '65%']}/></div>
          <NoteC p={p} style={{ marginTop: 20 }}>opening hook: tech background → coffee</NoteC>
        </div>
        <div>
          <ImgC p={p} label="portrait · producer" h={280}/>
          <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: p.ink3, fontStyle: 'italic', marginTop: 6 }}>
            Fig 1. Among the first Caturra rows, 2021.
          </div>
          <div style={{ marginTop: 16, padding: 12, border: `1px solid ${p.line}`, borderRadius: 2 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink3, letterSpacing: '0.15em' }}>PREVIOUSLY</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 17, color: p.ink, marginTop: 4 }}>Software engineer, 12 years.</div>
          </div>
        </div>
      </div>
    </FrameC>
  );
}

// ─── C3 · THE FARM (map + milestones) ────────────────────────
function DC_Farm({ p }) {
  return (
    <FrameC p={p}>
      <NavC p={p} items={NAV_C.map((n,i)=>({...n, active: i===1}))} compact/>
      <div style={{ padding: '32px 40px 20px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3, letterSpacing: '0.2em' }}>CHAPTER 02</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 54, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 8, color: p.ink }}>
          The farm, <span style={{ fontStyle: 'italic', color: p.accent2 }}>and how it got here.</span>
        </div>
      </div>

      <div style={{ padding: '0 40px 24px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
        {/* Schematic map */}
        <div style={{ position: 'relative', background: p.surface, border: `1px solid ${p.line}`, borderRadius: 2, height: 260 }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none" viewBox="0 0 400 260">
            {[30, 65, 100, 140, 180, 220].map((y, i) => (
              <path key={i} d={`M 0 ${y} Q 100 ${y-14} 200 ${y} T 400 ${y}`} stroke={p.ink} strokeWidth="0.6" fill="none" opacity="0.25"/>
            ))}
            <path d="M 0 220 Q 80 200 180 210 T 400 195" stroke={p.accent2} strokeWidth="1.5" fill="none" opacity="0.7"/>
          </svg>
          {[
            { n: 1, x: '16%', y: '24%', label: 'LA VEGA' },
            { n: 2, x: '44%', y: '38%', label: 'EL BOSQUE' },
            { n: 3, x: '66%', y: '20%', label: 'LA CUMBRE' },
          ].map((pl, i) => (
            <div key={i} style={{ position: 'absolute', left: pl.x, top: pl.y }}>
              <div style={{ width: 68, height: 48, border: `1.5px solid ${p.ink}`, background: `${p.accent}33`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: p.accent2, color: p.bg, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{pl.n}</div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: p.ink, opacity: 0.75, marginTop: 4, letterSpacing: '0.1em' }}>{pl.label}</div>
            </div>
          ))}
          <NoteC p={p} style={{ position: 'absolute', top: 12, right: 14 }}>click plot → chapter</NoteC>
        </div>
        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, alignContent: 'start' }}>
          {[
            { k: 'Altitude', v: '1.300 m' },
            { k: 'Area', v: '4.2 ha' },
            { k: 'Plots', v: '3' },
            { k: 'Varietals', v: '3' },
            { k: 'Process', v: 'Washed · Anaerobic · Carbonic' },
            { k: 'Planted', v: '2021' },
          ].map((s, i) => (
            <div key={i} style={{ padding: 12, border: `1px solid ${p.line}`, borderRadius: 2, gridColumn: s.k === 'Process' ? 'span 2' : 'auto' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink3, letterSpacing: '0.15em' }}>{s.k.toUpperCase()}</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 22, color: p.accent2, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones — horizontal */}
      <div style={{ padding: '20px 40px 28px', borderTop: `1px solid ${p.line}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3, letterSpacing: '0.2em', marginBottom: 14 }}>MILESTONES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {[
            { y: '2018', t: 'First visit' },
            { y: '2020', t: 'Quit tech' },
            { y: '2021', t: 'Seedlings', accent: true },
            { y: '2023', t: 'Beneficio' },
            { y: '2024', t: 'First export · 88+ SCA', accent: true },
            { y: '2025', t: 'Stay opens' },
          ].map((m, i) => (
            <div key={i} style={{ borderTop: `1.5px solid ${m.accent ? p.accent : p.line}`, paddingTop: 8 }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 22, color: m.accent ? p.accent : p.ink }}>{m.y}</div>
              <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: p.ink2, marginTop: 2 }}>{m.t}</div>
            </div>
          ))}
        </div>
      </div>
    </FrameC>
  );
}

// ─── C4 · SCROLLY CHAPTER · PINNED TEXT + VIDEO ──────────────
function DC_Chapter({ p }) {
  return (
    <FrameC p={p}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '42% 58%' }}>
        {/* Pinned text */}
        <div style={{ padding: '44px 34px', display: 'flex', flexDirection: 'column', borderRight: `1px solid ${p.line}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.accent, letterSpacing: '0.25em' }}>CHAPTER 03 · EL BOSQUE</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 52, lineHeight: 0.95, letterSpacing: '-0.02em', color: p.ink, marginTop: 18 }}>
            Pink Bourbon,<br/>
            <span style={{ fontStyle: 'italic', color: p.accent2 }}>under guamo shade.</span>
          </div>
          <div style={{ marginTop: 22 }}><LinesC p={p} n={4}/></div>
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[['ALT', '1.420 m'], ['AREA', '0.9 ha'], ['YEAR', '2021']].map(([k, v], i) => (
              <div key={i}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink3, letterSpacing: '0.15em' }}>{k}</div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 24, color: p.accent, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
          <NoteC p={p} style={{ marginTop: 28 }}>text pins while video progresses on right</NoteC>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3 }}>03 / 05</div>
            <div style={{ flex: 1, height: 2, background: p.line }}>
              <div style={{ width: '60%', height: '100%', background: p.accent }}/>
            </div>
          </div>
        </div>

        {/* Video side */}
        <div style={{ position: 'relative', background: p.surface }}>
          <svg width="100%" height="100%" style={{ opacity: 0.25 }} preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke={p.ink} strokeWidth="1"/>
            <line x1="100%" y1="0" x2="0" y2="100%" stroke={p.ink} strokeWidth="1"/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, border: `1.5px solid ${p.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderLeft: `16px solid ${p.ink}`, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', marginLeft: 4 }}/>
            </div>
          </div>
          {/* Overlay pins */}
          <div style={{ position: 'absolute', left: '26%', top: '34%' }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: p.accent, color: p.bg, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 14, color: p.ink, background: p.bg, padding: '3px 8px', marginTop: 6, borderRadius: 2, display: 'inline-block' }}>seedling row</div>
          </div>
          <div style={{ position: 'absolute', left: '62%', top: '58%' }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: p.accent, color: p.bg, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 14, color: p.ink, background: p.bg, padding: '3px 8px', marginTop: 6, borderRadius: 2, display: 'inline-block' }}>guamo shade</div>
          </div>
          {/* Scrubber */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20 }}>
            <div style={{ height: 2, background: p.line, position: 'relative' }}>
              <div style={{ width: '38%', height: '100%', background: p.accent2 }}/>
              <div style={{ position: 'absolute', left: '38%', top: -3, width: 8, height: 8, borderRadius: 4, background: p.accent2, transform: 'translateX(-50%)' }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink, opacity: 0.7 }}>
              <span>00:42</span><span>01:48</span>
            </div>
          </div>
        </div>
      </div>
    </FrameC>
  );
}

// ─── C5 · COFFEE SPLIT + QUOTE ───────────────────────────────
function DC_Coffee({ p }) {
  return (
    <FrameC p={p}>
      <NavC p={p} items={NAV_C.map((n,i)=>({...n, active: i===2}))} compact/>
      <div style={{ padding: '32px 40px 20px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3, letterSpacing: '0.2em' }}>CHAPTER 04 · COFFEE</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 54, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 6, color: p.ink }}>
          What we <span style={{ fontStyle: 'italic', color: p.accent2 }}>grow.</span>
        </div>
      </div>
      <div style={{ padding: '0 40px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: p.line }}>
        {[
          { kind: 'Green coffee', who: 'for roasters · full lot specs + samples', cta: 'Request samples', tag: 'B2B' },
          { kind: 'Roasted coffee', who: 'for drinkers · small drops, ships from farm', cta: 'Join the waitlist', tag: 'Direct' },
        ].map((c, i) => (
          <div key={i} style={{ background: p.bg, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <TagC p={p} accent>{c.tag}</TagC>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink3 }}>0{i+1} / 02</div>
            </div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, color: p.ink, letterSpacing: '-0.01em' }}>{c.kind}</div>
            <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: p.ink2, marginTop: 4 }}>{c.who}</div>
            <div style={{ marginTop: 12 }}><ImgC p={p} label={c.kind.toLowerCase()} h={100}/></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              <TagC p={p}>caturra</TagC><TagC p={p}>pink bourbon</TagC><TagC p={p}>geisha</TagC>
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: p.ink3 }}>Lead-gen inquiry form · no cart yet</div>
              <span style={{ padding: '7px 12px', background: p.accent, color: p.bg, fontFamily: "'Geist', sans-serif", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>{c.cta} ↗</span>
            </div>
          </div>
        ))}
      </div>
      {/* Quote */}
      <div style={{ marginTop: 'auto', padding: '36px 80px', borderTop: `1px solid ${p.line}`, background: p.surface }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, lineHeight: 1.15, color: p.ink }}>
          <span style={{ fontStyle: 'italic' }}>“We treat every lot like a deploy.</span><br/>
          <span style={{ color: p.accent2, fontStyle: 'italic' }}>Versioned, logged, and reviewable.”</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, marginTop: 10, letterSpacing: '0.2em', color: p.ink3 }}>— THE PRODUCER</div>
      </div>
    </FrameC>
  );
}

// ─── C6 · STAY · BENTO (from D3) ─────────────────────────────
function DC_Stay({ p }) {
  return (
    <FrameC p={p}>
      <NavC p={p} items={NAV_C.map((n,i)=>({...n, active: i===3}))} compact/>
      <div style={{ padding: '28px 32px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3, letterSpacing: '0.2em' }}>CHAPTER 05 · STAY</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 54, lineHeight: 1, letterSpacing: '-0.02em', color: p.ink, marginTop: 6 }}>
            Sleep at <span style={{ fontStyle: 'italic', color: p.accent2 }}>Bellavista.</span>
          </div>
          <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: p.ink2, marginTop: 6, maxWidth: 440 }}>
            Four guests · restored farmhouse · meals from the land. Book by the week or the weekend.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ padding: '7px 12px', border: `1px solid ${p.lineStrong}`, color: p.ink, fontFamily: "'Geist', sans-serif", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>Week</span>
          <span style={{ padding: '7px 12px', background: p.accent, color: p.bg, fontFamily: "'Geist', sans-serif", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>Weekend</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: '0 32px 26px', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 8, minHeight: 0 }}>
        <div style={{ gridColumn: 'span 4', gridRow: 'span 2' }}><ImgC p={p} full label="main house · covered porch"/></div>
        <div style={{ gridColumn: 'span 2' }}><ImgC p={p} full label="guest bedroom"/></div>
        <div style={{ gridColumn: 'span 2' }}><ImgC p={p} full label="kitchen garden"/></div>
        <div style={{ gridColumn: 'span 2' }}><ImgC p={p} full label="sunrise"/></div>
        <div style={{ gridColumn: 'span 2' }}><VidC p={p} label="house tour" style={{ height: '100%' }}/></div>
        <div style={{ gridColumn: 'span 2', padding: 16, border: `1px dashed ${p.lineStrong}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink3, letterSpacing: '0.15em' }}>FROM</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 34, color: p.accent2, marginTop: 2, lineHeight: 1 }}>$ / night</div>
            <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: p.ink2, marginTop: 6 }}>All meals + farm tour included.</div>
          </div>
          <span style={{ padding: '8px', background: p.paper, color: p.bg, fontFamily: "'Geist', sans-serif", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2, textAlign: 'center' }}>Check dates ↗</span>
        </div>
      </div>
      <NoteC p={p} style={{ position: 'absolute', right: 22, bottom: 14 }}>CTA → external booking form</NoteC>
    </FrameC>
  );
}

// ─── C7 · JOURNAL + CONTACT ──────────────────────────────────
function DC_Journal({ p }) {
  return (
    <FrameC p={p}>
      <NavC p={p} items={NAV_C.map((n,i)=>({...n, active: i===4}))} compact/>
      <div style={{ padding: '28px 40px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3, letterSpacing: '0.2em' }}>CHAPTER 06 · JOURNAL</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, lineHeight: 1, letterSpacing: '-0.02em', color: p.ink, marginTop: 6 }}>
            From the <span style={{ fontStyle: 'italic', color: p.accent2 }}>field.</span>
          </div>
          <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: p.ink2, marginTop: 6, maxWidth: 460 }}>
            Public posts showcase projects. Private entries track experiments — producer only.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <TagC p={p} accent>All</TagC><TagC p={p}>Projects</TagC><TagC p={p}>Experiments</TagC>
        </div>
      </div>
      <div style={{ padding: '0 40px 22px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* Featured */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink3, letterSpacing: '0.2em', marginBottom: 8 }}>FEATURED · PROJECT</div>
          <ImgC p={p} label="anaerobic lab build" h={180}/>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3, marginTop: 10, letterSpacing: '0.15em' }}>APR 18 · PROJECT · PUBLIC</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, lineHeight: 1.05, color: p.ink, marginTop: 4 }}>
            <span style={{ fontStyle: 'italic' }}>Anaerobic</span> fermentation, week 3.
          </div>
          <div style={{ marginTop: 8 }}><LinesC p={p} n={2}/></div>
        </div>
        {/* Recent list */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.ink3, letterSpacing: '0.2em', marginBottom: 8 }}>RECENT</div>
          {[
            { d: 'APR 15', t: 'pH log · batch #14', priv: true },
            { d: 'APR 02', t: 'New drying beds online', priv: false },
            { d: 'MAR 21', t: 'Roaster visit · Oslo', priv: false },
            { d: 'MAR 08', t: 'Geisha pick plan', priv: true },
            { d: 'FEB 24', t: 'Shade study, Plot 02', priv: false },
          ].map((e, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '56px 1fr 72px', gap: 10, padding: '9px 0', borderBottom: i < 4 ? `1px solid ${p.line}` : 'none', alignItems: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3 }}>{e.d}</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16, color: p.ink }}>{e.t}</div>
              {e.priv
                ? <TagC p={p}>private</TagC>
                : <TagC p={p} accent>public</TagC>}
            </div>
          ))}
        </div>
      </div>
      {/* Contact footer */}
      <div style={{ marginTop: 'auto', background: p.surface, padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${p.line}` }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.ink3, letterSpacing: '0.2em' }}>CONTACT</div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 26, color: p.ink, marginTop: 2 }}>Come visit. Or stay in touch.</div>
          <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: p.ink2, marginTop: 4 }}>hello@bellavistacoffee.co · @bellavista.coffee</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ padding: '8px 14px', background: p.accent, color: p.bg, fontFamily: "'Geist', sans-serif", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>Subscribe</span>
          <span style={{ padding: '8px 14px', border: `1px solid ${p.lineStrong}`, color: p.ink, fontFamily: "'Geist', sans-serif", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 2 }}>Admin →</span>
        </div>
      </div>
    </FrameC>
  );
}

Object.assign(window, { PALETTES_C, DC_Home, DC_Story, DC_Farm, DC_Chapter, DC_Coffee, DC_Stay, DC_Journal });
