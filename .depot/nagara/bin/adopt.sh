#!/usr/bin/env bash
# adopt.sh - vendor the Nagara CI/CD kit into a product repo, or check a vendored copy.
#
# From a nagara-platform checkout:
#   cicd/adopt.sh --target ~/code/tree --version cicd-v1.0.0 \
#                 --lang python:. --lang node-ts:apps/web [--postgres 16] [--owner @handle]
#   cicd/adopt.sh --target ~/code/tree --version cicd-v1.1.0     # upgrade, langs kept
#
# In a product repo (what guard / kit-integrity runs):
#   .depot/nagara/bin/adopt.sh --check
#
# Options
#   --target DIR       product repo root (default: the current git repo)
#   --version TAG      kit release tag cicd-vX.Y.Z, read with `git archive` from this
#                      checkout. Without it the working tree is vendored and recorded
#                      as cicd-v<VERSION>-dev: fine for trying the kit, not for merging.
#   --lang LANG[:DIR]  ruby | python | node-ts | go | rust, with the layer's working
#                      directory (default .). Repeatable, one per language. Default:
#                      the lang= lines already in .nagara-cicd.
#   --postgres 16|17   Postgres major for the test/migrations services (default: the
#                      value in .nagara-cicd, else 17).
#   --owner @HANDLE    owner for a new .github/CODEOWNERS (only written when the repo
#                      has none).
#
# Writes: .depot/workflows/nagara-guard.yml, .depot/workflows/nagara-<lang>.yml,
# .depot/nagara/** (scripts, configs, MANIFEST of sha256s), .nagara-cicd (pin,
# langs, product overrides kept), and renovate.json / .github/CODEOWNERS only when
# the repo has none. Never commits, never touches a Dockerfile.
set -euo pipefail

SELF="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
LANGS_OK="ruby python node-ts go rust"
PG_16=postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea
PG_17=postgres:17-alpine@sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24

die()  { echo "adopt: $*" >&2; exit 1; }
warn() { echo "adopt: warning: $*" >&2; }
sha256() { if command -v sha256sum >/dev/null; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }

MODE=adopt; TARGET=""; VERSION_TAG=""; PG=""; OWNER=""; LANG_ARGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --check) MODE=check; shift ;;
    --target) TARGET="$2"; shift 2 ;;
    --version) VERSION_TAG="$2"; shift 2 ;;
    --lang) LANG_ARGS+=("$2"); shift 2 ;;
    --postgres) PG="$2"; shift 2 ;;
    --owner) OWNER="$2"; shift 2 ;;
    -h|--help) sed -n '2,32p' "$0"; exit 0 ;;
    *) die "unknown argument $1 (see --help)" ;;
  esac
done

if [ -n "$TARGET" ]; then ROOT="$(cd "$TARGET" && git rev-parse --show-toplevel)"
else ROOT="$(git rev-parse --show-toplevel)"; fi
[ -n "$ROOT" ] || die "not inside a git repository"
VDIR=.depot/nagara
MANIFEST="$ROOT/$VDIR/MANIFEST"
CONF="$ROOT/.nagara-cicd"

# ── --check: what guard / kit-integrity runs ──────────────────────────────
if [ "$MODE" = check ]; then
  errs=0
  bad() { echo "kit-integrity: $*"; errs=$((errs + 1)); }
  [ -f "$MANIFEST" ] || { echo "kit-integrity: no $VDIR/MANIFEST (run cicd/adopt.sh)"; exit 1; }
  [ -f "$CONF" ] || { echo "kit-integrity: no .nagara-cicd"; exit 1; }
  mver="$(sed -n 's/^version //p' "$MANIFEST")"
  cver="$(sed -n 's/^version=//p' "$CONF" | head -1)"
  [ -n "$mver" ] && [ "$mver" = "$cver" ] || bad "MANIFEST is $mver but .nagara-cicd pins ${cver:-nothing}"
  case "$cver" in *-dev) bad "$cver is a working-tree build of the kit; adopt a released cicd-vX.Y.Z tag before merging" ;; esac
  listed="$(mktemp)"; trap 'rm -f "$listed"' EXIT
  while read -r sum path; do
    [ "$sum" = version ] && continue
    echo "$path" >> "$listed"
    if [ ! -f "$ROOT/$path" ]; then bad "missing $path"
    elif [ "$(sha256 "$ROOT/$path")" != "$sum" ]; then bad "modified $path (vendored files change only through adopt.sh)"; fi
  done < "$MANIFEST"
  ( cd "$ROOT" && { find "$VDIR" -type f ! -path "$VDIR/MANIFEST"; ls .depot/workflows/nagara-*.yml 2>/dev/null || true; } ) \
    | while IFS= read -r f; do grep -qxF "$f" "$listed" || echo "$f"; done > "$listed.extra"
  while IFS= read -r f; do bad "unexpected file $f (not in MANIFEST)"; done < "$listed.extra"
  rm -f "$listed.extra"
  while IFS= read -r l; do
    grep -qxF ".depot/workflows/nagara-$l.yml" "$listed" || bad "lang=$l has no vendored .depot/workflows/nagara-$l.yml"
  done < <(sed -n 's/^lang=\([^:]*\).*/\1/p' "$CONF")
  while IFS= read -r w; do
    [ "$w" = guard ] || grep -q "^lang=$w:" "$CONF" || bad "nagara-$w.yml is vendored but .nagara-cicd has no lang=$w"
  done < <(grep -o 'nagara-[a-z-]*\.yml$' "$listed" | sed 's/^nagara-//; s/\.yml$//')
  if [ "$errs" -gt 0 ]; then echo "kit-integrity: $errs problem(s)"; exit 1; fi
  echo "kit-integrity: $(wc -l < "$listed" | tr -d ' ') vendored files match $mver"
  exit 0
