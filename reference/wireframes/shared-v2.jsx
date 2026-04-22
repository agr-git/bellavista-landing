// v2 shared — same primitives but with refined typography.
// Display: Instrument Serif (warm, editorial, professional)
// Body:    Geist (modern sans, clean)
// Mono:    JetBrains Mono

const WF2 = {
  ink: '#1a1613',
  ink2: '#3d352e',
  ink3: '#6b5f54',
  ink4: '#a89d90',
  paper: '#fbf8f2',
  paper2: '#f4efe4',
  line: '#2a231c',
  accent: 'oklch(55% 0.09 50)',
  accent2: 'oklch(72% 0.09 50)',
  wash: 'oklch(92% 0.02 50)',
  display: "'Instrument Serif', 'Newsreader', Georgia, serif",
  sans: "'Geist', 'Inter Tight', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

if (typeof document !== 'undefined' && !document.getElementById('wf2-fonts')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
  const s = document.createElement('style');
  s.id = 'wf2-fonts';
  s.textContent = `
    .wf2 * { box-sizing: border-box; }
    .wf2 { font-family: ${WF2.sans}; color: ${WF2.ink}; background: ${WF2.paper}; }
    .wf2-display { font-family: ${WF2.display}; letter-spacing: -0.01em; }
    .wf2-sans { font-family: ${WF2.sans}; }
    .wf2-mono { font-family: ${WF2.mono}; }
    .wf2-box { border: 1.5px solid ${WF2.line}; border-radius: 3px; background: ${WF2.paper}; }
    .wf2-box-dashed { border: 1.5px dashed ${WF2.line}; border-radius: 3px; }
    .wf2-dark { background: ${WF2.ink}; color: ${WF2.paper}; }
    .wf2-btn { border: 1.5px solid ${WF2.line}; border-radius: 2px; padding: 7px 14px; font-family: ${WF2.sans}; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; display: inline-block; background: ${WF2.paper}; font-weight: 500; }
    .wf2-btn-filled { background: ${WF2.ink}; color: ${WF2.paper}; border-color: ${WF2.ink}; }
    .wf2-btn-accent { background: ${WF2.accent}; color: ${WF2.paper}; border-color: ${WF2.accent}; }
    .wf2-btn-light { background: ${WF2.paper}; color: ${WF2.ink}; border-color: ${WF2.paper}; }
    .wf2-label { font-family: ${WF2.mono}; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: ${WF2.ink3}; }
    .wf2-note { font-family: ${WF2.mono}; color: ${WF2.accent}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }
    .wf2-h1 { font-family: ${WF2.display}; font-weight: 400; font-size: 56px; line-height: 1; letter-spacing: -0.02em; color: ${WF2.ink}; }
    .wf2-h2 { font-family: ${WF2.display}; font-weight: 400; font-size: 36px; line-height: 1.02; letter-spacing: -0.01em; color: ${WF2.ink}; }
    .wf2-h3 { font-family: ${WF2.display}; font-weight: 400; font-size: 22px; line-height: 1.1; color: ${WF2.ink}; }
    .wf2-italic { font-style: italic; }
    .wf2-body { font-family: ${WF2.sans}; font-size: 13px; line-height: 1.55; color: ${WF2.ink2}; font-weight: 400; }
    .wf2-small { font-family: ${WF2.sans}; font-size: 11px; color: ${WF2.ink3}; }
  `;
  document.head.appendChild(s);
}

function Img2({ label = 'image', h = 120, style = {}, dark = false, full = false }) {
  const bg = dark ? WF2.ink2 : WF2.paper2;
  const stroke = dark ? WF2.ink4 : WF2.ink3;
  return (
    <div style={{
      position: 'relative', height: full ? '100%' : h, width: '100%', background: bg,
      border: `1.5px solid ${WF2.line}`, borderRadius: 2, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...style,
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={stroke} strokeWidth="1"/>
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={stroke} strokeWidth="1"/>
      </svg>
      <div className="wf2-mono" style={{
        position: 'relative', fontSize: 9, color: dark ? WF2.paper : WF2.ink3,
        textTransform: 'uppercase', letterSpacing: '0.12em', padding: '2px 6px',
        background: dark ? WF2.ink : WF2.paper, borderRadius: 2,
      }}>{label}</div>
    </div>
  );
}

function Video2({ label = 'video', h = 160, dark = true, style = {} }) {
  const bg = dark ? WF2.ink : WF2.paper2;
  return (
    <div style={{
      position: 'relative', height: h, width: '100%', background: bg,
      border: `1.5px solid ${WF2.line}`, borderRadius: 2, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...style,
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke={dark ? WF2.paper : WF2.ink3} strokeWidth="1"/>
        <line x1="100%" y1="0" x2="0" y2="100%" stroke={dark ? WF2.paper : WF2.ink3} strokeWidth="1"/>
      </svg>
      <div style={{
        position: 'relative', width: 44, height: 44, borderRadius: 22,
        border: `1.5px solid ${dark ? WF2.paper : WF2.ink}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: `12px solid ${dark ? WF2.paper : WF2.ink}`,
          borderTop: '8px solid transparent', borderBottom: '8px solid transparent', marginLeft: 3,
        }}/>
      </div>
      <div className="wf2-mono" style={{
        position: 'absolute', bottom: 8, left: 8, fontSize: 9,
        color: dark ? WF2.paper : WF2.ink3, textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>{label}</div>
    </div>
  );
}

function Lines2({ n = 3, w, dark = false }) {
  const widths = w || Array.from({ length: n }, (_, i) => `${92 - i * 6}%`);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ height: 5, width: widths[i] || widths[widths.length - 1], background: dark ? WF2.paper : WF2.ink4, borderRadius: 2, opacity: 0.45 }}/>
      ))}
    </div>
  );
}

function Nav2({ items, dark = false, compact = false, brandName = 'BELLAVISTA' }) {
  const fg = dark ? WF2.paper : WF2.ink;
  const bd = dark ? `${WF2.paper}33` : WF2.line;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: compact ? '14px 28px' : '18px 32px',
      borderBottom: `1px solid ${bd}`,
      background: dark ? WF2.ink : 'transparent', color: fg,
    }}>
      <div className="wf2-sans" style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.2em', color: fg }}>
        {brandName}
      </div>
      <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
        {items.map((it, i) => (
          <div key={i} className="wf2-sans" style={{ fontSize: 11, color: fg, opacity: it.active ? 1 : 0.65, fontWeight: it.active ? 500 : 400, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{it.label}</div>
        ))}
        <div style={{ width: 1, height: 12, background: fg, opacity: 0.3 }}/>
        <div className="wf2-mono" style={{ fontSize: 10, color: fg, opacity: 0.7 }}>EN/ES</div>
      </div>
    </div>
  );
}

function Tag2({ children, dark = false, accent = false }) {
  return (
    <span style={{
      display: 'inline-block', fontFamily: WF2.mono, fontSize: 9,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '4px 8px', borderRadius: 2,
      border: `1px solid ${accent ? WF2.accent : dark ? `${WF2.paper}55` : WF2.line}`,
      color: accent ? WF2.accent : dark ? WF2.paper : WF2.ink, background: 'transparent',
    }}>{children}</span>
  );
}

function Callout2({ children, style = {}, dark = false }) {
  return (
    <div className="wf2-note" style={{ color: dark ? WF2.accent2 : WF2.accent, ...style }}>
      → {children}
    </div>
  );
}

function Frame2({ children }) {
  return (
    <div className="wf2" style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  );
}

Object.assign(window, { WF2, Img2, Video2, Lines2, Nav2, Tag2, Callout2, Frame2 });
