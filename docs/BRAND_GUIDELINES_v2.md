# Bellavista Coffee — Brand Guidelines · v2

> Supersedes v1 (Amanecer). Single-estate specialty coffee · Manizales, Colombia.

## 01 · Color System

**Palette: Onyx + Paper.**
Deep onyx canvas with cream paper promoted from accent to active second surface. Ochre dawn accent carries over from v1 unchanged.

### Mood
Editorial, high-contrast, gallery-publication. Onyx night, cream daylight, ochre as the connecting warmth.

### Tokens

| Role | Hex | Use |
|---|---|---|
| **Onyx (bg)** | `#0C0C0A` | Primary canvas — hero, farm, stay, journal |
| **Surface** | `#1A1A17` | Cards and panels on dark |
| **Paper** | `#F6EFD9` | Active second surface — bands, price tiles, specs |
| **Paper surface** | `#EBE0C0` | Cards on paper |
| **Accent** | `#E89B4A` | CTAs, ochre dawn — unchanged from v1 |
| **Accent-2** | `#F5C98A` | Soft glow, italic emphasis on dark |
| **Accent (on paper)** | `#B8742A` | Deepened ochre for legibility on cream |
| **Ink** | `#FEF5E2` | Headlines and body on dark |
| **Ink-2** | `#C9C4B3` | Secondary text on dark |
| **Ink-3** | `#7A766B` | Captions, meta on dark |
| **Ink (on paper)** | `#1F1A12` | Headlines and body on paper |
| **Ink-2 (on paper)** | `#4A3D28` | Secondary text on paper |
| **Ink-3 (on paper)** | `#8B7A5D` | Captions, meta on paper |

### Section rhythm
Alternate **Onyx** chapters with **Paper** bands. Paper isn't decoration — it carries chapter breaks (lot specs, journal indexes, price tiles). The contrast does the editorial work.

## 02 · Typography

Both logo fonts are Google Fonts under the SIL Open Font License v1.1 — free to bundle, commercial use included.

### Instrument Serif — wordmark "Bellavista"

- **Weights used:** 400 Regular + 400 Italic
- **Designer:** Instrument (agency) + Rodrigo Fuenzalida + Jérémie Hornus
- **Google Fonts:** https://fonts.google.com/specimen/Instrument+Serif
- **GitHub (canonical):** https://github.com/Instrument/instrument-serif

### JetBrains Mono — captions "COFFEE FARM", "STAY · PAUSE · CONTEMPLATE"

- **Weights used:** 400 Regular
- **Google Fonts:** https://fonts.google.com/specimen/JetBrains+Mono
- **Official site:** https://www.jetbrains.com/lp/mono/
- **GitHub:** https://github.com/JetBrains/JetBrainsMono

### Geist Sans — body / UI

- **Role:** Body copy, UI elements, navigation links
- **Substitute:** Helvetica or system-ui sans-serif

### Font roles

- **Display / Headlines** — Instrument Serif (italic feels classical)
- **Body / UI** — Geist Sans (Helvetica is a working substitute)
- **Meta / Labels** — JetBrains Mono · uppercase · letter-spacing 0.2em

### Self-hosting (for suppliers without Google Fonts access)

Download `.ttf` files from the Google Fonts links above. For the logo specifically, only two files are needed:
- `InstrumentSerif-Regular.ttf`
- `InstrumentSerif-Italic.ttf`
- `JetBrainsMono-Regular.ttf`

## 03 · Visual Character

- **Generous space.** Let onyx breathe. Negative space is a feature.
- **Sharp corners.** 2px radius. Almost rectilinear.
- **Soft elevation.** `0 4px 20px rgba(0, 0, 0, 0.5)` on raised surfaces (slightly deeper than v1 for onyx).
- **High contrast, not neon.** Cream is the daylight; ochre is the warmth. No pure white, no pure orange.
- **Editorial type pairing.** Instrument Serif sets the tone. Geist Sans does the work.

