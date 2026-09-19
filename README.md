# SEECAT — site design

Website design for **SEECAT** ($SEECAT), a Solana cat-mascot token whose holders are paid
rewards in $SKR.

- **Palette:** sampled pixel-by-pixel off a full-page screenshot of solanamobile.com,
  not guessed
- **Voice and content pattern:** Seeker Reviewer's Guide — a feature name, a one-line
  promise, then bold-lead claims ("Paid to your wallet. Real $SKR — not points.")
- **Block rhythm:** raycatsolana.com, loosely — ticker, nav, hero with a CA field and
  status pills, then our own sections rather than a copy of theirs

Mint: `Eyvmi7QVpSXWbB7WLqf5ksfbRugaiFudubeLtpEDsnkh`. Every buy button points at
`https://app.jtx.com/?mint=<that>`, so the swap opens with the pair already chosen.

The site is `index.html` + `assets/`, with `scripts/refresh-stats.py` running on the
server. The design system it was built from is written down below rather than kept as a
separate set of files.

## Deploying to seecatsol.com

The site is static — there is nothing to build and no runtime. Deploying is copying two
things into the web root:

```sh
rsync -av --delete index.html assets/ user@seecatsol.com:/var/www/seecatsol.com/
```

`README.md` and the repo's other files are not part of the site and do not need to be
uploaded — except `scripts/refresh-stats.py`, which runs on the server from cron and
writes `data/stats.json`. Put it somewhere `rsync --delete` does not reach, such as
`/var/www/seecatsol.com/bin/`, and see **Setting up the snapshot** below.

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
| Buy buttons | All four (nav, hero, how-it-works, footer) open `app.jtx.com/?mint=<CA>` in a new tab |
| Socials | X and Telegram, both `@SeeCat_sol` — in the hero CTA row and the footer lockup, and both in the JSON-LD `sameAs` |
| Chart | A ghost pill beside `Buy` in the nav, opening the token's StonkFun page in a new tab |
| Stat band | `Rewards paid` from StonkFun's API in the browser; `Holders` and `Total supply` from a cron-written `data/stats.json` |

### Live stats

`assets/js/stats.js` fills three of the four tiles from two sources, read
independently so one failing never blanks the other. Neither needs a key.

| Tile | Source | Field |
| --- | --- | --- |
| Rewards paid | StonkFun `GET /tokens/{mint}/rewards` | `data.rewards.distributedTokens` |
| its unit | same | `data.quote.symbol` |
| Holders | our own `data/stats.json` | `holders` |
| Total supply | same | `supply` |
| Reward token | — | static `$SKR` |

**Every tile keeps its `[—]` as the markup default**, so the band is correct before
anything lands and stays correct if nothing does. Each read fails on its own and
writes one line to the console: an `{error:{code}}` body, a non-2xx status, a missing
or stale snapshot, malformed JSON, a timeout, an offline browser, or a CORS refusal.

#### Why holders does not come from the API

`rewards.holderCount` looks like the obvious field and is not. Measured against the
live mint on 2026-09-18: the API answered `holderCount: 0` while Solscan showed 10
holders, alongside `payoutCount: 0` and no `lastPayoutAt` at all. It counts the
wallets a *distribution* paid, so it sits at zero until the first payout cycle and
afterwards means holders above StonkFun's ~$20 eligibility threshold — not everyone
holding the token. Rendering it would have put "Holders: 0" on a page with ten of
them.

#### Why the chain reads are not in the browser

They were, and it did not work. **Free public Solana RPCs refuse browser traffic**,
measured on the deployed page:

| Endpoint | From a browser |
| --- | --- |
| `api.mainnet-beta.solana.com` | `403` — Solana Labs' own, explicitly not for production |
| `solana-rpc.publicnode.com` | `403` |
| `solana.drpc.org` | `400`, even on a plain `getTokenSupply` — it wants a key |

They do not refuse *servers*. So `scripts/refresh-stats.py` makes those two calls from
cron and writes the answers to a file the page reads off its own origin: no CORS, no
per-visitor rate limit, and no cost that grows with the holder count.

