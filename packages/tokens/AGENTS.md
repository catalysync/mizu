# @mizunagara/tokens — contributor guidance

Scope: `packages/tokens/`. Repo-wide rules are in [../../AGENTS.md](../../AGENTS.md).

## Pipeline

- **Tokens:** Style Dictionary 5, **DTCG format** (`$value` / `$type`), emits CSS / JSON / ES6 / React Native in one pass. Build config: `build/config.mjs`.
- **Token theming pipeline:** base tokens → semantic tokens → component tokens, each tier referenceable by name. CSS output uses `outputReferences: true` (`build/config.mjs:17`) so semantic vars stay as `var(--mizu-color-blue-600)` (not inlined) — consumers can override base tokens and the cascade flows to every semantic.
- Tier sources: `src/base/` (e.g. `colors.json`, `spacing.json`), `src/semantic/` (e.g. `colors.json`), `src/component/` (e.g. `focus.json`, `overlay.json`, `z-index.json`).
- Repo-level architecture decision 6 is in [../../AGENTS.md](../../AGENTS.md).

## Open backlog

- **Token tier 3 (component tokens)** — `packages/tokens/src/component/` exists in the build glob but is empty. (Check before acting: at this commit that folder holds `focus.json`, `overlay.json` and `z-index.json`.)
