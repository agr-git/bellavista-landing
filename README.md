# Handoff: Bellavista Coffee — Landing Page

## Overview

Landing page for **Bellavista Coffee**, a small specialty-coffee production project in Manizales, Colombia (1.300 MASL). The site is a storytelling-first, cinematic virtual tour of the farm that also drives four lead-gen funnels:

1. **B2B green coffee buyers** — specialty roasters requesting samples / lot sheets
2. **Direct consumers** — waitlist for small roasted drops
3. **Farm-stay guests** — bookings for weekend / week stays at the farmhouse
4. **Partners / investors** — opening a conversation through the contact surface

It also hosts a **Journal** that serves two audiences from one system:
- **Public** entries — projects/stories that showcase farm work
- **Private** entries — experiment log (pH, batch data, pick plans) visible only to the authenticated producer/admin

The design direction is **"Cinematic Atlas"** — full-bleed drone footage leads; named chapters (Casa · La Vega · El Bosque · La Cumbre · Beneficio) function as the site's spine; editorial serif typography carries emotional beats; monospace/sans handle data. Palette: **Amanecer** (deep blue + dawn ochre).

---

## About the Design Files

The files in `reference/` are **design references created in HTML** — React prototypes rendered on a pan/zoom design canvas that show intended look and behavior. **They are not production code to copy directly.** 

The task is to **recreate these designs in the target codebase's environment** (if none exists yet, I recommend **Next.js (App Router) + Tailwind CSS + Framer Motion**, with `@vercel/postgres` or Supabase for Journal/admin — typical for a content-led marketing site with a private authoring surface).

The prototypes are **low-to-mid fidelity wireframes** — layout, structure, typography system, color tokens, content hierarchy, and interaction intent are all final. Real drone video, real photography, final copywriting, and pixel-perfect micro-details are to be produced during implementation using the tokens and structure defined here.

---

## Fidelity

**Low-to-mid fidelity.** Use as a guide for:
- Layout structure, grid, and section rhythm ✅ final
- Typography pairing + scale ✅ final
- Color palette + tokens ✅ final (Amanecer)
- Content hierarchy and copy tone ✅ final (draft copy provided)
- Interaction model ✅ final
- Imagery and video ❌ placeholders — to be produced/shot
- Exact micro-spacing ❌ use tokens below, refine in implementation

---

## Direction: Cinematic Atlas (chosen)

### Visual language

- **Full-bleed dark hero** with looping, auto-play muted drone footage
- **Dark-by-default** palette — the whole site reads like a nocturnal/dusk document
- **Chapter-based navigation** — the farm's plots become the spine of the site
- **Editorial serif italic** for emotional beats — especially in the second clause of headlines ("From lines of code *to lines of* coffee trees")
- **Monospace** for data, filing metadata, captions, chapter labels
- **Clean sans** for body + UI
- **Subtle ochre accents** pull focus to CTAs and italic callouts

### Palette — Amanecer (deep blue + dawn ochre)

| Token              | Hex       | Usage                                           |
| ------------------ | --------- | ----------------------------------------------- |
| `--bg`             | `#1b2437` | Page background, dominant dark                  |
| `--surface`        | `#243049` | Elevated cards, secondary sections              |
| `--paper`          | `#fef5e2` | Pure light for contrast moments                 |
| `--ink`            | `#fef5e2` | Primary foreground (on dark bg)                 |
| `--ink-2`          | `#c5cad6` | Secondary foreground (body copy)                |
| `--ink-3`          | `#8893a6` | Tertiary / meta / captions                      |
| `--line`           | `rgba(254,245,226,0.14)` | Hairline dividers                    |
| `--line-strong`    | `rgba(254,245,226,0.28)` | Prominent dividers, button borders   |
| `--accent`         | `#e89b4a` | Primary accent — CTAs, active chapter indicator |
| `--accent-2`       | `#f5c98a` | Secondary accent — italic serif highlights      |
| `--shadow`         | `rgba(0,0,0,0.35)` | Elevated surfaces                      |

### Typography

Load from Google Fonts:
```
Instrument Serif (400, italic)
Geist (300, 400, 500, 600)
JetBrains Mono (400, 500)
```