```
getProgramAccounts TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  filters:   [{ memcmp: { offset: 0, bytes: <mint> } }]
  dataSlice: { offset: 64, length: 8 }
```

Every LaunchLab mint is created by `initialize_with_token2022`, so the accounts live
under Token-2022 rather than classic SPL. The `dataSlice` asks for the 8-byte balance
alone: without it the call returns each account in full, which is nothing at ten
holders and megabytes at twenty thousand. Holders are that set minus the accounts
emptied to a zero balance, which matches what Solscan reports, the pool's own vault
included.

#### Setting up the snapshot

The script needs `python3` and nothing else. It takes one argument, the file to
write:

```sh
./scripts/refresh-stats.py /var/www/seecatsol.com/data/stats.json
```

```cron
*/10 * * * * /var/www/seecatsol.com/bin/refresh-stats.py /var/www/seecatsol.com/data/stats.json
```

**The output must live outside `assets/`.** The deploy rsyncs `assets/` with
`--delete`, so a generated file in there would be wiped on every deploy. `data/` next
to it is not synced and survives.

It writes to a temp file and renames, so a visitor never reads a half-written file,
and on any failure it writes nothing and exits non-zero — a bad run leaves the last
good numbers in place instead of blanking the band. It also refuses to write a zero
holder count, which would mean the filter matched nothing rather than a token nobody
holds.

If the free endpoints ever refuse the server too, set `SOLANA_RPC` to a keyed URL and
the script uses that one instead. The key lives in the environment, never in the file.

The page treats a snapshot older than **six hours** as no snapshot: cron has stopped,
and placeholders are better than numbers that have quietly been wrong for days. The
console names the `generatedAt` it found. Until the cron exists at all, the page says
so once and the two tiles stay `[—]` — `Rewards paid` is unaffected either way,
because that one really does work from the browser.

#### CORS, now measured

Measured on the deployed page on 2026-09-18: **StonkFun's API does send
`Access-Control-Allow-Origin`** — the rewards read went through from the browser with
no CORS error, which is why that one call stayed client-side. Should it ever change,
the console says *"request failed, most likely CORS"*, and the fix is to proxy
the read through our own server, which also lets us cache it:

```nginx
location = /api/rewards {
    proxy_pass https://www.stonkfun.xyz/api/public/v1/tokens/<mint>/rewards;
    proxy_set_header Host www.stonkfun.xyz;
    proxy_cache_valid 200 60s;
}
```

Then change `API` in `stats.js` to `""` and the path to `/api/rewards`. Nothing else
moves.

StonkFun's rate limit is 300/min per IP and its reads are CDN-cached, so one fetch per
visitor costs nothing there. Errors come back as `{ error: { code, message } }`;
`code` is stable and is what the script branches on.

### SEO and link previews

`index.html`'s head carries the title, description, canonical, robots, Open Graph, X card
and a `WebSite` JSON-LD block.

`canonical`, `og:url` and the JSON-LD `url` all point at the apex,
**https://seecatsol.com/**. Keep the three in step if the domain ever changes.

### Favicon

Built from the mascot's own head rather than a shrunken illustration, because a favicon is
rendered at 16–48px and fine detail turns to mud there. `assets/img/favicon-*.png` and
`favicon.ico` are cut from `assets/img/mascot.png`: the head cropped to its alpha bounding
box, colour and contrast lifted ~10% so the tabby markings survive the downscale, fitted to
74% of the canvas on a cream `#FDF3E7` disc — the sunset's last stop, on-brand rather than
plain white — with a `#26262B` ring so the disc still has an edge on a light tab bar. The
circular mask also crops out the phone the cat is holding, which at this size was noise.

`apple-touch-icon.png` is full-bleed with no disc and no transparency: iOS ignores alpha and
applies its own rounding.

**48px and 32px read clearly as a cat in a cap. 16px is a dark blob** — that is the ceiling
for a photographic head at that size, whatever the crop. In practice it matters less than it
looks: hidpi displays request the 32px file for a 16px slot.

