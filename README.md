# SEECAT — site design

Website design for **SEECAT** ($SEECAT), a Solana cat-mascot token whose holders are paid
rewards in $SKR.

- **Palette:** sampled pixel-by-pixel from `design/solanamobile.png`, not guessed
- **Voice and content pattern:** Seeker Reviewer's Guide — a feature name, a one-line
  promise, then bold-lead claims ("Paid to your wallet. Real $SKR — not points.")
- **Block rhythm:** raycatsolana.com, loosely — ticker, nav, hero with a CA field and
  status pills, then our own sections rather than a copy of theirs

There are two things here:

- **`index.html` + `assets/`** — the actual site, built from the design system below.
- **`design/`** — the artboards it came from, in the `.dc.html` format, laid out by
  `design/canvas.json`.

## Deploying to seecatsol.com

The site is static — there is nothing to build and no runtime. Deploying is copying two
things into the web root:

```sh
rsync -av --delete index.html assets/ user@seecatsol.com:/var/www/seecatsol.com/
```

`design/`, `README.md` and the repo's other files are not part of the site and do not need
to be uploaded.

**Serve it over HTTPS.** Not just for the padlock: the COPY button on the contract field
uses the Clipboard API, which browsers only expose in a secure context. Over plain HTTP it
falls back to selecting the text instead of copying it. A Let's Encrypt certificate for the
apex plus `www` is enough.

Two things worth setting on the server:

- **Redirect `www` to the apex** (or the reverse), so one address is canonical. The page's
  `canonical` and `og:url` both say `https://seecatsol.com/`, so the apex is the one to
  land on.
- **Cache headers.** The filenames are not content-hashed, so a long `max-age` on
  `assets/img/*` is safe while `index.html`, the stylesheet and the script want something
  short — otherwise an edit will not reach people who have already visited.

Asset paths are all relative, so the site also runs from a subdirectory or a plain
`file://` open, which is handy for checking a build locally:

```sh
python3 -m http.server 8000     # then http://localhost:8000
```

### What is wired up

| | |
| --- | --- |
| Mobile nav | `aria-expanded` toggle, closes on link pick and on Escape, restored on resize |
| Copy button | Clipboard API with a selection fallback for non-secure origins, `COPIED` for 1.8s |
| Focus | `:focus-visible` rings on every link, button and input |
| Images | `width`/`height` set to reserve space; the coin is `aria-hidden`, the mascot carries the alt text |

### SEO and link previews

`index.html`'s head carries the title, description, canonical, robots, Open Graph, X card
and a `WebSite` JSON-LD block.

`canonical`, `og:url` and the JSON-LD `url` all point at **https://seecatsol.com/**, the
apex domain in `CNAME`. Keep the three in step if the domain ever changes.

**One thing left:** the favicon and preview banner are hosted on i.ibb.co, not in the repo
(`SEECAT.png` and `SEECAT-link.jpg`). That works, but an image host going down takes the
favicon and every link preview with it — worth vendoring both into `assets/img/`.

`og:image` must stay an **absolute** URL; scrapers do not resolve relative paths.

Verified in Chromium at 390, 768, 900, 1440 and 1920px: no horizontal overflow at any
width, and no console errors.

### Responsive behaviour

The artboards are fixed at 1440 and 390; the site is fluid between them.

- Type scales with `clamp()` — the wordmark runs 62 -> 130px.
- The hero goes two-column at **1080px**, not at the nav breakpoint: below that there is not
  enough width for the 700px copy column beside the figure without the coin crowding the
  wordmark.
- The mascot and coin scale as one unit. The figure carries `--fig-w`, and the coin is
  `137.25%` of it (700 / 510 from the artboard), so the cat's feet always land just inside
  the coin's lower face — 56px at desktop, 36px at phone width.
- Stacked layouts reserve `0.267 x --fig-w` above the figure, because the coin overhangs its
  own box by 26.9% and would otherwise ride up over the status dots.

## Artboards

| File | Frame | Contents |
| --- | --- | --- |
| `Main.dc.html` | 1440 × 2440 | Whole desktop page |
| `Mobile.dc.html` | 390 × 3410 | Same page stacked for phone |
| `Foundations.dc.html` | 1180 × 720 | Palette, type scale, controls |

The site's `assets/css/styles.css` carries the same tokens as CSS custom properties, so the
artboards and the build cannot drift apart silently.

Source files: `SCAT.png` (mascot, 1024², transparent), `Token_Seeker_3D.png` (the $SKR coin
in use, 1024², transparent), `Token_Seeker.png` (the earlier flat coin, 320², superseded)
and `solanamobile.png` (full-page reference screenshot, 1905 × 9535).

## Page blocks

1. **Nav** — hex mark + letterspaced `SEECAT` wordmark, section links, `Community`
   pointing at X, and the white `Buy $SEECAT` pill
2. **Hero** — meta row, `$SEECAT` display wordmark, "The cat that lives in your Seeker.",
   mascot paragraph, CA field with COPY, two CTAs, three status pills; mascot at right,
   standing on the $SKR coin and centred in two sunset blooms
3. **How it works** — 01 Buy / 02 Hold / 03 Collect, on accent-to-grey rules
4. **What holding gets you** — two cards in the Reviewer's Guide pattern: rewards in $SKR,
   built on Solana
5. **Stat band** — rewards paid, holders, supply, reward token
6. **Footer** — large nav words, the mark with the `@SeeCat_sol` handle, then a rule and
   the risk and non-affiliation disclaimer

The artboards in `design/` still show the earlier arrangement: a marquee ticker above the
nav, a `Chart` pill beside `Buy`, a third card ("Your keys stay yours") and numbered `01`
badges on the cards. All four were dropped from the build afterwards.

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
| `hairline` | `#1C1C20` | Section rules, grid cell dividers |
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
