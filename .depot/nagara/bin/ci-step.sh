#!/usr/bin/env bash
# ci-step.sh - run one language-layer job with the kit's default command, or the
# product's override. Every lang/*/ci.yml job is `ci-step.sh <lang> <job>`, run
# in that layer's working directory, so the same command runs locally:
#
#   cd backend && ../.depot/nagara/bin/ci-step.sh python lint
#
# <lang>: ruby | python | node-ts | go | rust
# <job>:  setup | lint | typecheck | test | audit | migrations | build
#         (`setup` runs first inside every other job; it is not a separate check)
#
# Overrides live in the product's .nagara-cicd (a protected path, so an agent
# cannot quietly turn a check into a no-op):
#   python.test=uv run pytest -m "not slow"     replace the default command
#   ruby.typecheck=skip                         pass with a notice
#   python.env.DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/app_test
#
# Services: when $NAGARA_WAIT_PORTS is set ("5432 6379"), test and migrations
# wait for those localhost ports first (Depot CI does not honour health options).
set -euo pipefail

LANG_NAME="${1:?usage: ci-step.sh <lang> <job>}"; JOB="${2:?usage: ci-step.sh <lang> <job>}"
ROOT="$(git rev-parse --show-toplevel)"
CONF="$ROOT/.nagara-cicd"
WORK="$(pwd)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

note() { if [ "${GITHUB_ACTIONS:-}" = true ]; then echo "::notice title=$LANG_NAME / $JOB::$*"; else echo "note: $*"; fi; }
die()  { if [ "${GITHUB_ACTIONS:-}" = true ]; then echo "::error title=$LANG_NAME / $JOB::$*"; else echo "error: $*" >&2; fi; exit 1; }
say()  { printf '\n\033[1m$ %s\033[0m\n' "$*"; }
run()  { say "$*"; "$@"; }
conf() { [ -f "$CONF" ] && sed -n "s/^$1=//p" "$CONF" | head -1; return 0; }
has_file() { [ -e "$1" ]; }

# find_up <name>: nearest file named <name> from cwd up to the repo root
find_up() {
  local d="$WORK"
  while :; do
    [ -e "$d/$1" ] && { echo "$d/$1"; return 0; }
    [ "$d" = "$ROOT" ] || [ "$d" = / ] && return 1
    d="$(dirname "$d")"
  done
}

# Per-language env from .nagara-cicd, e.g. python.env.DATABASE_URL=...
if [ -f "$CONF" ]; then
  while IFS= read -r line; do
    k="${line%%=*}"; v="${line#*=}"; name="${k#"$LANG_NAME".env.}"
    case "$name" in ''|*[!A-Za-z0-9_]*) die "bad env name in .nagara-cicd: $k" ;; esac
    export "$name=$v"
  done < <(grep -E "^${LANG_NAME//./\\.}\\.env\\.[A-Za-z_][A-Za-z0-9_]*=" "$CONF" || true)
fi

wait_ports() {
  local p
  for p in ${NAGARA_WAIT_PORTS:-}; do
    for _ in $(seq 1 90); do
      if (exec 3<>"/dev/tcp/127.0.0.1/$p") 2>/dev/null; then echo "localhost:$p is up"; continue 2; fi
      sleep 1
    done
    die "service on localhost:$p never came up"
  done
}

osv_lockfile() {
  local lock="$1" bin
  if command -v osv-scanner >/dev/null; then bin=osv-scanner; else bin="$("$ROOT/.depot/nagara/bin/fetch-tool.sh" osv-scanner)"; fi
  run "$bin" scan source --lockfile="$lock"
}

