#!/usr/bin/env bash
# agent-guard.sh - refuse the PR shapes an AI agent should not merge unseen.
#
#   .depot/nagara/bin/agent-guard.sh [--base <rev>] [--labels a,b,c]
#
# Compares merge-base(<base>, HEAD)..HEAD. <base> defaults to $NAGARA_BASE, then
# origin/$GITHUB_BASE_REF, then origin/main. Labels default to $PR_LABELS
# (comma-separated, as the workflow passes them).
#
# Each finding names the owner-only label that overrides it (STANDARD.md §4):
#   protected path changed          owner-reviewed-infra
#   test file deleted / skip added  tests-changed-ok
#   new package in a lockfile       new-dep-ok
#   contract migration operation    contract-ok   (or `contract-ok` on the line)
#   diff over 1,000 lines           large-pr-ok   (warning only above 400)
#
# Exit 0 when every finding is overridden or only warnings remain, 1 otherwise.
# Portable to bash 3.2 (macOS) so it runs the same locally and in CI.
set -euo pipefail
export LC_ALL=C

BASE_REV="${NAGARA_BASE:-}"; LABELS="${PR_LABELS:-}"
while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE_REV="$2"; shift 2 ;;
    --labels) LABELS="$2"; shift 2 ;;
    -h|--help) sed -n '2,19p' "$0"; exit 0 ;;
    *) echo "agent-guard: unknown argument $1" >&2; exit 2 ;;
  esac
done

KIT="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(git rev-parse --show-toplevel)"; cd "$ROOT"
WARN_LINES="${NAGARA_WARN_LINES:-400}"; MAX_LINES="${NAGARA_MAX_LINES:-1000}"

if [ -z "$BASE_REV" ]; then
  for c in "origin/${GITHUB_BASE_REF:-main}" origin/main main; do
    if git rev-parse --verify --quiet "$c^{commit}" >/dev/null; then BASE_REV="$c"; break; fi
  done
fi
[ -n "$BASE_REV" ] || { echo "agent-guard: no base revision (pass --base)" >&2; exit 2; }
BASE="$(git merge-base "$BASE_REV" HEAD)" || { echo "agent-guard: no merge-base with $BASE_REV (shallow clone? use fetch-depth: 0)" >&2; exit 2; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
FAILS=0; WARNS=0; OVERRIDDEN=0
summary() { [ -n "${GITHUB_STEP_SUMMARY:-}" ] && printf '%s\n' "$*" >> "$GITHUB_STEP_SUMMARY"; return 0; }
has_label() { case ",$LABELS," in *",$1,"*) return 0 ;; esac; return 1; }

# finding <error|warning> <override-label> <title> <detail-file-or-empty>
finding() {
  local level="$1" label="$2" title="$3" detail="${4:-}"
  if [ "$level" = error ] && has_label "$label"; then
    OVERRIDDEN=$((OVERRIDDEN + 1))
    echo "OVERRIDDEN by label '$label': $title"
    summary "- overridden by \`$label\`: $title"
    return 0
  fi
  if [ "$level" = error ]; then FAILS=$((FAILS + 1)); else WARNS=$((WARNS + 1)); fi
  if [ "${GITHUB_ACTIONS:-}" = true ]; then
    echo "::$level title=agent-guard::$title (owner label to override: $label)"
  else
    echo "$(echo "$level" | tr "[:lower:]" "[:upper:]"): $title (owner label to override: $label)"
  fi
  summary "- **$level**: $title (override: \`$label\`)"
  if [ -n "$detail" ] && [ -s "$detail" ]; then
    head -50 "$detail" | sed 's/^/    /'
    [ "$(wc -l < "$detail")" -le 50 ] || echo "    ... $(($(wc -l < "$detail") - 50)) more"
    summary '```'; summary "$(head -50 "$detail")"; summary '```'
  fi
}

# glob_match <path> <pattern>: no `/` in the pattern = basename match anywhere.
# shellcheck disable=SC2053  # the right-hand side IS the glob
glob_match() {
  case "$2" in
    */*) [[ "$1" == $2 ]] ;;
    *)   [[ "${1##*/}" == $2 ]] ;;
  esac
}

is_lockfile() {
  case "${1##*/}" in
    Gemfile.lock|gems.locked|uv.lock|poetry.lock|pdm.lock|Cargo.lock|go.sum|\
    package-lock.json|npm-shrinkwrap.json|pnpm-lock.yaml|yarn.lock|bun.lock|requirements*.txt) return 0 ;;
  esac
  return 1
}

is_test() {
  case "$1" in
    *.rb|*.py|*.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.mts|*.cts|*.go|*.rs) ;;
    *) return 1 ;;
  esac
  case "$1" in
    spec/*|*/spec/*|test/*|*/test/*|tests/*|*/tests/*|__tests__/*|*/__tests__/*|e2e/*|*/e2e/*|features/*|*/features/*) return 0 ;;
  esac
  case "${1##*/}" in
    *_spec.rb|*_test.rb|test_*.py|*_test.py|*.test.*|*.spec.*|*_test.go) return 0 ;;
  esac
  return 1
}

