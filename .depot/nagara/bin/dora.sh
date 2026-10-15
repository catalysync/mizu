#!/usr/bin/env bash
# dora.sh - DORA metrics from the ship deploy log plus git. bash + jq + git, $0.
#
#   .depot/nagara/bin/dora.sh [--env ENV|all] [--days 30] [--product NAME] [--overrides] [FILE|-]
#
# Input: the deploy log (ship/deploy-log.schema.json), one JSON object per line,
# from FILE or stdin. Fetch it first, e.g. `$SHIP_LOG_CMD fetch > deploys.jsonl`.
# Run inside the product checkout after `git fetch`, so lead time can resolve
# the commits in prev_sha..sha. Output is Markdown; weekly runs go to
# ops/dora/<yyyy-ww>.md.
#
# Per env, over the window:
#   deploy frequency   successful deploys per week
#   lead time          deploy finished - commit time, every commit in prev_sha..sha; median, p90
#   change failure     (failed + rolled_back + successes followed by a hotfix
#                      deploy within 24h) / all deploys
#   time to restore    failed/rolled_back finished -> next success in the env; median
#   rework rate        deploys with hotfix: true / all deploys (DORA 2025)
# --overrides adds the share of PRs merged in the window that carry an agent-guard
# override label (needs `gh`, run in the repo).
set -euo pipefail

ENV_SEL=all; DAYS=30; PRODUCT=""; OVERRIDES=0; SRC="-"
while [ $# -gt 0 ]; do
  case "$1" in
    --env) ENV_SEL="$2"; shift 2 ;;
    --days) DAYS="$2"; shift 2 ;;
    --product) PRODUCT="$2"; shift 2 ;;
    --overrides) OVERRIDES=1; shift ;;
    -h|--help) sed -n '2,21p' "$0"; exit 0 ;;
    -) SRC="-"; shift ;;
    -*) echo "dora: unknown option $1" >&2; exit 2 ;;
    *) SRC="$1"; shift ;;
  esac
done
case "$DAYS" in ''|*[!0-9]*) echo "dora: --days must be a whole number" >&2; exit 2 ;; esac

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
NOW="$(date -u +%s)"; SINCE=$((NOW - DAYS * 86400))
if [ "$SRC" = "-" ]; then cat > "$TMP/in"; else cat -- "$SRC" > "$TMP/in"; fi

