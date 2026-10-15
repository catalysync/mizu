#!/usr/bin/env bash
# stage-publish.sh - CI side of the staged npm release (docs/releasing.md).
#
# For every public @mizunagara/* package whose version is not on npm yet, in
# dependency order: pnpm pack (rewrites workspace: ranges), verify the tarball,
# then `npm stage publish` it. Staging never makes anything installable; the
# owner approves each staged version with 2FA through scripts/release/approve.sh.
#
#   pnpm release:stage             CI: NODE_AUTH_TOKEN is the stage-only token
#   pnpm release:stage --dry-run   anywhere: pack + verify + `npm stage publish --dry-run`
# (pnpm runs it with the lockfile-pinned npm, which has `npm stage`)
#
# Expects the packages to be built already (the workflow runs turbo build first).
# Exits 0 without staging while changesets are pending: versions only move in
# the "version packages" PR (pnpm release:version).
set -euo pipefail

DRY_RUN=0
case "${1:-}" in
  --dry-run) DRY_RUN=1 ;;
  "") ;;
  *) echo "usage: stage-publish.sh [--dry-run]" >&2; exit 2 ;;
esac

ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"
SHA="$(git rev-parse HEAD)"
OUT="${RUNNER_TEMP:-${TMPDIR:-/tmp}}/mizu-stage-$$"
rm -rf "$OUT"; mkdir -p "$OUT"
trap 'rm -rf "$OUT"' EXIT

note() { if [ "${GITHUB_ACTIONS:-}" = true ]; then echo "::notice title=npm stage::$*"; else echo "note: $*"; fi; }
die()  { if [ "${GITHUB_ACTIONS:-}" = true ]; then echo "::error title=npm stage::$*"; else echo "error: $*" >&2; fi; exit 1; }
sha256() { if command -v sha256sum >/dev/null; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }
ver_ge() { [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -1)" = "$2" ]; }

npm_version="$(npm --version)"
ver_ge "$npm_version" 11.15.0 || die "npm $npm_version cannot stage; need >= 11.15.0"

pending="$(node scripts/release/packages.mjs --pending | wc -l | tr -d ' ')"
if [ "$pending" -gt 0 ]; then
  note "$pending pending changeset(s); versions move in the version PR (pnpm release:version). Nothing staged."
  exit 0
fi

TAG=latest
if [ -f .changeset/pre.json ] && [ "$(node -p 'require("./.changeset/pre.json").mode')" = pre ]; then
  TAG="$(node -p 'require("./.changeset/pre.json").tag')"
fi

node scripts/release/packages.mjs --check > "$OUT/packages.tsv" \
  || die "internal peer ranges are not met by the versions being released"

if [ "$DRY_RUN" = 0 ]; then
  [ -n "${NODE_AUTH_TOKEN:-}" ] || die "NODE_AUTH_TOKEN is empty: set the Depot secret NPM_STAGE_TOKEN (stage-only granular token)"
  printf '//registry.npmjs.org/:_authToken=%s\n' "$NODE_AUTH_TOKEN" > "$OUT/.npmrc"
  chmod 600 "$OUT/.npmrc"
  export NPM_CONFIG_USERCONFIG="$OUT/.npmrc"
fi

staged=0
while IFS=$'\t' read -r name version dir <&3; do
  if npm view "$name@$version" version >/dev/null 2>&1; then
    echo "skip $name@$version: already on npm"
    continue
  fi
  if [ "$DRY_RUN" = 0 ] && npm stage list "$name" --json 2>/dev/null \
      | node -e 'const v=process.argv[1];let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.exit(JSON.parse(s).some(i=>i.version===v)?0:1)}catch{process.exit(1)}})' "$version"; then
    echo "skip $name@$version: already staged, waiting for approval"
    continue
  fi

  if ! packed="$(cd "$dir" && pnpm pack --pack-destination "$OUT" 2>&1)"; then
    printf '%s\n' "$packed" >&2
    die "pnpm pack failed for $name@$version"
  fi
  tgz="$(printf '%s\n' "$packed" | tail -1)"
  [ -f "$tgz" ] || die "pnpm pack produced no tarball for $name@$version"
  node scripts/release/verify-tarball.mjs "$tgz" "$name" "$version"
  digest="$(sha256 "$tgz")"

  args=(stage publish "$tgz" --access public --tag "$TAG" --provenance=false --json)
  [ "$DRY_RUN" = 1 ] && args+=(--dry-run)
  result="$(npm "${args[@]}")" || die "npm stage publish failed for $name@$version"
  stage_id="$(printf '%s' "$result" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);const o=j.stageId?j:Object.values(j)[0]||{};console.log(o.stageId||"")}catch{console.log("")}})')"

  echo "staged $name@$version tag=$TAG stage_id=${stage_id:-dry-run} sha256=$digest commit=$SHA"
  printf '{"product":"mizu-%s","env":"npm-staged","sha":"%s","digest":"sha256:%s","started":"%s","finished":"%s","result":"success","tag":"%s","stage_id":"%s"}\n' \
    "${name#@mizunagara/}" "$SHA" "$digest" "$(date -u +%FT%TZ)" "$(date -u +%FT%TZ)" "$TAG" "${stage_id:-}"
  staged=$((staged + 1))
done 3< "$OUT/packages.tsv"

if [ "$staged" -eq 0 ]; then
  note "nothing to stage: every @mizunagara/* version is already on npm or staged"
else
  note "staged $staged package version(s) from $SHA; the owner approves them with scripts/release/approve.sh"
fi