fi

# ── adopt: locate the kit source ──────────────────────────────────────────
KIT_SRC="$(dirname "$SELF")"
[ -d "$KIT_SRC/lang" ] && [ -d "$KIT_SRC/common" ] \
  || die "this is a vendored copy; run cicd/adopt.sh from a nagara-platform checkout (only --check works here)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
if [ -n "$VERSION_TAG" ]; then
  [[ "$VERSION_TAG" =~ ^cicd-v[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "--version must look like cicd-v1.2.3"
  [ "$(git -C "$KIT_SRC" cat-file -t "refs/tags/$VERSION_TAG" 2>/dev/null)" = tag ] \
    || die "$VERSION_TAG is not an annotated tag in $(git -C "$KIT_SRC" rev-parse --show-toplevel) (git fetch --tags?)"
  git -C "$(git -C "$KIT_SRC" rev-parse --show-toplevel)" archive "$VERSION_TAG" cicd | tar -x -C "$TMP" \
    || die "could not read cicd/ from $VERSION_TAG"
  KIT="$TMP/cicd"
  [ "cicd-v$(cat "$KIT/VERSION")" = "$VERSION_TAG" ] || die "$VERSION_TAG carries cicd/VERSION $(cat "$KIT/VERSION")"
  VERSION="$VERSION_TAG"
else
  KIT="$KIT_SRC"
  VERSION="cicd-v$(tr -d '[:space:]' < "$KIT/VERSION")-dev"
  warn "no --version: vendoring the working tree as $VERSION (kit-integrity fails on -dev pins until a release is adopted)"
fi

# ── languages and settings ────────────────────────────────────────────────
if [ "${#LANG_ARGS[@]}" -eq 0 ] && [ -f "$CONF" ]; then
  while IFS= read -r l; do LANG_ARGS+=("$l"); done < <(sed -n 's/^lang=//p' "$CONF")
fi
[ -n "$PG" ] || PG="$( [ -f "$CONF" ] && sed -n 's/^postgres=//p' "$CONF" | head -1 || true)"
PG="${PG:-17}"
case "$PG" in 16) PG_IMAGE="$PG_16" ;; 17) PG_IMAGE="$PG_17" ;; *) die "--postgres must be 16 or 17" ;; esac