# Normalise: parse timestamps, apply window and product filter, sort by finish.
bad_lines=$(jq -R 'fromjson? // "bad" | select(type != "object")' "$TMP/in" | wc -l | tr -d ' ')
[ "$bad_lines" -eq 0 ] || echo "dora: skipping $bad_lines line(s) that are not JSON objects" >&2
jq -Rc --argjson since "$SINCE" --arg product "$PRODUCT" '
  def epoch: (sub("\\.[0-9]+"; "") | fromdateiso8601? ) // null;
  fromjson? // empty
  | select(type == "object")
  | . + {fin: ((.finished // "") | epoch)}
  | select(.fin != null and .fin >= $since)
  | select($product == "" or .product == null or .product == $product)' "$TMP/in" \
  | jq -sc 'sort_by(.fin)[]' > "$TMP/rows"

human() {
  awk -v s="$1" 'BEGIN {
    if (s == "") { print "n/a"; exit }
    if (s < 3600) printf "%.0fm\n", s / 60
    else if (s < 172800) printf "%.1fh\n", s / 3600
    else printf "%.1fd\n", s / 86400 }'
}
# pct <p> < sorted numbers: value at index round(p/100 * (n-1)), empty if none
pct() { awk -v p="$1" '{ v[NR - 1] = $1 } END { if (NR) { i = int(p / 100 * (NR - 1) + 0.5); print v[i] } }'; }

if [ "$ENV_SEL" = all ]; then
  jq -r '.env // empty' "$TMP/rows" | sort -u > "$TMP/envs"
else
  echo "$ENV_SEL" > "$TMP/envs"
fi

echo "# DORA, last $DAYS days${PRODUCT:+ ($PRODUCT)}"
echo
echo "_Generated $(date -u +%FT%TZ) from $(wc -l < "$TMP/rows" | tr -d ' ') deploy log lines._"
if [ ! -s "$TMP/envs" ]; then echo; echo "No deploys in the window."; fi

while IFS= read -r env; do
  jq -c --arg e "$env" 'select(.env == $e)' "$TMP/rows" > "$TMP/env_rows"
  jq -s '
    def is_bad: .result == "failed" or .result == "rolled_back";
    . as $all
    | [ .[] | select(.result == "success") ] as $ok
    | [ .[] | select(is_bad) ] as $bad
    | [ .[] | select(.hotfix == true) ] as $hot
    | [ $ok[] | . as $s | select(any($hot[]; .fin > $s.fin and .fin - $s.fin <= 86400)) ] as $hotfixed
    | { total: ($all | length), ok: ($ok | length), bad: ($bad | length),
        hotfixed: ($hotfixed | length), hotfix: ($hot | length),
        restores: [ $bad[] | . as $b | ([ $ok[] | select(.fin > $b.fin) ] | first) as $n
                    | select($n != null) | $n.fin - $b.fin ] }' "$TMP/env_rows" > "$TMP/m"

  total=$(jq .total "$TMP/m"); ok=$(jq .ok "$TMP/m"); bad=$(jq .bad "$TMP/m")
  hotfixed=$(jq .hotfixed "$TMP/m"); hotfix=$(jq .hotfix "$TMP/m")
  jq -r '.restores[]' "$TMP/m" | sort -n > "$TMP/restores"
  nrest=$(wc -l < "$TMP/restores" | tr -d ' ')

  # Lead time: every commit in prev_sha..sha of each successful deploy.
  : > "$TMP/leads"; unresolved=0
  jq -r 'select(.result == "success") | [(if (.prev_sha // "") == "" then "-" else .prev_sha end), .sha, (.fin | tostring)] | @tsv' "$TMP/env_rows" > "$TMP/ok_tsv"
  while IFS="$(printf '\t')" read -r prev sha fin; do
    if [ "$prev" = - ] || [ "$prev" = "$sha" ]; then range=(-1 "$sha"); else range=("$prev..$sha"); fi
    if out="$(git log --format=%ct "${range[@]}" 2>/dev/null)"; then
      [ -n "$out" ] && printf '%s\n' "$out" | awk -v f="$fin" '{ print f - $1 }' >> "$TMP/leads"
    else
      unresolved=$((unresolved + 1))
    fi
  done < "$TMP/ok_tsv"
  sort -n "$TMP/leads" -o "$TMP/leads"
  nleads=$(wc -l < "$TMP/leads" | tr -d ' ')

  freq=$(awk -v n="$ok" -v d="$DAYS" 'BEGIN { printf "%.1f", n / (d / 7) }')
  if [ "$total" -gt 0 ]; then
    cfr=$(awk -v b="$bad" -v h="$hotfixed" -v t="$total" 'BEGIN { printf "%.0f%%", (b + h) / t * 100 }')
    rework=$(awk -v h="$hotfix" -v t="$total" 'BEGIN { printf "%.0f%%", h / t * 100 }')
  else cfr=n/a; rework=n/a; fi

  echo
  echo "## $env ($total deploys)"
  echo
  echo "| Metric | Value | Basis |"
  echo "|---|---|---|"
  echo "| Deployment frequency | $freq / week | $ok successful |"
  echo "| Lead time for changes | median $(human "$(pct 50 < "$TMP/leads")"), p90 $(human "$(pct 90 < "$TMP/leads")") | $nleads commits$([ "$unresolved" -gt 0 ] && echo ", $unresolved deploys not resolvable in git") |"
  echo "| Change failure rate | $cfr | $bad failed/rolled back + $hotfixed hotfixed within 24h, of $total |"
  echo "| Time to restore | median $(human "$(pct 50 < "$TMP/restores")") | $nrest restores$([ "$((bad - nrest))" -gt 0 ] && echo ", $((bad - nrest)) not yet restored") |"
  echo "| Rework rate | $rework | $hotfix hotfix deploys |"
done < "$TMP/envs"

if [ "$OVERRIDES" = 1 ]; then
  since_date="$(date -u -r "$SINCE" +%F 2>/dev/null || date -u -d "@$SINCE" +%F)"
  gh pr list --state merged --search "merged:>=$since_date" --limit 1000 --json number,labels > "$TMP/prs"
  jq -r '
    ["owner-reviewed-infra","tests-changed-ok","new-dep-ok","contract-ok","large-pr-ok"] as $o
    | (length) as $n
    | ([ .[] | select(any(.labels[].name; . as $l | $o | index($l))) ] | length) as $k
    | "\n## Guard overrides\n\n\($k) of \($n) merged PRs carried an override label"
      + (if $n > 0 then " (\($k * 100 / $n | floor)%)." else "." end)' "$TMP/prs"
fi