is_migration() {
  case "$1" in
    *.down.sql) return 1 ;;
    db/migrate/*.rb|*/db/migrate/*.rb|*alembic/versions/*.py|*migrations/*.sql|*migrations/*.py) return 0 ;;
  esac
  return 1
}

# ── inputs ────────────────────────────────────────────────────────────────
git diff --name-status -M "$BASE" HEAD > "$TMP/status"
# path<TAB>added line, for every added line in the PR.
git diff -U0 --no-color --no-ext-diff -M "$BASE" HEAD | awk '
  /^\+\+\+ / { p = substr($0, 5); sub(/^b\//, "", p); next }
  /^\+/ && p != "/dev/null" { print p "\t" substr($0, 2) }' > "$TMP/added"
echo "agent-guard: $(wc -l < "$TMP/status" | tr -d ' ') files changed since $(git rev-parse --short "$BASE")${LABELS:+; labels: $LABELS}"
summary "### agent-guard"

# every path the PR touches (old and new side of renames)
awk -F'\t' '{ for (i = 2; i <= NF; i++) print $i }' "$TMP/status" | sort -u > "$TMP/paths"

# ── 1. protected paths ────────────────────────────────────────────────────
{
  grep -v '^[[:space:]]*\(#\|$\)' "$KIT/protected-paths.txt" || true
  [ -f .nagara-cicd ] && sed -n 's/^protect=//p' .nagara-cicd
} > "$TMP/patterns"
: > "$TMP/protected"
while IFS= read -r path; do
  case "$path" in vendor/*|*/vendor/*|node_modules/*|*/node_modules/*) continue ;; esac
  while IFS= read -r pat; do
    if glob_match "$path" "$pat"; then echo "$path  (matches $pat)" >> "$TMP/protected"; break; fi
  done < "$TMP/patterns"
done < "$TMP/paths"
if [ -s "$TMP/protected" ]; then
  finding error owner-reviewed-infra "$(wc -l < "$TMP/protected" | tr -d ' ') protected path(s) changed" "$TMP/protected"
fi

# ── 2. weakened tests: deleted test files, new skip/focus markers ─────────
: > "$TMP/deleted"
while IFS="$(printf '\t')" read -r st a b; do
  case "$st" in
    D) is_test "$a" && echo "deleted: $a" >> "$TMP/deleted" ;;
    R*) if is_test "$a" && ! is_test "$b"; then echo "moved out of tests: $a -> $b" >> "$TMP/deleted"; fi ;;
  esac
done < "$TMP/status"
[ -s "$TMP/deleted" ] && finding error tests-changed-ok "test file(s) deleted" "$TMP/deleted"

RB_SKIP='^[[:space:]]*(xit|xdescribe|xcontext|xspecify|xscenario|fit|fdescribe|fcontext|fspecify|pending|skip)([[:space:]]|\(|$)|focus:[[:space:]]*true|,[[:space:]]*:focus'
PY_SKIP='@pytest\.mark\.(skip|skipif|xfail)|pytest\.(skip|xfail)\(|unittest\.skip|@skip'
JS_SKIP='(^|[^[:alnum:]_])(it|test|describe|suite|context|specify)\.(skip|only|todo)\(|(^|[^[:alnum:]_])(xit|xtest|xdescribe|fit|fdescribe)\('
GO_SKIP='(t|b)\.Skip(f|Now)?\('
RS_SKIP='#\[ignore'
: > "$TMP/skips"
cut -f1 "$TMP/added" | sort -u > "$TMP/added_paths"
while IFS= read -r path; do
  re=""
  case "$path" in *.rs) re="$RS_SKIP" ;; esac
  if [ -z "$re" ] && is_test "$path"; then
    case "$path" in
      *.rb) re="$RB_SKIP" ;; *.py) re="$PY_SKIP" ;; *.go) re="$GO_SKIP" ;;
      *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.mts|*.cts) re="$JS_SKIP" ;;
    esac
  fi
  [ -n "$re" ] || continue
  awk -F'\t' -v p="$path" '$1 == p { sub(/^[^\t]*\t/, ""); print }' "$TMP/added" \
    | grep -E -- "$re" | sed "s|^|$path: |" >> "$TMP/skips" || true
done < "$TMP/added_paths"
[ -s "$TMP/skips" ] && finding error tests-changed-ok "skip/focus marker(s) added to tests" "$TMP/skips"

# ── 3. new dependencies (package-name sets of every changed lockfile) ─────
lock_names() {
  case "${1##*/}" in
    Gemfile.lock|gems.locked)
      awk '/^    [A-Za-z0-9_.-]+ \(/ { print $1 }' ;;
    uv.lock|poetry.lock|pdm.lock|Cargo.lock)
      sed -n 's/^name = "\(.*\)"$/\1/p' | tr 'A-Z_.' 'a-z--' ;;
    requirements*.txt)
      sed -e 's/#.*//' -e 's/^[[:space:]]*//' | { grep -Ev '^(-|$)' || true; } \
        | sed -E 's/^([A-Za-z0-9._-]+).*/\1/' | tr 'A-Z_.' 'a-z--' ;;
    package-lock.json|npm-shrinkwrap.json)
      jq -r '((.packages // {}) | keys[] | select(. != "") | sub(".*node_modules/"; "")),
             ((.dependencies // {}) | keys[])' ;;
    pnpm-lock.yaml)
      { grep -E "^  '?/?@?[^@' ]+@" || true; } | sed -E "s/^  '?\\/?(@?[^@']+)@.*/\\1/" ;;
    yarn.lock|bun.lock)
      { grep -E '^"?@?[^@" #][^@"]*@' || true; } | sed -E 's/^"?(@?[^@"]+)@.*/\1/' ;;
    go.sum)
      awk '{ print $1 }' ;;
  esac
}
: > "$TMP/newdeps"
while IFS= read -r path; do
  is_lockfile "$path" || continue
  git cat-file -e "HEAD:$path" 2>/dev/null || continue
  { git show "$BASE:$path" 2>/dev/null || true; } | lock_names "$path" | sort -u > "$TMP/old"
  git show "HEAD:$path" | lock_names "$path" | sort -u > "$TMP/new"
  comm -13 "$TMP/old" "$TMP/new" | sed "s|^|$path: |" >> "$TMP/newdeps"
