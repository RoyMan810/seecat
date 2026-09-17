# SCAT — site design

Website design for **SCAT** ($SCAT), a Solana cat-mascot token whose holders are paid
rewards in $SOL.

- **Palette reference:** solanamobile.com / Solana brand
- **Content reference:** raycatsolana.com (structure, sections and voice, adapted for SCAT)

The design lives as a set of artboards in `design/`, authored in the `.dc.html` artboard
format and laid out by `design/canvas.json`.

## Artboards

| File | Frame | Section |
| --- | --- | --- |
| `Main.dc.html` | 1440 × 980 | Nav, hero, mascot plate, stat strip |
| `Rewards.dc.html` | 1440 × 980 | Rewards value props + 3-step "how it works" |
| `Story.dc.html` | 1440 × 980 | The cat's story, token spec, distribution |
| `Buy.dc.html` | 1440 × 980 | How to buy (4 steps), FAQ, footer |
| `Mobile.dc.html` | 390 × 844 | Hero at phone width |
| `Foundations.dc.html` | 1100 × 680 | Palette, type scale, controls |

## Color tokens

Dark, near-black ground with the Solana purple→green gradient used as a signature accent
rather than a background wash.

| Token | Value | Use |
| --- | --- | --- |
| `page` | `#08080C` | Page background |
| `raised` | `#0C0C14` | Raised panels, contract chip |
| `card` | `#0E0E16` | Cards |
| `chip` | `#141428` | Icon tiles, logo tile (purple-tinted dark) |
| `hairline` | `#1C1C26` | Section dividers, card borders |
| `border` | `#2A2A3C` | Control borders |
| `text` | `#F5F5F7` | Primary text |
| `text-dim` | `#9A9AAB` | Secondary text (7:1 on `page`) |
| `accent` | `#14F195` | Primary accent, CTAs (Solana green) |
| `accent-hi` | `#00FFA3` | Hover (Solana surge green) |
| `brand-2` | `#9945FF` | Solana purple — fills, borders, glows |
| `brand-2-text` | `#B57CFF` | Purple as text (lightened to clear 4.5:1) |

Signature gradient: `linear-gradient(94deg, #9945FF, #14F195)` — used for one word per
heading and for the ring around the mascot plate only.

## Type

- **Display:** Space Grotesk 700, letter-spacing `-0.045em` — 86 / 56 / 40 / 25px
- **Body:** Manrope 400–700 — 19 / 17 / 15px at 1.6
- **Labels & numbers:** JetBrains Mono 500, letter-spacing `0.18em` — 12px uppercase

Radii: 10 / 12 / 20 / 44px. Touch targets ≥ 44px.

## Placeholders

Facts that belong to the real launch are left as bracketed placeholders, not invented:
contract address, total supply, reward share, tax, payout schedule, liquidity and mint
authority status, rewards-paid and holder counts.