# ── ruby ──────────────────────────────────────────────────────────────────
ruby_has_gem() { grep -qE "^    $1 \(" Gemfile.lock 2>/dev/null; }
ruby_default() {
  case "$1" in
    setup) bundle check >/dev/null 2>&1 || run bundle install ;;
    lint)
      if [ -x bin/rubocop ]; then run bin/rubocop; else run bundle exec rubocop; fi ;;
    typecheck) note "ruby has no typecheck job in v1"; ;;
    test)
      wait_ports
      [ -x bin/rails ] && run bin/rails db:prepare
      if [ -d spec ] && ruby_has_gem rspec-core; then
        if ruby_has_gem parallel_tests; then run bundle exec parallel_rspec; else run bundle exec rspec; fi
      elif [ -x bin/rails ]; then run bin/rails test
      else run bundle exec rake test; fi ;;
    audit)
      if ruby_has_gem bundler-audit; then run bundle exec bundler-audit check --update
      else
        run gem install bundler-audit -v 0.9.3 --no-document --install-dir "$TMP/gems"
        GEM_PATH="$TMP/gems:$(gem env gempath)" run "$TMP/gems/bin/bundler-audit" check --update
      fi
      if ruby_has_gem brakeman; then run bundle exec brakeman --no-pager --quiet
      elif [ -x bin/rails ]; then note "brakeman is not in the bundle; add it to run the Rails static scan"; fi ;;
    migrations)
      [ -d db/migrate ] || { note "no db/migrate"; return 0; }
      wait_ports
      local schema base rel
      for schema in db/schema.rb db/structure.sql; do [ -f "$schema" ] && break; done
      [ -f "$schema" ] || die "no db/schema.rb or db/structure.sql to check against"
      ruby_has_gem strong_migrations || note "strong_migrations is not in the bundle: unsafe operations are NOT checked, only schema drift (STANDARD.md §2 requires the gem)"
      base="$(git merge-base "${NAGARA_BASE:-origin/main}" HEAD)"
      rel="$(git ls-files --full-name -- "$schema")"
      # Load the BASE schema, then run only the migrations this PR adds, so
      # strong_migrations sees exactly them; then compare the dump with the
      # PR's committed schema. The PR's file is put back on any exit.
      cp "$schema" "$TMP/pr-schema"
      # shellcheck disable=SC2064  # expand now: $schema is local to this function
      trap "cp '$TMP/pr-schema' '$WORK/$schema'; rm -rf '$TMP'" EXIT
      git cat-file -e "$base:$rel" 2>/dev/null && git show "$base:$rel" > "$schema"
      run bin/rails db:create db:schema:load
      run bin/rails db:migrate
      run bin/rails db:schema:dump
      if ! diff -u "$TMP/pr-schema" "$schema"; then
        die "$schema drifts from what the migrations produce: run them and commit the dump"
      fi
      echo "schema matches the migrations" ;;
    build)
      if [ -x bin/rails ]; then
        run bin/rails zeitwerk:check
        if [ -d app/assets ] || [ -f config/importmap.rb ]; then SECRET_KEY_BASE_DUMMY=1 run bin/rails assets:precompile; fi
      else
        run bundle exec ruby -e 'Bundler.require'
      fi ;;
    *) die "unknown job $1" ;;
  esac
}

# ── python (uv; pip mode when there is no uv.lock but requirements*.txt) ──
py_mode() { if [ -f uv.lock ] || find_up uv.lock >/dev/null; then echo uv; elif ls requirements*.txt >/dev/null 2>&1; then echo pip; else echo none; fi; }
py_bin() { [ -x ".venv/bin/$1" ] || [ -x "$(dirname "$(find_up uv.lock 2>/dev/null || echo ./x)")/.venv/bin/$1" ]; }
py() {
  if [ "$(py_mode)" = uv ]; then run uv run --frozen "$@"; else run .venv/bin/"$1" "${@:2}"; fi
}
python_default() {
  local mode; mode="$(py_mode)"
  case "$1" in
    setup)
      case "$mode" in
        uv) run uv sync --locked --all-extras --all-groups ;;
        pip)
          [ -d .venv ] || run uv venv
          local f; for f in requirements*.txt; do run uv pip install --python .venv/bin/python -r "$f"; done ;;
        *) die "no uv.lock or requirements*.txt in $(pwd)" ;;
      esac ;;
    lint)
      py_bin ruff || die "ruff is not in the dev dependencies; add it, or set python.lint in .nagara-cicd"
      py ruff check .
      grep -q '^\[tool\.ruff\.format\]' pyproject.toml 2>/dev/null && py ruff format --check .
      return 0 ;;
    typecheck)
      if py_bin ty; then py ty check
      elif py_bin mypy; then py mypy .
      elif py_bin pyright; then py pyright
      else die "no type checker (ty, mypy or pyright) in the dev dependencies; add one, or set python.typecheck"; fi ;;
    test) wait_ports; py pytest ;;
    audit)
      if [ "$mode" = uv ]; then
        run uv export --frozen --all-extras --all-groups --no-emit-project --no-emit-workspace \
          --no-hashes --format requirements-txt -o "$TMP/req.txt"
        run uvx --from pip-audit==2.10.1 pip-audit --strict --no-deps --disable-pip -r "$TMP/req.txt"
      else
        local f; for f in requirements*.txt; do run uvx --from pip-audit==2.10.1 pip-audit -r "$f"; done
      fi ;;
    migrations)
      [ -f alembic.ini ] || { note "no alembic.ini"; return 0; }
      wait_ports
      local heads; heads="$(py alembic heads | grep -c '(head)' || true)"
      echo "alembic heads: $heads"
      [ "$heads" -le 1 ] || die "$heads Alembic heads: merge them (alembic merge heads) before this PR lands"
      py alembic upgrade head
      py alembic check ;;
    build)
      if grep -q '^\[build-system\]' pyproject.toml 2>/dev/null; then run uv build -o "$TMP/dist"
      else run python3 -m compileall -q -x '(^|/)(\.venv|node_modules)/' .; fi ;;
    *) die "unknown job $1" ;;
  esac
}

