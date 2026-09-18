#!/usr/bin/env python3
"""Write the chain half of the stat band to a JSON file the site can read.

Free public Solana RPCs refuse browsers — api.mainnet-beta.solana.com answers
403, PublicNode answers 403, dRPC answers 400 without a key. They do not refuse
servers, so these two reads happen here instead and the page fetches the result
from its own origin: no CORS, no rate limit per visitor, no cost that grows with
the holder count.

Writes {holders, supply, generatedAt} to the output path, atomically. On failure
it writes nothing and exits non-zero, so a bad run leaves the last good file in
place rather than blanking the band.

    ./scripts/refresh-stats.py /var/www/seecatsol.com/data/stats.json

Needs python3 and nothing else. Run it from cron every 10 minutes; see README.
"""

import json
import os
import sys
import urllib.error
import urllib.request
from base64 import b64decode
from datetime import datetime, timezone

MINT = "Eyvmi7QVpSXWbB7WLqf5ksfbRugaiFudubeLtpEDsnkh"

# Every LaunchLab mint is created by initialize_with_token2022, so its accounts
# live under Token-2022 rather than classic SPL.
TOKEN_2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"

# Tried in order until one answers. Set SOLANA_RPC to use one endpoint instead —
# that is where a keyed URL goes, so no key is ever committed to this file.
RPCS = [
    "https://api.mainnet-beta.solana.com",
    "https://solana-rpc.publicnode.com",
    "https://solana.drpc.org",
]
if os.environ.get("SOLANA_RPC"):
    RPCS = [os.environ["SOLANA_RPC"]]

TIMEOUT = 20


def rpc(method, params):
    """Call each endpoint in turn; raise only if none of them answered."""
    payload = json.dumps({"jsonrpc": "2.0", "id": 1, "method": method, "params": params})
    last = None

    for url in RPCS:
        request = urllib.request.Request(
            url,
            data=payload.encode(),
            headers={"Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
                body = json.load(response)
        except (urllib.error.URLError, OSError, ValueError) as err:
            last = f"{url}: {err}"
            continue

        if "error" in body:
            last = f"{url}: {body['error'].get('message', body['error'])}"
            continue
        return body["result"]

    raise RuntimeError(f"{method} — no endpoint answered ({last})")


def read_supply():
    return rpc("getTokenSupply", [MINT])["value"]["uiAmount"]


def read_holders():
    """Every account holding the mint, minus the ones emptied to zero.

    dataSlice asks for the 8-byte balance alone: without it the call returns
    each account in full, which is nothing at ten holders and megabytes at
    twenty thousand."""
    accounts = rpc(
        "getProgramAccounts",
        [
            TOKEN_2022,
            {
                "encoding": "base64",
                "dataSlice": {"offset": 64, "length": 8},
                "filters": [{"memcmp": {"offset": 0, "bytes": MINT}}],
            },
        ],
    )
    # A u64 little-endian zero is eight zero bytes, whatever the decimals.
    return sum(1 for entry in accounts if any(b64decode(entry["account"]["data"][0])))


def main():
    if len(sys.argv) != 2:
        sys.exit(f"usage: {sys.argv[0]} <output.json>")
    out = sys.argv[1]

    try:
        payload = {
            "holders": read_holders(),
            "supply": read_supply(),
            "generatedAt": datetime.now(timezone.utc)
            .isoformat(timespec="seconds")
            .replace("+00:00", "Z"),
        }
    except Exception as err:  # noqa: BLE001 — any failure must leave the old file
        sys.exit(f"refresh-stats: {err}")

    if payload["holders"] < 1:
        sys.exit("refresh-stats: no accounts matched the mint — keeping the old file")

    # Write beside the target and rename, so a reader never sees a half-file.
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    tmp = f"{out}.tmp"
    with open(tmp, "w", encoding="utf-8") as handle:
        json.dump(payload, handle)
        handle.write("\n")
    os.replace(tmp, out)

    print(f"refresh-stats: {payload['holders']} holders, supply {payload['supply']} -> {out}")


if __name__ == "__main__":
    main()
