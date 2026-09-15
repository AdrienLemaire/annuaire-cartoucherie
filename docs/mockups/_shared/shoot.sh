#!/usr/bin/env bash
# Screenshot every mockup page at mobile width into docs/mockups/_shots/
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/_shots"
mkdir -p "$out"
for f in "$root"/*/*.html; do
  variant="$(basename "$(dirname "$f")")"
  [ "$variant" = "_shared" ] && continue
  page="$(basename "$f" .html)"
  google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=390,1400 --virtual-time-budget=10000 \
    --screenshot="$out/$variant-$page.png" "$f" >/dev/null 2>&1
  echo "$out/$variant-$page.png"
done
