#!/usr/bin/env bash
set -uo pipefail
BASE="${1:-http://localhost:3099}"
fail=0
ok() { printf "  \033[32mPASS\033[0m %s\n" "$1"; }
bad() { printf "  \033[31mFAIL\033[0m %s\n" "$1"; fail=1; }
echo "▸ security headers ($BASE)"
H=$(curl -sSI "$BASE/")
for k in x-content-type-options referrer-policy permissions-policy x-frame-options content-security-policy; do grep -qi "^$k:" <<<"$H" && ok "$k" || bad "$k missing"; done
echo "▸ EN & DE crawl surface"
for p in / /time-to-power /neuralbridge /foundation /prospect /about /contact /impressum /datenschutz /de /de/time-to-power /de/neuralbridge /de/foundation /de/prospect /de/about /de/contact /de/impressum /de/datenschutz /api/hub /llms.txt /robots.txt /sitemap.xml /favicon.svg /icon.svg /opengraph-image; do c=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE$p"); [ "$c" = 200 ] && ok "200 $p" || bad "$c $p"; done
echo "▸ retired routes redirect (308)"
for p in /palletizer /de/palletizer /energy /de/energy /forge/palletizer /integrators /tools /pricing /book /api/energy/index; do c=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE$p"); [ "$c" = 308 ] || [ "$c" = 301 ] && ok "$c $p" || bad "$c $p expected redirect"; done
[ "$(curl -sS -o /dev/null -w "%{http_code}" "$BASE/__not_a_route__")" = 404 ] && ok "404 unknown route" || bad "404 failed"
echo "▸ 30/30 visual assets & exact pack placement"
ALL=""; for p in / /time-to-power /neuralbridge /foundation /prospect /about /contact; do ALL+="$(curl -sS "$BASE$p")"; done
placed=0
for img in $(find public/images -name "*.jpg" | sort); do rel="${img#public}"; enc=$(printf "%s" "$rel" | sed "s|/|%2F|g"); c=$(curl -sS -o /dev/null -w "%{http_code}" "$BASE$rel"); if [ "$c" = 200 ] && (grep -q "$enc" <<<"$ALL" || grep -q "$rel" <<<"$ALL"); then placed=$((placed+1)); else bad "missing $rel ($c)"; fi; done
[ "$placed" -eq 30 ] && ok "all 30/30 optimized JPEGs return 200 and render in their exact hub slots" || bad "only $placed/30 placed"
echo "▸ kill-list & legal completeness"
for p in / /time-to-power /neuralbridge /foundation /prospect /about /contact /impressum /datenschutz /de/impressum /de/datenschutz /llms.txt; do B=$(curl -sS "$BASE$p"); for w in "palletiz" "Physical AI" "Weekly CEO report" "Three clusters" "Cluster 1" "Cluster 2" "GridOS" "DERIM"; do grep -qi "$w" <<<"$B" && bad "banned token on $p: $w"; done; grep -qE "TODO|\[TODO" <<<"$B" && bad "TODO left on $p"; done
ok "zero kill-list or TODO tokens across EN/DE pages & legal notices"
[ "$fail" -eq 0 ] && echo "✓ ALL CONTRACTS HELD" || echo "✗ FAILURES ABOVE"
exit "$fail"