## 04 · Logo System

### The mark

A minimalist **ridge-line** silhouette — two mountain peaks with an ochre sun dot and a baseline. Represents the view from Bellavista: the Andes ridgeline at sunset.

**SVG path data (viewBox 0 0 100 100):**
```svg
<path d="M8 75 L34 42 L50 58 L70 28 L92 75 Z" fill-opacity="0.06"/>
<path d="M8 75 L34 42 L50 58 L70 28 L92 75"/>
<circle cx="70" cy="18" r="2.4"/>   <!-- ochre sun dot -->
<path d="M8 84 L92 84"/>             <!-- ochre baseline -->
```

### The wordmark

**Bella***vista* — Instrument Serif 400. The brand's signature gesture: roman "Bella" + italic "vista" in ochre. This roman/italic dialogue is the recognizable typographic identity and must be preserved across all applications.

### Variants

| # | Name | Surface | Use |
|---|---|---|---|
| 01 | Canonical | Onyx | Hero, formal print, signage |
| 02 | All-caps display | Onyx | Editorial, split-bleed treatments |
| **03** | **Horizontal** | **Paper / Onyx** | **Primary — nav, packaging, merch, headers** |

**03 · Horizontal** is the primary lockup:
```
[ridge mark]  |  Bellavista
                 COFFEE FARM
                 STAY · PAUSE · CONTEMPLATE
```

### Color on each surface

| Element | On Paper | On Onyx |
|---|---|---|
| Mark stroke | `#1F1A12` | `#FEF5E2` |
| Mark fill | `#1F1A12` @ 6% | `#FEF5E2` @ 6% |
| Sun dot + baseline | `#B8742A` | `#F5C98A` |
| "Bella" | `#1F1A12` | `#FEF5E2` |
| "vista" (italic) | `#B8742A` | `#F5C98A` |
| "Coffee Farm" | `#B8742A` | `#F5C98A` |
| Tagline | `#8B7A5D` | `#7A766B` |
| Divider | `rgba(31,26,18,0.22)` | `rgba(254,245,226,0.20)` |

### Typography specs

| Element | Family | Size (full) | Tracking |
|---|---|---|---|
| Wordmark | Instrument Serif 400 | 160px | -0.025em |
| "Coffee Farm" | JetBrains Mono 400 | 17px | 0.5em |
| Tagline | JetBrains Mono 400 | 13px | 0.32em |

### Usage rules

- **Minimum size:** wordmark ≥ 22px (digital), ≥ 72pt (print).
- **Clear space:** ½ cap-height of the wordmark on all sides.
- **Tagline:** "STAY · PAUSE · CONTEMPLATE" is part of the full lockup. Omit in space-constrained contexts (nav, favicon, embroidery).
- **DO:** use provided color pairings; scale proportionally; keep mark + wordmark together in the horizontal lockup.
- **DON'T:** recolour outside the token set; stretch or distort; add drop-shadow to the mark; separate the mark from the wordmark in the horizontal lockup; rotate the mark.

### Assets

| File | Path |
|---|---|
| Horizontal · Paper (SVG) | `/public/brand/logo-horizontal-paper.svg` |
| Horizontal · Onyx (SVG) | `/public/brand/logo-horizontal-onyx.svg` |
| Ridge mark only (SVG) | `/public/brand/logo-mark.svg` |
| React component | `/components/BellavistaWordmark.tsx` |

## Changelog
- **v3** — Logo system added (§04): ridge mark, three wordmark variants, horizontal lockup wired to nav. Tagline updated to "STAY · PAUSE · CONTEMPLATE". SVG assets exported. `BellavistaWordmark.tsx` component created.
- **v2** — Replaces Amanecer blue (`#1B2437`) with Onyx (`#0C0C0A`). Paper promoted to active surface with its own ink scale.
- **v1** — Amanecer (deep blue + dawn ochre).