| Role          | Family                       | Notes                                          |
| ------------- | ---------------------------- | ---------------------------------------------- |
| Display       | **Instrument Serif**         | Headlines, section openers, pull quotes. Use italic liberally for warmth. |
| Body / UI     | **Geist**                    | Body copy, buttons, nav, form fields           |
| Data / meta   | **JetBrains Mono**           | Chapter labels, stats, timestamps, figcaptions |

**Type scale** (desktop baseline — scale down ~25% at ≤768px):

| Token   | Size  | Line-height | Letter-spacing | Family                | Weight |
| ------- | ----- | ----------- | -------------- | --------------------- | ------ |
| `h1`    | 84px  | 0.92        | -0.025em       | Instrument Serif      | 400    |
| `h2`    | 54px  | 1           | -0.02em        | Instrument Serif      | 400    |
| `h3`    | 36px  | 1.15        | -0.01em        | Instrument Serif      | 400    |
| `h4`    | 24px  | 1.2         | -0.01em        | Instrument Serif      | 400    |
| `body`  | 14px  | 1.55        | normal         | Geist                 | 400    |
| `small` | 12px  | 1.45        | normal         | Geist                 | 400    |
| `label` | 10px  | 1.2         | 0.2em          | JetBrains Mono        | 500    |
| `meta`  | 9px   | 1.2         | 0.15em         | JetBrains Mono        | 400    |

**Capitalization:** all `label`/`meta` text is uppercase. Body never is.

### Spacing scale

4-point base. Use: `4, 8, 12, 16, 20, 24, 32, 40, 56, 80, 120`.

### Border radius

**2px** everywhere. No rounded pills, no large radii — this is the defining "editorial/document" feel. Avatars are the single exception (full circle).

### Shadows

Largely avoided — the dark palette + hairline dividers do the layering work. One exception: the Tweaks panel and any floating menu use `0 4px 20px rgba(0,0,0,0.35)`.

---

## Screens / Views

The site is a **single long-scroll page** with anchor navigation. Nav items: `Story · The Farm · Coffee · Stay · Journal · Contact`. Language toggle `EN / ES` in nav.

### 1. Hero (full-bleed cinematic)

**Purpose:** Immediate emotional payload — drop the viewer on the ridge.

**Layout:** 100vh, flex column.
- Top: Nav bar (transparent, compact, 14px 28px padding)
- Center: Centered text block, max-width 760px
- Bottom: Chapter strip (bordered-top hairline)

**Components:**
- **Background:** Looping 4K drone video, `autoplay muted loop playsInline`. Dark gradient overlay `linear-gradient(180deg, #1b243755 0%, #1b243722 35%, #1b2437ee 100%)` to keep text legible.
- **Eyebrow** (meta style): `MANIZALES · COLOMBIA · 1.300 MASL`
- **Headline** (h1): `From lines of code<br/>*to lines of* coffee trees.` — second line uses `font-style: italic; color: var(--accent-2)` on "to lines of" and regular weight on "coffee trees"
- **Subhead** (body, `--ink`, opacity 0.8, max-width 440px): "A small production project in the hills of Manizales — documented in drone footage, field notes, and every batch of coffee we ship."
- **Primary CTA:** large (72×72) circular play button with 1.5px `--ink` border; label to the right reads `Start the tour` (h4 italic) + `5 CHAPTERS · 08:42` (meta) below. Clicking it scrolls to chapter 1 AND unmutes the hero video.
- **Chapter strip** (bottom): horizontal row of `01 CASA · 02 LA VEGA · 03 EL BOSQUE · 04 LA CUMBRE · 05 BENEFICIO`. Active chapter underlined with 1.5px `--accent-2`. Clicking scrolls to the section.
- **Scroll hint** (left of chapter strip): `↓ SCROLL TO EXPLORE`

### 2. Story (Chapter 01 — The Producer)

**Purpose:** Establish the founder, the "tech → coffee" hook.

**Layout:** 3-column grid `80px | 1fr | 300px`, 30px gap, 40px padding.

**Components:**
- **Column 1:** Chapter label `CHAPTER` (meta), big chapter number `01` (Instrument Serif, 64px, `--accent`)
- **Column 2:**
  - h2: `The *producer*.` (italic on "producer", `--accent-2`)
  - Drop cap `I` — 72px Instrument Serif italic, `--accent`, floated next to the first paragraph
  - Body copy: ~3 short paragraphs telling the tech→coffee story
