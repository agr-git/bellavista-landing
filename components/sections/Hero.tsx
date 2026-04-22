/**
 * Hero — full-bleed cinematic, 100vh.
 * B3 stub: anchor + minimal layout. B4 fills in.
 */

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen w-full">
      {/* Nav sentinel: when this scrolls out of view, Nav fades to opaque */}
      <div id="nav-sentinel" className="absolute top-0 h-[60vh] w-full pointer-events-none" />
      <div className="flex items-center justify-center min-h-screen px-6">
        <p className="font-mono text-meta uppercase text-ink-3">
          [B3 stub] Hero · drone video + headline lands in B4
        </p>
      </div>
    </section>
  );
}
