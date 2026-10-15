#!/usr/bin/env bash
# boundary-guard.sh - mizu is public (MIT). Refuse a change whose added lines
# reference private material: the pro package and planning repos, private
# product names and hostnames, product-private token prefixes.
#
#   scripts/ci/boundary-guard.sh [<base-rev>]     default: origin/main
#
# Only lines the change adds are checked, so existing history does not fail it.
# This file is excluded because it has to spell the patterns out.
set -euo pipefail

BASE="${1:-${BASE_SHA:-origin/main}}"
ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"
range="$(git merge-base "$BASE" HEAD)..HEAD"

private_refs='tweakmizu-pro|@tweakmizu/pro|mizu-planning|tweakmizu-planning|mizu-knowledge|prophecy|nagara\.cloud|tree-aws|--p-[a-z]|--tree-[a-z]'

added="$(git diff --unified=0 --no-color "$range" -- . ':(exclude)scripts/ci/boundary-guard.sh' ':(exclude)pnpm-lock.yaml' \
  | awk '/^\+\+\+ / { file = substr($0, 7); next } /^\+/ { print file ": " substr($0, 2) }')"

hits="$(printf '%s\n' "$added" | grep -inE "$private_refs" || true)"
if [ -n "$hits" ]; then
  echo "boundary-guard: added lines reference private material ($range):"
  printf '%s\n' "$hits" | sed 's/^/  /'
  echo "mizu is public: keep pro code, planning notes and product-private names out of it."
  exit 1
fi
echo "boundary-guard: $range adds no private references"