- **Column 3:**
  - Portrait photo (4:5 aspect), figcaption italic: "Fig 1. Among the first Caturra rows, 2021."
  - Card below — 1px `--line` border, 12px padding:
    - Label: `PREVIOUSLY`
    - h4 italic: "Software engineer, 12 years."

### 3. The Farm (Chapter 02)

**Purpose:** The place, the shape of it, the history.

**Layout:** 40px padding.
- Top: chapter label + h2 headline
- Row 1: 2-column grid `1.3fr | 1fr` — schematic map + stats grid
- Row 2 (separated by hairline): horizontal milestones

**Components:**
- **h2:** `The farm, *and how it got here.*`
- **Schematic map** (260px tall):
  - `--surface` background, 1px `--line` border
  - SVG contour lines (6 curved paths at varying Y, 0.25 opacity) — represents topography
  - One `--accent-2` stroke path near the bottom = the main ridge trail
  - 3 plot markers: `LA VEGA (1)`, `EL BOSQUE (2)`, `LA CUMBRE (3)` — each a 68×48 rectangle with 1.5px `--ink` border, `--accent` @ 20% alpha fill, centered pill containing the plot number (`--accent-2` bg, `--bg` text, 10px mono). Label below in 8px mono.
  - Annotation top-right: "click plot → chapter" (accent2 mono italic)
- **Stats grid** (2×3 on desktop):
  - `ALTITUDE · 1.300 m`
  - `AREA · 4.2 ha`
  - `PLOTS · 3`
  - `VARIETALS · 3`
  - `PROCESS · Washed · Anaerobic · Carbonic` (spans 2 columns)
  - `PLANTED · 2021`
  - Each: 12px padding, 1px `--line` border, 2px radius, label in meta style, value in Instrument Serif italic 22px `--accent-2`
- **Milestones** (6 columns, equal width, 12px gap):
  - Top border 1.5px (color: `--accent` for accent items, `--line` otherwise), 8px top padding
  - Year: Instrument Serif italic 22px (`--accent` for accent, `--ink` otherwise)
  - Title: body 11px, `--ink-2`
  - Entries:
    - 2018 · First visit
    - 2020 · Quit tech
    - **2021 · Seedlings** (accent)
    - 2023 · Beneficio
    - **2024 · First export · 88+ SCA** (accent)
    - 2025 · Stay opens

### 4. Chapter scrolly (repeated per plot)

**Purpose:** The core cinematic experience — one per plot. The layout pins on scroll so editorial text remains visible while the video progresses.

**Layout:** 2-column `42% | 58%`, full viewport height when pinned. Right side has `border-right: 1px var(--line)` on the left column instead.

**Components:**
- **Left (pinned text):** 44px 34px padding
  - Chapter label in accent: `CHAPTER 03 · EL BOSQUE`
  - h2: `Pink Bourbon,<br/>*under guamo shade.*` (italic + `--accent-2` on second line)
  - 4 paragraphs of body copy
  - 3 stat tiles (same style as Farm stats): `ALT 1.420 m · AREA 0.9 ha · YEAR 2021`
  - Bottom: `03 / 05` + progress bar (2px high, `--line` track, `--accent` fill)
- **Right (video):**
  - `--surface` bg, play button center (64×64 circle)
  - Interactive pins: small 22×22 accent circles with number; clicking reveals a label card (Instrument Serif italic, `--bg` background, 3px 8px padding)
    - Pin 1 at ~26% 34% — "seedling row"
    - Pin 2 at ~62% 58% — "guamo shade"
  - Scrubber strip at bottom: 2px track, accent2 played portion, 8×8 handle dot, `00:42 / 01:48` mono readout

**Implement 3–5 chapter sections using this template, one per plot + beneficio.**

### 5. Coffee (Chapter — What we grow)

**Purpose:** Two funnels, side by side.

**Layout:** 40px padding block, then a 2-column split with 2px gap showing through as `--line` color.