# ── node-ts ───────────────────────────────────────────────────────────────
node_lock() { local l; for l in pnpm-lock.yaml yarn.lock package-lock.json; do find_up "$l" && return 0; done; return 1; }
node_pm() { case "$(basename "$(node_lock)")" in pnpm-lock.yaml) echo pnpm ;; yarn.lock) echo yarn ;; *) echo npm ;; esac; }
node_has_script() { jq -e --arg s "$1" '.scripts[$s] // empty' package.json >/dev/null 2>&1; }
node_script() { run "$(node_pm)" run "$1"; }
node_default() {
  case "$1" in
    setup)
      node_lock >/dev/null || die "no pnpm-lock.yaml, yarn.lock or package-lock.json"
      command -v corepack >/dev/null && { corepack enable 2>/dev/null || note "corepack enable failed; using the package manager on PATH"; }
      local lockdir; lockdir="$(dirname "$(node_lock)")"
      case "$(node_pm)" in
        pnpm) (cd "$lockdir" && run pnpm install --frozen-lockfile) ;;
        yarn) if [ -f "$lockdir/.yarnrc.yml" ]; then (cd "$lockdir" && run yarn install --immutable); else (cd "$lockdir" && run yarn install --frozen-lockfile); fi ;;
        npm)  (cd "$lockdir" && run npm ci) ;;
      esac ;;
    lint) node_has_script lint || die "package.json has no \"lint\" script; add one, or set node-ts.lint"; node_script lint ;;
    typecheck)
      local s; for s in typecheck check-types type-check tsc; do node_has_script "$s" && { node_script "$s"; return 0; }; done
      [ -f tsconfig.json ] || die "no typecheck script and no tsconfig.json; set node-ts.typecheck"
      run "$(node_pm)" exec tsc --noEmit ;;
    test) node_has_script test || die "package.json has no \"test\" script; add one, or set node-ts.test"; node_script test ;;
    audit) osv_lockfile "$(node_lock)" ;;
    build) node_has_script build || die "package.json has no \"build\" script; set node-ts.build"; node_script build ;;
    migrations) note "node-ts has no migrations job in v1" ;;
    *) die "unknown job $1" ;;
  esac
}

# ── go ────────────────────────────────────────────────────────────────────
go_default() {
  case "$1" in
    setup) if [ -d vendor ]; then echo "vendored modules"; else run go mod download; fi ;;
    lint)
      say "gofmt -l (excluding vendor/)"
      local unformatted; unformatted="$(gofmt -l . | grep -v '^vendor/' || true)"
      [ -z "$unformatted" ] || { echo "$unformatted"; die "gofmt: the files above are not formatted"; }
      run go vet ./... ;;
    typecheck) note "go type-checks in build/test" ;;
    test) wait_ports; run go test -race -timeout 300s ./... ;;
    audit) run go run golang.org/x/vuln/cmd/govulncheck@v1.8.0 ./... ;;
    build) run go build -o "$TMP/" ./... ;;
    migrations) note "go has no migrations job in v1; golang-migrate SQL is covered by agent-guard" ;;
    *) die "unknown job $1" ;;
  esac
}

# ── rust ──────────────────────────────────────────────────────────────────
rust_default() {
  case "$1" in
    setup)
      if command -v rustup >/dev/null; then run rustup show active-toolchain || run rustup default stable; fi ;;
    lint)
      command -v rustup >/dev/null && run rustup component add rustfmt clippy
      run cargo fmt --all --check
      run cargo clippy --locked --all-targets --all-features -- -D warnings ;;
    typecheck) note "rust type-checks in build/test" ;;
    test) wait_ports; run cargo test --locked --all-features ;;
    audit) osv_lockfile "$(find_up Cargo.lock || die "no Cargo.lock (commit it)")" ;;
    build) run cargo build --locked --all-targets ;;
    migrations) note "rust has no migrations job in v1" ;;
    *) die "unknown job $1" ;;
  esac
}

# ── dispatch ──────────────────────────────────────────────────────────────
step() {
  local job="$1" override; override="$(conf "$LANG_NAME.$job")"
  if [ "$override" = skip ]; then note "skipped by $LANG_NAME.$job=skip in .nagara-cicd"; return 0; fi
  if [ -n "$override" ]; then say "$override   (.nagara-cicd $LANG_NAME.$job)"; bash -euo pipefail -c "$override"; return; fi
  case "$LANG_NAME" in
    ruby) ruby_default "$job" ;;
    python) python_default "$job" ;;
    node-ts) node_default "$job" ;;
    go) go_default "$job" ;;
    rust) rust_default "$job" ;;
    *) die "unknown language layer '$LANG_NAME'" ;;
  esac
}

case "$JOB" in
  setup|lint|typecheck|test|audit|migrations|build) ;;
  *) die "unknown job '$JOB' (setup|lint|typecheck|test|audit|migrations|build)" ;;
esac
[ "$JOB" = setup ] || [ "$JOB" = audit ] || step setup
step "$JOB"