**Still external:** the preview banner is on i.ibb.co (`SEECAT-link.jpg`), not in the repo.
`og:image` has to be an absolute URL, so vendoring it means serving it from
`https://seecatsol.com/assets/img/...` and updating both `og:image` and `twitter:image`.

`og:image` must stay an **absolute** URL; scrapers do not resolve relative paths.

Verified in Chromium at 390, 768, 900, 1440 and 1920px: no horizontal overflow at any
width, and no console errors.

### Responsive behaviour

The layout was drawn at two fixed widths, 1440 and 390; the site is fluid between them.

- Type scales with `clamp()` — the wordmark runs 62 -> 130px.
- The hero goes two-column at **1080px**, not at the nav breakpoint: below that there is not
  enough width for the 700px copy column beside the figure without the coin crowding the
  wordmark.
- The mascot and coin scale as one unit. The figure carries `--fig-w`, and the coin is
  `137.25%` of it (700 / 510, from the 1440 drawing), so the cat's feet always land inside
  the coin's lower face — 56px at desktop, 36px at phone width.
- Stacked layouts reserve `0.267 x --fig-w` above the figure, because the coin overhangs its
  own box by 26.9% and would otherwise ride up over the status dots.
- `body` uses **`overflow-x: clip`, not `hidden`**. `hidden` forces `overflow-y` to `auto`,
  which makes `body` its own scroll container — and then the sticky nav sticks to that box
  rather than the viewport. On phones the two fall out of step as the URL bar collapses, and
  the nav leaves a strip of empty page above itself. `clip` contains the coin and the blooms
  just as well without creating a scroll container. Keep it that way.
- The CA field is a pill above 600px and a stacked card below it. The address is 44
  characters and only clears the label and the COPY button once the field reaches its full
  540px; below that the three parts each take a row, with the mono size on a `clamp()` that
  keeps all 44 characters readable down to a 320px viewport. Ellipsizing the one string a
  buyer is told to check twice was the wrong trade.

## Page blocks

1. **Nav** — hex mark + letterspaced `SEECAT` wordmark, section links, `Community`
   pointing at X, and the white `Buy $SEECAT` pill
2. **Hero** — meta row, `$SEECAT` display wordmark, "The cat that lives in your Seeker.",
   mascot paragraph, CA field with COPY, three CTAs (buy, X, Telegram), three status pills;
   mascot at right, standing on the $SKR coin and centred in two sunset blooms
3. **How it works** — 01 Buy / 02 Hold / 03 Collect, on accent-to-grey rules
4. **What holding gets you** — two cards in the Reviewer's Guide pattern: rewards in $SKR,
   built on Solana
5. **Stat band** — rewards paid, holders, supply, reward token
6. **Footer** — large nav words, the mark with the `@SeeCat_sol` handles for X and
   Telegram, then a rule and the risk and non-affiliation disclaimer

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

### Gradient text needs room to paint

`background-clip: text` paints only inside the inline box, and the negative letter-spacing
these headings use pulls that box in behind the last glyph's right side bearing. Measured
against the glyph ink: 3.7px short on "Seeker" at 38px, 5.8px on "SEECAT" at 130px. The
visible result was an `r` with no shoulder. Every gradient-clipped span carries
`padding-right: 0.14em` with `margin-right: -0.14em` — the paint area grows, the layout does
not move. Right side only: a negative left margin on the first span would drag the `$` out
of the column.

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
- The contract address and the X handle are live. Three stat-band values are still
  placeholders (`[—]`): rewards paid, holders, total supply.
- Claims are deliberately narrow: no Seeker Season, dApp Store or Seed Vault *integration*
  is asserted anywhere — only that a Seeker owner's keys live in their own Seed Vault.

## Naming

The token is **$SEECAT** and rewards are paid in **$SKR** — the native asset of the Solana
Mobile economy, as the Seeker Reviewer's Guide names it. An earlier pass read `$SCR`; that
was a typo and is corrected throughout.

One thing to square before launch: the Reviewer's Guide states plainly that **"SKR Token is
not live yet."** A live page saying rewards *are* paid in $SKR depends on that changing, and
$SKR is Solana Mobile's asset rather than this project's.
