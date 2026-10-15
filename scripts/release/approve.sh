#!/usr/bin/env bash
# approve.sh - owner side of the staged npm release (docs/releasing.md).
# Run on the owner's own machine, never in CI: `npm stage approve` needs 2FA
# (a passkey), which is the proof of presence no agent or CI job can supply.
#
#   pnpm release:approve [--sha <commit>] [--no-tags] [--list]
#   (pnpm runs it with the lockfile-pinned npm, which has `npm stage`)
#
#   --sha <commit>  commit CI staged from (default: origin/main). It is printed in
#                   the Depot `npm-release / stage` log as `commit=<sha>`.
#   --no-tags       approve, but do not create and push the signed release tags
#   --list          only show what is staged, then exit
#
# Steps:
#   1. list the staged @mizunagara/* versions (npm stage list)
#   2. rebuild that commit from a clean worktree and pnpm pack every package
#   3. download each staged tarball (npm stage download), check it against the
#      registry's shasum, and compare every file with the local rebuild
#   4. refuse on any difference; otherwise confirm, then `npm stage approve`
#      each one in dependency order (npm asks for 2FA)
#   5. create owner-signed tags <name>@<version> on the commit and push them
# shellcheck disable=SC2016  # the node -e programs are single-quoted on purpose
set -euo pipefail

SCOPE=@mizunagara/
SHA=""; TAGS=1; LIST_ONLY=0
while [ $# -gt 0 ]; do
  case "$1" in
    --sha) SHA="$2"; shift 2 ;;
    --no-tags) TAGS=0; shift ;;
    --list) LIST_ONLY=1; shift ;;
    -h|--help) sed -n '2,24p' "$0"; exit 0 ;;
    *) echo "approve: unknown argument $1 (see --help)" >&2; exit 2 ;;
  esac
done

die() { echo "approve: $*" >&2; exit 1; }
say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
sha256() { if command -v sha256sum >/dev/null; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }
sha1() { if command -v sha1sum >/dev/null; then sha1sum "$1" | cut -d' ' -f1; else shasum -a 1 "$1" | cut -d' ' -f1; fi; }
ver_ge() { [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -1)" = "$2" ]; }

[ "${CI:-}" != true ] || die "approve.sh runs on the owner's machine, not in CI"
for tool in git node npm pnpm tar; do command -v "$tool" >/dev/null || die "$tool is not on PATH"; done
ver_ge "$(npm --version)" 11.15.0 || die "npm $(npm --version) has no 'npm stage'; run this as: pnpm release:approve"
who="$(npm whoami 2>/dev/null)" || die "not logged in to npm: run 'npm login' (passkey)"

ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"
WORK="${XDG_CACHE_HOME:-$HOME/.cache}/mizu-approve/$$"
mkdir -p "$WORK"
cleanup() {
  git -C "$ROOT" worktree remove --force "$WORK/src" >/dev/null 2>&1 || true
  rm -rf "$WORK"
}
trap cleanup EXIT

say "1. staged versions (npm user: $who)"
npm stage list --json > "$WORK/staged.json"
node -e '
  const items = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))
    .filter((i) => i.packageName.startsWith(process.argv[2]));
  require("fs").writeFileSync(process.argv[1], JSON.stringify(items));
  if (!items.length) console.log("none");
  for (const i of items) console.log(`  ${i.packageName}@${i.version}  tag=${i.tag}  id=${i.id}  staged ${i.createdAt} by ${i.actor}`);
' "$WORK/staged.json" "$SCOPE"
count="$(node -p 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).length' "$WORK/staged.json")"
[ "$count" -gt 0 ] || { echo "Nothing staged under $SCOPE."; exit 0; }
[ "$LIST_ONLY" = 0 ] || exit 0

say "2. rebuild"
git fetch --quiet origin main --tags
SHA="$(git rev-parse --verify "${SHA:-origin/main}^{commit}")"
git merge-base --is-ancestor "$SHA" origin/main || die "$SHA is not on origin/main"
echo "commit $SHA ($(git log -1 --format=%s "$SHA"))"
git worktree add --quiet --detach "$WORK/src" "$SHA"
(
  cd "$WORK/src"
  pnpm install --frozen-lockfile --reporter=silent
  pnpm turbo run build --filter='./packages/*' --output-logs=errors-only
  node scripts/release/packages.mjs --check > "$WORK/packages.tsv"
  mkdir -p "$WORK/local"
  while IFS=$'\t' read -r name version dir <&3; do
    (cd "$dir" && pnpm pack --pack-destination "$WORK/local" >/dev/null)
  done 3< "$WORK/packages.tsv"
)

