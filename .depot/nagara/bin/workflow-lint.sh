#!/usr/bin/env bash
# workflow-lint.sh - actionlint + zizmor over every workflow in the repo
# (.depot/workflows and .github/workflows). What guard / workflow-lint runs.
#
#   .depot/nagara/bin/workflow-lint.sh
#
# Depot CI's `runs-on: {size: 2x8, image: ...}` mapping is not GitHub syntax and
# zizmor refuses to load such a file, which would leave it unaudited. zizmor
# therefore reads a copy where that mapping is replaced by a plain Depot label,
# padded with comment lines so every line number still matches the original.
# actionlint reads the originals. Uses the tools on PATH, else fetch-tool.sh.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"
BIN="$(cd "$(dirname "$0")" && pwd)"
tool() { if command -v "$1" >/dev/null; then command -v "$1"; else "$BIN/fetch-tool.sh" "$1"; fi; }

files=()
while IFS= read -r f; do files+=("$f"); done < <(git ls-files \
  '.depot/workflows/*.yml' '.depot/workflows/*.yaml' '.github/workflows/*.yml' '.github/workflows/*.yaml')
[ "${#files[@]}" -gt 0 ] || { echo "workflow-lint: no workflow files"; exit 0; }
printf '%s\n' "${files[@]}"

rc=0
echo "== actionlint"
"$(tool actionlint)" -config-file "$BIN/../actionlint.yaml" "${files[@]}" || rc=1

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
for f in "${files[@]}"; do
  mkdir -p "$TMP/$(dirname "$f")"
  awk '
    skip && ($0 ~ /^[[:space:]]*$/ || (match($0, /^[[:space:]]*/) && RLENGTH > ind)) { print "#"; next }
    { skip = 0 }
    /^[[:space:]]*runs-on:[[:space:]]*$/ {
      match($0, /^[[:space:]]*/); ind = RLENGTH
      print substr($0, 1, ind) "runs-on: depot-ubuntu-24.04  # normalised from a Depot mapping"
      skip = 1; next
    }
    { print }' "$f" > "$TMP/$f"
done
echo "== zizmor"
# --offline: Depot CI has no GITHUB_TOKEN for zizmor's online audits.
( cd "$TMP" && "$(tool zizmor)" --offline --min-severity low "${files[@]}" ) || rc=1
exit "$rc"