**Components:**
- **h2:** `What we *grow.*`
- **Two cards** — each:
  - Tag at top-left — `B2B` or `Direct` — in accent outline pill
  - `01 / 02` index top-right (meta)
  - h3: `Green coffee` / `Roasted coffee`
  - Subhead in `--ink-2`: "for roasters · full lot specs + samples" / "for drinkers · small drops, ships from farm"
  - Placeholder image (100px tall)
  - Chip row: `caturra · pink bourbon · geisha`
  - Bottom row: meta note "Lead-gen inquiry form · no cart yet" + CTA button
    - CTA: `--accent` background, `--bg` text, 7px 12px, 10px mono uppercase: `Request samples ↗` / `Join the waitlist ↗`
- **Pull quote slab** (below the split, `--surface` bg, 36px 80px padding, hairline top):
  - Instrument Serif 36px: `"We treat every lot like a deploy.` (not italic) / `*Versioned, logged, and reviewable."*` (italic + `--accent-2`)
  - Byline (mono meta, `--ink-3`): `— THE PRODUCER`

### 6. Stay (Chapter 05)

**Purpose:** Showcase the farmhouse + drive to the external booking form.

**Layout:** Header row (title + Week/Weekend toggle), then a **6-column × 3-row bento grid** with 8px gaps.

**Bento cells:**
| Grid span        | Content                           |
| ---------------- | --------------------------------- |
| col 1–4, row 1–2 | Main hero photo (porch)           |
| col 5–6, row 1   | Guest bedroom                     |
| col 5–6, row 2   | Kitchen garden                    |
| col 1–2, row 3   | Sunrise                           |
| col 3–4, row 3   | House tour video                  |
| col 5–6, row 3   | **Price card** (dashed border)    |

**Price card:**
- 1px `--line-strong` dashed border, 2px radius, 16px padding
- Top: meta label `FROM`
- Big price: Instrument Serif italic 34px `--accent-2` (placeholder `$ / night`)
- Body 11px `--ink-2`: "All meals + farm tour included."
- Bottom CTA: `--paper` bg, `--bg` text, full-width, `Check dates ↗`

**Header row:**
- h2: `Sleep at *Bellavista.*`
- Right: two toggle buttons — `Week` (outline) · `Weekend` (filled accent). These drive the booking form preset.

### 7. Journal + Contact footer

**Purpose:** Latest field posts + contact.

**Layout:** 40px padding. Split grid `1.4fr | 1fr`, 18px gap.

**Components:**

**Header row:**
- h2: `From the *field.*`
- Subhead: "Public posts showcase projects. Private entries track experiments — producer only."
- Right: filter chips `[All] · Projects · Experiments` (All = accent outline; others = regular outline)

**Left column — Featured post:**
- Meta label: `FEATURED · PROJECT`
- Cover image (180px tall)
- Post meta: `APR 18 · PROJECT · PUBLIC`
- h3: `*Anaerobic* fermentation, week 3.`
- 2-line placeholder excerpt

**Right column — Recent list:** 5 rows, each a grid `56px | 1fr | 72px`:
- Date (mono 10px `--ink-3`)
- Title (Instrument Serif 16px)
- Tag: `public` (accent outline) or `private` (plain outline)
- Hairline between rows

**Footer slab** (`--surface` bg, hairline top, 24px 40px):
- Left: meta label `CONTACT`, h3 italic "Come visit. Or stay in touch.", address line (body, `--ink-2`): `hello@bellavistacoffee.co · @bellavista.coffee`
- Right: `Subscribe` CTA (accent) + `Admin →` button (outline)

---

## Journal system (the dual-purpose piece)

This is the most substantive feature beyond the marketing surface.

### Data model (suggested)

```ts
type JournalEntry = {
  id: string;
  slug: string;              // kebab-case, unique for public entries
  title: string;
  date: string;              // ISO
  kind: 'project' | 'experiment' | 'visit';
  visibility: 'public' | 'private';
  cover_image_url?: string;
  body_md: string;           // markdown
  tags: string[];
  plot?: 'la_vega' | 'el_bosque' | 'la_cumbre' | 'beneficio' | null;
  // Experiment-specific structured data
  metrics?: {
    ph?: number;
    brix?: number;
    temp_c?: number;
    batch_id?: string;
    notes?: string;
  };
  created_at: string;
  updated_at: string;
};
```

### Behavior

