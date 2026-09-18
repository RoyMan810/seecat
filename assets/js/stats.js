/* SEECAT — live numbers for the stat band, from StonkFun's public API.
 *
 * One read, no key, no signup: GET /tokens/{mint}/rewards answers with the
 * lifetime distribution totals for a reward coin. Reads are CDN-cached and the
 * limit is 300/min per IP, so a fetch per visitor costs nothing.
 *
 * Every tile keeps its [—] placeholder as the markup default. Nothing here
 * throws its way out to the page: if the network, the API or a field is
 * missing, the placeholder stays and one line goes to the console. */
(function () {
  "use strict";

  const API = "https://www.stonkfun.xyz/api/public/v1";
  const MINT = "Eyvmi7QVpSXWbB7WLqf5ksfbRugaiFudubeLtpEDsnkh";

  /* What the page claims in copy. The payout token is whatever the launch was
     paired against, so if the API disagrees the number would be shown in the
     wrong unit — render the API's symbol and say so in the console. */
  const EXPECTED_SYMBOL = "SKR";

  const TIMEOUT_MS = 7000;

  const fields = document.querySelectorAll("[data-stat]");
  if (!fields.length) return;

  const put = (name, text) => {
    document.querySelectorAll(`[data-stat="${name}"]`).forEach((el) => {
      el.textContent = text;
      el.dataset.statState = "live";
    });
  };

  /* Grouped, and only as precise as the magnitude deserves. */
  const amount = (n) => {
    if (typeof n !== "number" || !isFinite(n)) return null;
    const digits = n >= 1000 ? 0 : n >= 1 ? 2 : 6;
    return n.toLocaleString("en-US", { maximumFractionDigits: digits });
  };

  const count = (n) =>
    Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : null;

  const load = async () => {
    let body;
    try {
      const res = await fetch(`${API}/tokens/${MINT}/rewards`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      body = await res.json();

      // Every failure comes back as { error: { code, message } }; code is stable.
      if (!res.ok || body.error) {
        console.warn(
          "SEECAT stats: StonkFun returned",
          body?.error?.code || res.status
        );
        return;
      }
    } catch (err) {
      // A TypeError here is usually CORS: the request went out and the browser
      // refused the response because it carried no Access-Control-Allow-Origin
      // for this origin. The fix is a one-line proxy on our own server — see
      // README. TimeoutError and AbortError are the network being slow or gone.
      console.warn(
        "SEECAT stats: could not read StonkFun —",
        err.name === "TypeError"
          ? "request failed, most likely CORS (see README)"
          : err.name
      );
      return;
    }

    const data = body.data || {};
    const rewards = data.rewards;

    // A standard launch answers mode "standard" with a null rewards object.
    if (!rewards) {
      console.warn(
        `SEECAT stats: no rewards data (mode "${data.mode}") — placeholders kept`
      );
      return;
    }

    const paid = amount(rewards.distributedTokens);
    if (paid) put("rewardsPaid", paid);

    const holders = count(rewards.holderCount);
    if (holders) put("holders", holders);

    const symbol = data.quote && data.quote.symbol;
    if (symbol) {
      put("rewardSymbol", symbol);
      if (symbol !== EXPECTED_SYMBOL) {
        console.warn(
          `SEECAT stats: payouts are in ${symbol}, but the page's copy says ` +
            `${EXPECTED_SYMBOL}. The number is shown in ${symbol}.`
        );
      }
    }
  };

  load();
})();