say "3. compare staged tarballs with the rebuild"
mkdir -p "$WORK/dl"
plan="$WORK/plan.tsv"; : > "$plan"; bad=0
while IFS=$'\t' read -r name version dir <&3; do
  entry="$(node -e '
    const items = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
    const i = items.find((x) => x.packageName === process.argv[2] && x.version === process.argv[3]);
    if (i) console.log([i.id, i.tag, i.shasum || ""].join("\t"));
  ' "$WORK/staged.json" "$name" "$version")"
  [ -n "$entry" ] || continue
  IFS=$'\t' read -r id tag shasum <<< "$entry"
  local_tgz="$WORK/local/$(echo "${name#@}" | tr / -)-$version.tgz"
  [ -f "$local_tgz" ] || { echo "  FAIL $name@$version: $SHA does not produce this version"; bad=1; continue; }

  remote_tgz="$WORK/dl/$(cd "$WORK/dl" && npm stage download "$id" 2>/dev/null | tail -1)"
  [ -f "$remote_tgz" ] || { echo "  FAIL $name@$version: could not download stage $id"; bad=1; continue; }
  if [ -n "$shasum" ] && [ "$(sha1 "$remote_tgz")" != "$shasum" ]; then
    echo "  FAIL $name@$version: download does not match the registry shasum"; bad=1; continue
  fi

  rm -rf "$WORK/x" && mkdir -p "$WORK/x/remote" "$WORK/x/local"
  tar -xzf "$remote_tgz" -C "$WORK/x/remote"
  tar -xzf "$local_tgz" -C "$WORK/x/local"
  if diff -r "$WORK/x/remote" "$WORK/x/local" > "$WORK/x/diff.txt"; then
    files="$(find "$WORK/x/remote" -type f | wc -l | tr -d ' ')"
    echo "  ok   $name@$version  tag=$tag  $files files identical  sha256=$(sha256 "$remote_tgz")"
    printf '%s\t%s\t%s\t%s\t%s\n' "$name" "$version" "$id" "$tag" "$(sha256 "$remote_tgz")" >> "$plan"
  else
    echo "  FAIL $name@$version: staged contents differ from the rebuild of $SHA"
    sed 's/^/         /' "$WORK/x/diff.txt" | head -20
    bad=1
  fi
done 3< "$WORK/packages.tsv"

unexpected="$(node -e '
  const items = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  const known = new Set(require("fs").readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => l.split("\t").slice(0, 2).join("@")));
  for (const i of items) if (!known.has(`${i.packageName}@${i.version}`)) console.log(`${i.packageName}@${i.version} (id ${i.id})`);
' "$WORK/staged.json" "$WORK/packages.tsv")"
if [ -n "$unexpected" ]; then
  echo "  FAIL staged versions that $SHA does not build (reject them with 'npm stage reject <id>'):"
  echo "$unexpected" | sed 's/^/         /'
  bad=1
fi
[ "$bad" = 0 ] || die "refusing to approve; nothing was published"
[ -s "$plan" ] || die "no staged version matches $SHA"

say "4. approve (npm will ask for your passkey)"
awk -F'\t' '{ printf "  %s@%s  tag=%s\n", $1, $2, $4 }' "$plan"
printf 'Publish these %s version(s) to npm? Type "publish" to continue: ' "$(wc -l < "$plan" | tr -d ' ')"
read -r answer < /dev/tty
[ "$answer" = publish ] || die "not confirmed; nothing was published"

started="$(date -u +%FT%TZ)"
approved=()
while IFS=$'\t' read -r name version id tag digest <&3; do
  npm stage approve "$id" < /dev/tty
  approved+=("$name@$version")
  printf '{"product":"mizu-%s","env":"npm","sha":"%s","digest":"sha256:%s","started":"%s","finished":"%s","result":"success","tag":"%s@%s","who":"%s"}\n' \
    "${name#@mizunagara/}" "$SHA" "$digest" "$started" "$(date -u +%FT%TZ)" "$name" "$version" "$(git config user.email)@$(hostname -s)" \
    | tee -a "${NAGARA_DEPLOY_LOG:-$WORK/deploy-log.jsonl}"
done 3< "$plan"

if [ "$TAGS" = 1 ]; then
  say "5. signed release tags"
  for t in "${approved[@]}"; do
    git tag -s "$t" "$SHA" -m "$t" || die "could not sign tag $t (configure git signing, or rerun with --no-tags and tag later)"
  done
  git push origin "${approved[@]/#/refs/tags/}"
fi
say "published: ${approved[*]}"
