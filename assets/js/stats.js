/* SEECAT — live numbers for the stat band.
 *
 * Two sources, read independently so one failing never blanks the other:
 *
 *   StonkFun   GET /tokens/{mint}/rewards   -> rewards paid, and the payout symbol
 *   own server GET data/stats.json          -> holders, total supply
 *
 * The chain reads are not here because free public RPCs refuse browsers:
 * api.mainnet-beta.solana.com answers 403, PublicNode 403, dRPC 400 without a
 * key. They do not refuse servers, so scripts/refresh-stats.py does those two
 * calls from cron and this only reads the result off our own origin.
 *
 * Every tile keeps its [—] placeholder as the markup default. Nothing here
 * throws its way out to the page: on any failure the placeholder stays and one
 * line goes to the console. */
(function () {
  "use strict";

  const API = "https://www.stonkfun.xyz/api/public/v1";
  const MINT = "Eyvmi7QVpSXWbB7WLqf5ksfbRugaiFudubeLtpEDsnkh";

  /* Written by scripts/refresh-stats.py on the server, same origin as the page.
     Kept out of assets/ on purpose: the deploy rsyncs assets/ with --delete and
     would wipe a file it generated. */
  const SNAPSHOT = "data/stats.json";

  /* A snapshot older than this means cron has stopped. Show nothing rather than
     a number that has quietly been wrong for days. */
  const SNAPSHOT_MAX_AGE_MS = 6 * 60 * 60 * 1000;

  /* What the page claims in copy. The payout token is whatever the launch was
     paired against, so if the API disagrees the number would be shown in the
     wrong unit — render the API's symbol and say so in the console. */
  const EXPECTED_SYMBOL = "SKR";

  const TIMEOUT_MS = 7000;

  if (!document.querySelector("[data-stat]")) return;

  const put = (name, text) => {
    document.querySelectorAll(`[data-stat="${name}"]`).forEach((el) => {
      el.textContent = text;
      el.dataset.statState = "live";
    });
  };

  const warn = (...args) => console.warn("SEECAT stats:", ...args);

  /* A TypeError from fetch means the request never produced a readable response:
     offline, DNS, or — most often in practice — CORS refused it. */
  const why = (err) =>
    err.name === "TypeError"
      ? "request failed, most likely CORS (see README)"
      : err.message || err.name;

  /* Grouped, and only as precise as the magnitude deserves. */
  const amount = (n) => {
    if (typeof n !== "number" || !isFinite(n)) return null;
    const digits = n >= 1000 ? 0 : n >= 1 ? 2 : 6;
    return n.toLocaleString("en-US", { maximumFractionDigits: digits });
  };

  const count = (n) =>
    Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : null;

  /* A supply reads better short — but keep two decimals so a burn is visible
     as 970M rather than rounding back up to 1B. */
  const compact = (n) =>
    typeof n === "number" && isFinite(n)
      ? n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 })
      : null;

  /* ---- StonkFun: rewards paid ------------------------------------------ */

  const readRewards = async () => {
    let body;
    try {
      const res = await fetch(`${API}/tokens/${MINT}/rewards`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      body = await res.json();

      // Every failure comes back as { error: { code, message } }; code is stable.
      if (!res.ok || body.error) {
        warn("StonkFun returned", body?.error?.code || res.status);
        return;
      }
    } catch (err) {
      warn("could not read StonkFun —", why(err));
      return;
    }

    const data = body.data || {};
    const rewards = data.rewards;

    // A standard launch answers mode "standard" with a null rewards object.
    if (!rewards) {
      warn(`no rewards data (mode "${data.mode}") — placeholder kept`);
      return;
    }

    // Zero is the truth before the first payout cycle, not a missing value.
    const paid = amount(rewards.distributedTokens);
    if (paid !== null) put("rewardsPaid", paid);

    const symbol = data.quote && data.quote.symbol;
    if (symbol) {
      put("rewardSymbol", symbol);
      if (symbol !== EXPECTED_SYMBOL) {
        warn(
          `payouts are in ${symbol}, but the page's copy says ` +
            `${EXPECTED_SYMBOL}. The number is shown in ${symbol}.`
        );
      }
    }
  };

  /* ---- Our own server: holders and supply -------------------------------- */

  const readSnapshot = async () => {
    let data;
    try {
      const res = await fetch(SNAPSHOT, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) {
        warn(
          `no ${SNAPSHOT} (HTTP ${res.status}) — holders and supply need ` +
            `scripts/refresh-stats.py on a cron. See README.`
        );
        return;
      }
      data = await res.json();
    } catch (err) {
      warn(`could not read ${SNAPSHOT} —`, why(err));
      return;
    }

    const age = Date.now() - Date.parse(data.generatedAt);
    if (!isFinite(age) || age > SNAPSHOT_MAX_AGE_MS) {
      warn(
        `${SNAPSHOT} is stale (generated ${data.generatedAt}) — cron has ` +
          `stopped. Placeholders kept rather than showing old numbers.`
      );
      return;
    }

    const holders = count(data.holders);
    if (holders && data.holders > 0) put("holders", holders);

    const supply = compact(data.supply);
    if (supply) put("supply", supply);
  };

  readRewards();
  readSnapshot();
})();