SEEN=" "; LANG_LINES=()
for spec in ${LANG_ARGS[@]+"${LANG_ARGS[@]}"}; do
  l="${spec%%:*}"; d="."; [ "$spec" != "$l" ] && d="${spec#*:}"
  case " $LANGS_OK " in *" $l "*) ;; *) die "unknown language '$l' (one of: $LANGS_OK)" ;; esac
  case "$SEEN" in *" $l "*) die "--lang $l given twice; one directory per language in v1" ;; esac
  SEEN="$SEEN$l "
  d="${d#./}"; d="${d%/}"; [ -n "$d" ] || d="."
  case "$d" in /*|..|../*|*/..|*/../*) die "--lang $spec: directory must be inside the repo" ;; esac
  [ -d "$ROOT/$d" ] || die "--lang $spec: $ROOT/$d does not exist"
  LANG_LINES+=("$l:$d")
done
[ "${#LANG_LINES[@]}" -gt 0 ] || warn "no --lang: vendoring the common guard only (static site?)"

# ── write vendored files ──────────────────────────────────────────────────
NEW_LIST="$TMP/new-list"; : > "$NEW_LIST"
put() { # put <src> <dest-rel> [mode]
  mkdir -p "$(dirname "$ROOT/$2")"
  cp "$1" "$ROOT/$2"; chmod "${3:-0644}" "$ROOT/$2"
  echo "$2" >> "$NEW_LIST"
}
put "$KIT/adopt.sh" "$VDIR/bin/adopt.sh" 0755
for s in agent-guard.sh ci-step.sh dora.sh fetch-tool.sh workflow-lint.sh; do put "$KIT/common/bin/$s" "$VDIR/bin/$s" 0755; done
put "$KIT/common/hooks/pre-commit" "$VDIR/hooks/pre-commit" 0755
for s in protected-paths.txt actionlint.yaml hadolint.yaml; do put "$KIT/common/$s" "$VDIR/$s"; done
put "$KIT/ship/deploy-log.schema.json" "$VDIR/deploy-log.schema.json"
put "$KIT/common/workflows/guard.yml" .depot/workflows/nagara-guard.yml

for ld in ${LANG_LINES[@]+"${LANG_LINES[@]}"}; do
  l="${ld%%:*}"; d="${ld#*:}"
  if [ "$d" = . ]; then prefix=""; else prefix="$d/"; fi
  sed -e "s|__WORKDIR__|$d|g" -e "s|__PREFIX__|$prefix|g" -e "s|__PG_IMAGE__|$PG_IMAGE|g" \
    "$KIT/lang/$l/ci.yml" > "$TMP/wf.yml"
  ! grep -q '__[A-Z_]*__' "$TMP/wf.yml" || die "unfilled placeholder in lang/$l/ci.yml"
  put "$TMP/wf.yml" ".depot/workflows/nagara-$l.yml"
done

# Remove files an older adoption vendored that this one does not.
if [ -f "$MANIFEST" ]; then
  while read -r sum path; do
    [ "$sum" = version ] && continue
    grep -qxF "$path" "$NEW_LIST" || { rm -f "$ROOT/$path"; echo "removed stale $path"; }
  done < "$MANIFEST"
fi

# ── .nagara-cicd: managed lines rewritten, product lines kept ─────────────
HEADER="$TMP/header"
cat > "$HEADER" <<'EOF'
# Nagara CI/CD kit pin, written by cicd/adopt.sh. Protected path: a change needs
# the owner's `owner-reviewed-infra` label. adopt.sh rewrites version/lang/postgres
# and keeps every other line.
#
# Product settings (read by .depot/nagara/bin/ci-step.sh and agent-guard.sh):
#   <lang>.<job>=<command>|skip      replace a default job command, e.g.
#                                    python.test=uv run pytest -m "not slow"
#   <lang>.env.<NAME>=<value>        extra env for that layer's jobs
#   protect=<glob>                   extra protected path for agent-guard
EOF
{
  cat "$HEADER"
  echo "version=$VERSION"
  echo "postgres=$PG"
  for ld in ${LANG_LINES[@]+"${LANG_LINES[@]}"}; do echo "lang=$ld"; done
  if [ -f "$CONF" ]; then
    grep -vxF -f "$HEADER" "$CONF" | grep -Ev '^(version|lang|postgres)=' | sed '/./,$!d' || true
  fi
} > "$TMP/conf"
mv "$TMP/conf" "$CONF"

# ── MANIFEST ──────────────────────────────────────────────────────────────
{
  echo "version $VERSION"
  sort "$NEW_LIST" | while IFS= read -r p; do echo "$(sha256 "$ROOT/$p") $p"; done
} > "$TMP/manifest"
mv "$TMP/manifest" "$MANIFEST"

# ── product-owned files, only when absent ─────────────────────────────────
any_exists() { local f; for f in "$@"; do [ -e "$ROOT/$f" ] && return 0; done; return 1; }
if ! any_exists renovate.json renovate.json5 .github/renovate.json .github/renovate.json5 .renovaterc .renovaterc.json; then
  jq 'del(.description)' "$KIT/common/renovate.json" > "$ROOT/renovate.json"
  echo "wrote renovate.json (kit preset)"
else
  warn "renovate.json exists: merge in cicd/common/renovate.json (7-day minimumReleaseAge on the digest rule, nagara-*.yml excluded)"
fi
if ! any_exists CODEOWNERS .github/CODEOWNERS docs/CODEOWNERS; then
  if [ -n "$OWNER" ]; then
    mkdir -p "$ROOT/.github"
    sed "s|__OWNER__|$OWNER|g" "$KIT/common/CODEOWNERS.template" > "$ROOT/.github/CODEOWNERS"
    echo "wrote .github/CODEOWNERS (owner $OWNER)"
  else
    warn "no CODEOWNERS and no --owner: protected paths are not routed to the owner yet"
  fi
else
  warn "CODEOWNERS exists: make sure it covers cicd/common/CODEOWNERS.template"
fi

# ── report ────────────────────────────────────────────────────────────────
echo
echo "Vendored $VERSION into $ROOT ($(wc -l < "$NEW_LIST" | tr -d ' ') files)."
echo "Required checks for the main ruleset:"
echo "  guard / secrets, guard / workflow-lint, guard / dockerfile-lint, guard / agent-guard, guard / kit-integrity"
for ld in ${LANG_LINES[@]+"${LANG_LINES[@]}"}; do
  l="${ld%%:*}"
  jobs="$(awk '/^jobs:/ { on = 1; next } on && /^  [a-z-]+:$/ { gsub(/[ :]/, ""); print }' "$ROOT/.depot/workflows/nagara-$l.yml" \
    | sed "s|^|$l / |" | paste -sd, - | sed 's/,/, /g')"
  echo "  $jobs"
  for df in Dockerfile Containerfile; do [ -e "$ROOT/${ld#*:}/$df" ] && continue 2; done
  echo "  (no Dockerfile in ${ld#*:}: start from cicd/lang/$l/Dockerfile)"
done
echo "Next: review the diff, check locally with .depot/nagara/bin/ci-step.sh <lang> <job>,"
echo "open the PR with the owner-reviewed-infra label (STANDARD.md §7 lists the labels and ruleset)."