done < "$TMP/paths"
[ -s "$TMP/newdeps" ] && finding error new-dep-ok "$(wc -l < "$TMP/newdeps" | tr -d ' ') new package name(s) in lockfiles (check each is real and intended)" "$TMP/newdeps"

# ── 4. contract migrations in added lines ─────────────────────────────────
CONTRACT='(remove_column|remove_columns|remove_reference|remove_belongs_to|remove_timestamps|drop_table|drop_join_table|rename_column|rename_table|change_column([^_[:alnum:]]|$)|op\.drop_(column|table|constraint)|op\.rename_table|new_column_name|type_[[:space:]]*=|drop[[:space:]]+(table|column|schema)|rename[[:space:]]+(column|to)|alter[[:space:]]+column.*[[:space:]]type[[:space:]]|truncate[[:space:]])'
: > "$TMP/contract"
while IFS= read -r path; do
  is_migration "$path" || continue
  # Drop `def down` / `def downgrade` bodies: reversals of an expand are not contracts.
  awk -F'\t' -v p="$path" '$1 == p { sub(/^[^\t]*\t/, ""); print }' "$TMP/added" | awk '
    /^[[:space:]]*def[[:space:]]+(down|downgrade)([^[:alnum:]_]|$)/ { skip = 1; next }
    /^[[:space:]]*def[[:space:]]+(up|upgrade|change)([^[:alnum:]_]|$)/ { skip = 0 }
    !skip' | grep -Ei -- "$CONTRACT" | grep -v 'contract-ok' | sed "s|^|$path: |" >> "$TMP/contract" || true
done < "$TMP/added_paths"
[ -s "$TMP/contract" ] && finding error contract-ok "contract migration operation(s): ship expand first, contract in a later PR" "$TMP/contract"

# ── 5. size ────────────────────────────────────────────────────────────────
git diff --numstat "$BASE" HEAD > "$TMP/numstat"
cut -f3 "$TMP/numstat" | git check-attr --stdin linguist-generated linguist-vendored \
  | awk -F': ' '$3 == "set" || $3 == "true" { print $1 }' | sort -u > "$TMP/generated"
lines=0
while IFS="$(printf '\t')" read -r add del path; do
  [ "$add" = "-" ] && continue
  is_lockfile "$path" && continue
  grep -qxF -- "$path" "$TMP/generated" && continue
  case "$path" in
    vendor/*|*/vendor/*|node_modules/*|*/node_modules/*|.depot/nagara/*|.depot/workflows/nagara-*) continue ;;
    *.min.js|*.min.css|*.map|*.snap|*_pb2.py|*.pb.go|*.gen.*|*generated*|db/schema.rb|db/structure.sql|*/db/schema.rb) continue ;;
  esac
  lines=$((lines + add + del))
done < "$TMP/numstat"
echo "agent-guard: $lines reviewable lines changed (warn > $WARN_LINES, fail > $MAX_LINES)"
if [ "$lines" -gt "$MAX_LINES" ]; then
  finding error large-pr-ok "$lines changed lines (limit $MAX_LINES): split the PR"
elif [ "$lines" -gt "$WARN_LINES" ]; then
  finding warning large-pr-ok "$lines changed lines (aim for under $WARN_LINES)"
fi

echo "agent-guard: $FAILS failing, $WARNS warning, $OVERRIDDEN overridden"
summary "" "$FAILS failing, $WARNS warning, $OVERRIDDEN overridden by owner labels."
[ "$FAILS" -eq 0 ]
