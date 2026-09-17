# SCAT — site design

Website design for **SCAT** ($SCAT), a Solana cat-mascot token whose holders are paid
rewards in $SOL.

- **Design language:** Solana Mobile / Seeker — true black, monochrome, one green accent
- **Voice and content pattern:** Seeker Reviewer's Guide — a feature name, a one-line
  promise, then bold-lead claims ("Paid to your wallet. Real $SOL — not points.")
- **Block rhythm:** raycatsolana.com, loosely — ticker, nav, hero with a CA field and
  status pills, then our own sections rather than a copy of theirs

The design lives as artboards in `design/`, authored in the `.dc.html` artboard format and
laid out by `design/canvas.json`.

## Artboards

| File | Frame | Contents |
| --- | --- | --- |
| `Main.dc.html` | 1440 × 2274 | Whole desktop page |
| `Mobile.dc.html` | 390 × 3280 | Same page stacked for phone |
| `Foundations.dc.html` | 1100 × 620 | Palette, type scale, controls, hex mark |

## Page blocks

Takes the reference's rhythm in blocks 1–3, then goes its own way:

1. **Marquee ticker** — mono uppercase claims separated by green diamonds
2. **Nav** — hex `S` mark + `SCAT` wordmark, section links, outlined BUY button
3. **Hero** — meta row, `$SCAT` display wordmark, "The cat that rides in your Seeker.",
   mascot paragraph, CA field with COPY, two CTAs, three status pills; mascot at right
   inside a double hexagon frame with a single green glow
4. **What you get** — three cards in the Reviewer's Guide pattern: rewards in $SOL,
   your keys stay yours, built on Solana
5. **How it works** — 01 Buy / 02 Hold / 03 Collect, on accent-to-grey rules
6. **Stat band** — rewards paid, holders, supply, reward token
7. **Footer** — mark, socials, risk and non-affiliation disclaimer

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
- **Palette is not measured from the press kit.** The supplied Drive file is the Seeker
  *Reviewer's Guide* — mission, features (Seed Vault, Seeker ID, Genesis Token, SKR, dApp
  Store, TEEPIN), hardware and quick-start. It carries no hex values or typefaces. Its
  content and voice are reflected in the copy; the colours above remain the Solana Mobile
  direction plus the verified Solana brand green. A brand/style-guide file with colour and
  type specs would let these be exact.
- Launch facts are bracketed placeholders: contract address, supply, holders, rewards
  paid, socials handle.
- Claims are deliberately narrow: no Seeker Season, dApp Store or Seed Vault *integration*
  is asserted anywhere — only that a Seeker owner's keys live in their own Seed Vault.
