# SCAT — site design

Website design for **SCAT** ($SCAT), a Solana cat-mascot token whose holders are paid
rewards in $SOL.

- **Design language:** Solana Mobile / Seeker — true black, monochrome, one green accent
- **Block structure:** raycatsolana.com — a single screen: ticker, nav, hero, footer

The design lives as artboards in `design/`, authored in the `.dc.html` artboard format and
laid out by `design/canvas.json`.

## Artboards

| File | Frame | Contents |
| --- | --- | --- |
| `Main.dc.html` | 1440 × 980 | Whole page: marquee ticker, nav, hero, legal footer |
| `Mobile.dc.html` | 390 × 1240 | Same page stacked for phone |
| `Foundations.dc.html` | 1100 × 620 | Palette, type scale, controls, hex mark |

## Page blocks

Mirrors the reference one-for-one:

1. **Marquee ticker** — mono uppercase claims separated by green diamonds
2. **Nav** — hex `S` mark + `SCAT` wordmark, links: X / CHART / BUY
3. **Hero** — meta row, `$SCAT` display wordmark, "The Solana cat that pays rent in $SOL.",
   mascot paragraph, CA field with COPY, two CTAs, three status pills, mascot at right
4. **Footer** — risk disclaimer, social links

## Color tokens

True black ground, monochrome greys, a single green accent. No purple and no gradient
headings: the accent reads because nothing else competes with it.

| Token | Value | Use |
| --- | --- | --- |
| `page` | `#000000` | Page background |
| `ticker` | `#050506` | Ticker strip, footer panels |
| `field` | `#0D0D10` | Inputs, secondary button |
| `chip` | `#15151A` | COPY button |
| `hairline` | `#1A1A1E` | Section dividers, pill borders |
| `border` | `#2A2A30` | Control borders |
| `legal` | `#6E6E78` | Disclaimer text |
| `dim` | `#8E8E96` | Mono labels, secondary text (6.4:1 on `page`) |
| `soft` | `#C9C9D1` | Pill labels |
| `text` | `#FFFFFF` | Primary text |
| `accent` | `#14F195` | `$` glyph, `$SOL`, primary CTA, live dot |
| `accent-hi` | `#00FFA3` | Hover |

Accent glow: `radial-gradient(circle, rgba(20,241,149,0.16), transparent 68%)` behind the
mascot, once per page.

## Type

- **Display:** Space Grotesk 700, `-0.055em` — `$SCAT` at 122px; subhead 500 at 37px
- **Body:** Manrope 400–700 — 16px / 1.7; disclaimer 13px
- **Labels, ticker, pills, CA:** JetBrains Mono 500, `0.16–0.20em`, 10–12px uppercase

Radii: 10px controls, 999px pills. Touch targets ≥ 44px.

## Open items

- **Mascot art** is a labelled placeholder (392 × 430, transparent PNG) — the real file has
  not been supplied in a form the build can read.
- **Seeker press kit** has not been applied: the Drive folder is shared but its contents
  cannot be enumerated with the available tooling, so the palette above is the Solana
  Mobile direction plus the verified Solana brand green, not measured press-kit values.
- Launch facts are bracketed placeholders: contract address, socials handle.