- **Public feed** renders only `visibility === 'public'`. Default sort desc by date.
- **Admin surface** (`/admin`) — authenticated only:
  - List ALL entries (public + private)
  - Filter by kind and visibility
  - Entry editor with markdown body + structured metrics block for experiments
  - **Publish toggle:** flipping `visibility: private → public` promotes an entry to the public feed
  - Quick-add for experiment rows (minimal fields: date + one-line note + optional metrics)
- **Auth:** single admin account (producer). Email+password or magic link via NextAuth/Auth.js is sufficient.
- **Public entry pages:** `/journal/[slug]` — standard MD rendering, respects the site's type system.

### Filtering on public feed

Chips `[All · Projects · Experiments]` filter `kind` client-side. Experiments on public feed render with their metrics block.

---

## Interactions & behavior

### Navigation
- Sticky top nav, becomes opaque (with `--bg` fill) after scrolling past hero. Nav links scroll smoothly to anchors.
- Chapter strip in hero: `scrollIntoView({ behavior: 'smooth' })` to the corresponding section. Active state updates via IntersectionObserver on section elements.

### Hero
- Video autoplays muted on load. Clicking the giant play button unmutes. Pausing isn't exposed — keep it ambient.

### Chapter scrolly sections
- The left column is `position: sticky; top: 0` within a 2–3× viewport-height container so it pins while the right column's video plays through.
- Pins on the video reveal label cards on hover (desktop) or tap (mobile). No complex timeline — just static annotations.

### Coffee CTAs
- Both CTAs open inline forms (modal or drawer):
  - **Request samples** — fields: Company, Name, Email, Country, Monthly volume, Notes → sends to `leads@bellavistacoffee.co` + writes to a `leads` table
  - **Join the waitlist** — fields: Email, Name → writes to `waitlist` table

### Stay CTAs
- Toggle (Week/Weekend) sets a preset on the booking form
- Main CTA (`Check dates`) opens external booking form (Stays/Lodgify/Bookwize — TBD by client) in new tab. Fall back to an inline inquiry form if no external platform is set.

### Animations
Deliberately restrained. Use Framer Motion (or CSS) for:
- Fade-up on section enter: `opacity 0 → 1`, `y 20 → 0`, duration 0.6s, easeOutCubic
- Italic serif highlights can get a subtle delayed reveal (0.15s after their parent)
- Chapter scrolly: progress bar animates width based on scroll progress within the pinned block
- No parallax on hero — the drone video already carries motion

### Responsive
- Break at 1024px (hero h1 → 60px, 3-col grids collapse to 2) and 640px (hero h1 → 40px, 2-col grids collapse to 1, bento becomes a vertical stack preserving the hero image first).
- Chapter scrolly sections drop pinning on mobile; video sits above text.

### Language toggle
- `EN / ES` toggle in nav. Implement as locale routing (`/en`, `/es`) with a dictionary per route. English copy lives in this handoff; Spanish copy is TBD (client will provide).

---

## State management

Marketing page is largely static/server-rendered. Client state needed only for:
- Active nav anchor (IntersectionObserver)
- Video mute/unmute
- Stay toggle (Week/Weekend)
- Journal filter chip (All/Projects/Experiments)
- Forms (request samples, waitlist, inquiry)
- Admin: editor state (controlled inputs), auth session

No global store required. React Context or URL state is sufficient.

---

## Assets

All imagery in the prototype is placeholder (diagonal-stroke boxes with labels). Production assets to produce:

- **Hero drone video** — looping, ~20s, 4K, muted-ambient. Key shot: ridge fly-over at dawn.
- **Plot b-roll** — one 60–120s video per plot (La Vega, El Bosque, La Cumbre) + one for the beneficio.
- **Portrait of the producer** — 4:5 aspect.
- **Farmhouse photography** — main house, guest bedroom, kitchen garden, sunrise view.
- **Schematic map** — hand-drafted contour + plot placements (can start as SVG per prototype; upgrade to artist-drawn version later).
- **Favicon + social OG image.**

All assets should be served from the CDN (Vercel Image Optimization, Cloudinary, or similar).

---

## Files in `reference/`

