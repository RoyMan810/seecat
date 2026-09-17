# SEECAT — site design

Website design for **SEECAT** ($SEECAT), a Solana cat-mascot token whose holders are paid
rewards in $SKR.

- **Palette:** sampled pixel-by-pixel from `design/solanamobile.png`, not guessed
- **Voice and content pattern:** Seeker Reviewer's Guide — a feature name, a one-line
  promise, then bold-lead claims ("Paid to your wallet. Real $SKR — not points.")
- **Block rhythm:** raycatsolana.com, loosely — ticker, nav, hero with a CA field and
  status pills, then our own sections rather than a copy of theirs

The design lives as artboards in `design/`, authored in the `.dc.html` artboard format and
laid out by `design/canvas.json`.

## Artboards

| File | Frame | Contents |
| --- | --- | --- |
| `Main.dc.html` | 1440 × 2440 | Whole desktop page |
| `Mobile.dc.html` | 390 × 3410 | Same page stacked for phone |
| `Foundations.dc.html` | 1180 × 720 | Palette, type scale, controls |

Source files: `SCAT.png` (mascot, 1024², transparent), `Token_Seeker_3D.png` (the $SKR coin
in use, 1024², transparent), `Token_Seeker.png` (the earlier flat coin, 320², superseded)
and `solanamobile.png` (full-page reference screenshot, 1905 × 9535).

## Page blocks

Takes the reference's rhythm in blocks 1–3, then goes its own way:

1. **Marquee ticker** — uppercase claims separated by dim diamonds, `$SEECAT` in peach
2. **Nav** — hex mark + letterspaced `SEECAT` wordmark, section links, dark `Chart` pill
   and white `Buy $SEECAT` pill
3. **Hero** — meta row, `$SEECAT` display wordmark, "The cat that rides in your Seeker.",
   mascot paragraph, CA field with COPY, two CTAs, three status pills; mascot at right,
   standing against the $SKR coin and centred in two sunset blooms
4. **How it works** — 01 Buy / 02 Hold / 03 Collect, on accent-to-grey rules
5. **What holding gets you** — three cards in the Reviewer's Guide pattern: rewards in
   $SKR, your keys stay yours, built on Solana
6. **Stat band** — rewards paid, holders, supply, reward token
7. **Footer** — three large nav words, the mark with the X handle, then a rule and the
   risk and non-affiliation disclaimer

## Color tokens

Measured off the reference screenshot. The ground is **not** pure black, and there is no
flat accent colour anywhere on solanamobile.com — colour arrives as an ambient bloom
behind the subject and clipped into single glyphs.

| Token | Value | Use |
| --- | --- | --- |
| `page` | `#0C0C0E` | Page background (46% of the reference's pixels) |
| `field` | `#131316` | Contract field |
| `pill` | `#17171A` | Secondary pill |
| `border` | `#26262B` | Pill and field borders |
| `hairline` | `#1C1C20` | Section rules, grid cells, numbered-cell boxes |
| `body` | `#9B9BA3` | Body copy (6.5:1 on `page`) |
| `label` | `#8E8E96` | Tiny uppercase labels (6.2:1) |
| `legal` | `#6E6E76` | Disclaimer |
| `text` | `#FFFFFF` | Headings, bold leads, primary pill label |

### Sunset gradient

Sampled down the footer band of the reference at `x=120`, `y=8700…8970`:

`#7E4593` → `#B15292` → `#E8636C` → `#F6913F` → `#F9C18D` → `#FDF3E7`

violet → magenta → coral → orange → peach → cream. Used two ways only: as radial blooms
centred behind the mascot (warm, with violet riding above it), and clipped into the `$` of
`$SEECAT`, the word "Seeker" and `$SKR`. Step accents on the how-it-works rules take single
stops from it.

Three borrowings were cut on review: the full-bleed band above the footer, the hairline
vertical column rules in the hero, and the footer's `↳` link columns. Each works on the
reference because dense product content fills it; at this page's scale they read as
structure with nothing to hold.

## Type

One family, as the reference does:

- **Manrope 800** — `$SEECAT` at 130px, `-0.055em` (mobile 66px)
- **Manrope 600** — subhead 38px; footer nav words 34px
- **Manrope 700** — section headings 50 / 44 / 22px; bold caption leads
- **Manrope 400** — body 16 / 14px at 1.65
- **Manrope 500** — tiny uppercase labels, 10–11px at `0.14–0.18em`
- **JetBrains Mono** — the contract address string only, where a hash needs a mono face

Radii: 999px everywhere (pills, field, COPY), 8–10px on swatches. Touch targets ≥ 44px.

## Craft borrowed from the reference

- White pill primary CTA with a dark circular arrow badge set inside its right end
- Dark pill secondary with a hairline border
- Numbered grid cells: a small boxed `01` in the cell's top-left corner, on a hairline
  column rule between cells
- Caption pattern **`Bold lead.`** then grey continuation — the same construction the
  Seeker Reviewer's Guide uses throughout
- Footer: large grey nav words as the only navigation

## Open items

- **The Seeker Reviewer's Guide carries no colour or type spec.** It supplied the voice and
  the caption pattern; every colour above comes from the screenshot instead.
- The reference's display face is a wide geometric grotesque that is not a Google font.
  Manrope 800 at tight tracking is the closest freely available stand-in; swap in the real
  face if the press kit ships one.
- Launch facts are bracketed placeholders: contract address, supply, holders, rewards
  paid, socials handle.
- Claims are deliberately narrow: no Seeker Season, dApp Store or Seed Vault *integration*
  is asserted anywhere — only that a Seeker owner's keys live in their own Seed Vault.

## Naming

The token is **$SEECAT** and rewards are paid in **$SKR** — the native asset of the Solana
Mobile economy, as the Seeker Reviewer's Guide names it. An earlier pass read `$SCR`; that
was a typo and is corrected throughout.

One thing to square before launch: the Reviewer's Guide states plainly that **"SKR Token is
not live yet."** A live page saying rewards *are* paid in $SKR depends on that changing, and
$SKR is Solana Mobile's asset rather than this project's.
