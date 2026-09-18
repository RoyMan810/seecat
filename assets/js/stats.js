/* SEECAT — live numbers for the stat band.
 *
 * Two sources, read independently so one failing never blanks the other:
 *
 *   StonkFun  GET /tokens/{mint}/rewards   -> rewards paid, and the payout symbol
 *   Solana    getTokenSupply               -> total supply
 *             getProgramAccounts           -> holders
 *
 * Every tile keeps its [—] placeholder as the markup default. Nothing here
 * throws its way out to the page: on any failure the placeholder stays and one
 * line goes to the console. */
(function () {
  "use strict";

  const API = "https://www.stonkfun.xyz/api/public/v1";
  const MINT = "Eyvmi7QVpSXWbB7WLqf5ksfbRugaiFudubeLtpEDsnkh";

  /* Every LaunchLab mint is created by initialize_with_token2022, so the
     accounts holding it live under the Token-2022 program, not classic SPL. */
  const TOKEN_2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

  /* Keyless public RPCs, tried in order until one answers. Not one endpoint:
     free providers differ in what they allow, and api.mainnet-beta.solana.com in
     particular answers 403 to a browser — it is Solana Labs' own endpoint and is
     explicitly not for production traffic, so it is not in this list. Add more
     here, or move the reads behind our own server. See README. */
  const RPCS = [
    "https://solana-rpc.publicnode.com",
    "https://solana.drpc.org",
  ];

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

  /* ---- Solana: supply and holders --------------------------------------- */

  /* Walk the endpoints until one answers this call. A provider that refuses one
     method often serves another, so a refusal is never cached against the
     endpoint — only a success is, to keep later calls on what already worked. */
  let preferred = null;

  const rpc = async (method, params) => {
    const order = preferred
      ? [preferred, ...RPCS.filter((url) => url !== preferred)]
      : RPCS;
    let last = null;

    for (const url of order) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) {
          last = new Error(`HTTP ${res.status}`);
          continue;
        }
        const body = await res.json();
        if (body.error) {
          last = new Error(body.error.message);
          continue;
        }
        preferred = url;
        return body.result;
      } catch (err) {
        last = new Error(why(err));
      }
    }
    throw new Error(`${method}: ${last ? last.message : "no endpoint answered"}`);
  };

  const readSupply = async () => {
    try {
      const result = await rpc("getTokenSupply", [MINT]);
      const supply = compact(result?.value?.uiAmount);
      if (supply) put("supply", supply);
    } catch (err) {
      warn("could not read supply —", err.message);
    }
  };

  /* The exact count: every account holding the mint, minus the emptied ones.
     getProgramAccounts is expensive and plenty of free providers disable it. */
  const countEveryAccount = async () => {
    /* Ask for the 8-byte balance only. Without dataSlice this returns every
       account in full, which is nothing at ten holders and megabytes at twenty
       thousand — the slice keeps the response flat as the token grows. */
    const accounts = await rpc("getProgramAccounts", [
      TOKEN_2022,
      {
        encoding: "base64",
        dataSlice: { offset: 64, length: 8 },
        filters: [{ memcmp: { offset: 0, bytes: MINT } }],
      },
    ]);
    if (!Array.isArray(accounts)) return null;

    // A u64 little-endian zero is eight zero bytes, whatever the decimals.
    return accounts.filter((entry) => {
      const raw = atob(entry.account.data[0]);
      for (let i = 0; i < raw.length; i++) if (raw.charCodeAt(i) !== 0) return true;
      return false;
    }).length;
  };

  /* The cheap one every provider serves — but it returns at most twenty
     accounts. Twenty back means the tail is hidden, so the answer is refused
     rather than guessed; below twenty it is the whole holder list and exact. */
  const LARGEST_CAP = 20;

  const countLargestAccounts = async () => {
    const result = await rpc("getTokenLargestAccounts", [MINT]);
    const held = (result?.value || []).filter((entry) => entry.amount !== "0");
    return held.length >= LARGEST_CAP ? null : held.length;
  };

  const readHolders = async () => {
    let holders = null;

    try {
      holders = await countEveryAccount();
    } catch (err) {
      try {
        holders = await countLargestAccounts();
        if (holders === null) {
          warn(
            `no endpoint served getProgramAccounts (${err.message}), and there ` +
              `are more than ${LARGEST_CAP} holders to count — placeholder kept. ` +
              `A keyed RPC or our own server can do this; see README.`
          );
          return;
        }
      } catch (fallbackErr) {
        warn("could not count holders —", fallbackErr.message);
        return;
      }
    }

    // Zero would mean the filter matched nothing — a wrong program or mint,
    // not a token nobody holds. Leave the placeholder and say so.
    if (holders > 0) put("holders", count(holders));
    else warn("no token accounts matched the mint — placeholder kept");
  };

  readRewards();
  readSupply();
  readHolders();
})();