- `Bellavista Wireframes v3.html` — open in a browser to see all directions and frames on a design canvas. Direction C is the chosen one; scroll to its row. Amanecer palette is the live default.
- `wireframes/direction-c.jsx` — the source for Direction C, including `DC_Home`, `DC_Story`, `DC_Farm`, `DC_Chapter`, `DC_Coffee`, `DC_Stay`, `DC_Journal`, and the `PALETTES_C` token set (includes both Ceniza and Amanecer — Amanecer is the chosen one).
- `wireframes/shared-v2.jsx` — shared primitives (nav, tags, image/video placeholders, typography CSS) used across directions.
- `wireframes/palettes.jsx` — all 5 palette explorations with full type pairings (for historical context).
- `design-canvas.jsx` — the pan/zoom canvas runtime the prototype uses (not needed for implementation).

## Screenshots

Rendered previews of each frame in `screenshots/` (Amanecer palette). Note: frames are designed at 960×680; screenshots were captured at ~920px width so some type may wrap slightly tighter than intended — the HTML prototypes are the source of truth for spacing.

| # | File | Section |
|---|------|---------|
| 1 | `screenshots/01-hero.png` | Full-bleed cinematic hero |
| 2 | `screenshots/02-story.png` | Chapter 01 · The producer |
| 3 | `screenshots/03-farm.png` | Chapter 02 · The farm (map + milestones) |
| 4 | `screenshots/04-chapter-scrolly.png` | Pinned scrolly chapter template |
| 5 | `screenshots/05-coffee.png` | Coffee split (B2B + Direct) + pull quote |
| 6 | `screenshots/06-stay.png` | Stay · bento |
| 7 | `screenshots/07-journal-contact.png` | Journal feed + contact footer |

---

## Recommended implementation stack

If no codebase exists yet:

- **Next.js 14 (App Router)** + TypeScript
- **Tailwind CSS** — define the palette/type tokens in `tailwind.config.ts`:
  ```ts
  colors: {
    bg: '#1b2437',
    surface: '#243049',
    paper: '#fef5e2',
    ink: { DEFAULT: '#fef5e2', 2: '#c5cad6', 3: '#8893a6' },
    accent: { DEFAULT: '#e89b4a', 2: '#f5c98a' },
  }
  ```
- **Framer Motion** — enter animations
- **next/font** — load Instrument Serif, Geist, JetBrains Mono
- **next/image** — all imagery
- **next/video** or HTML `<video>` — hero + chapter videos
- **NextAuth.js** — admin auth
- **Supabase** (Postgres + auth + storage) or **@vercel/postgres + Vercel Blob** — Journal entries + admin storage
- **MDX** for long-form journal posts
- **Vercel** for hosting

---

## Copy inventory (English)

All final English copy currently in the prototypes. Spanish translations are owed by the client.

**Hero**
- Eyebrow: `MANIZALES · COLOMBIA · 1.300 MASL`
- Headline: `From lines of code / to lines of coffee trees.`
- Subhead: `A small production project in the hills of Manizales — documented in drone footage, field notes, and every batch of coffee we ship.`
- Primary CTA: `Start the tour` / `5 CHAPTERS · 08:42`

**Story headline:** `The producer.`
**Farm headline:** `The farm, and how it got here.`
**Chapter example:** `Pink Bourbon, under guamo shade.`
**Coffee headline:** `What we grow.`
**Coffee CTA (B2B):** `Request samples ↗`
**Coffee CTA (Direct):** `Join the waitlist ↗`
**Pull quote:** `"We treat every lot like a deploy. Versioned, logged, and reviewable."`
**Stay headline:** `Sleep at Bellavista.`
**Stay subhead:** `Four guests · restored farmhouse · meals from the land. Book by the week or the weekend.`
**Journal headline:** `From the field.`
**Journal subhead:** `Public posts showcase projects. Private entries track experiments — producer only.`
**Contact headline:** `Come visit. Or stay in touch.`

---

## Open questions for the client

Before implementation starts, confirm with the client:

1. Booking platform choice (Lodgify, Hostaway, direct inquiry, …?)
2. B2B lead destination (inbox only? add CRM like HubSpot/Attio?)
3. Admin auth preference (magic link vs password)
4. Spanish copy — who writes it, and when
5. Drone/video production timeline
6. Payments for roasted-coffee drops — out of scope for v1 (waitlist only), confirm
