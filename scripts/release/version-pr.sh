#!/usr/bin/env bash
# version-pr.sh - turn the pending changesets into a "version packages" PR.
#
#   pnpm release:version
#
# Runs `changeset version` (bumps package.json versions, writes CHANGELOGs,
# deletes the consumed changesets) on a fresh branch from origin/main, then
# pushes it and opens a PR. Merging that PR is what lets CI stage the release.
# Depot CI has no GITHUB_TOKEN, so this runs locally instead of as a bot.
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"
die() { echo "version-pr: $*" >&2; exit 1; }

[ -z "$(git status --porcelain)" ] || die "working tree is not clean"
command -v gh >/dev/null || die "gh is not on PATH"
git fetch --quiet origin main
branch="release/version-$(date -u +%Y%m%d-%H%M)"
git switch --quiet -c "$branch" origin/main
[ -n "$(node scripts/release/packages.mjs --pending)" ] || die "no pending changesets for publishable packages on origin/main"
pnpm exec changeset version
pnpm install --lockfile-only --reporter=silent
node scripts/release/packages.mjs --check > /dev/null || die "peer ranges are not met after versioning; fix them on this branch"
{ git diff --name-only; git ls-files --others --exclude-standard; } | xargs pnpm exec prettier --write --ignore-unknown --log-level warn

git add -A
git commit --quiet -m "version packages"
git push --quiet -u origin "$branch"
summary="$(node scripts/release/packages.mjs | awk -F'\t' '{print "- " $1 " " $2}')"
gh pr create --base main --head "$branch" --title "version packages" --body "$(printf 'Consumes the pending changesets.\n\nVersions after merge:\n%s\n\nAfter merge, Depot stages every version not yet on npm; approve with scripts/release/approve.sh.\n' "$summary")"
