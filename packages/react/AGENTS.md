# @mizunagara/react — contributor guidance

Scope: `packages/react/`. Repo-wide rules are in [../../AGENTS.md](../../AGENTS.md).

These are conventions established in earlier sessions. Apply automatically; do not re-derive.

## Components

- Live in `packages/react/src/{components|layouts|shell}/`
- Always `forwardRef` — `src/components/Button/Button.tsx:37`, `src/components/Badge/Badge.tsx:28`
- Use `cn()` from `../../utils/cn` (a thin clsx wrapper) to merge class names — `src/utils/cn.ts:3`
- Use **CVA** (`class-variance-authority`) for variant management — see `Button.tsx` (`src/components/Button/Button.tsx:7`) and `Badge.tsx` (`src/components/Badge/Badge.tsx:5`)
- For interactive primitives (Modal, Drawer, Tooltip, Popover, etc.), wrap a **Radix** primitive — never reinvent overlay positioning, focus trap, escape handling, or aria management — example: `src/components/Tooltip/Tooltip.tsx:1`
- Use `Omit<HTMLAttributes<...>, 'title'>` when shipping a `title` prop that takes ReactNode (it conflicts with the native string `title`) — example: `src/components/PageHeader/PageHeader.tsx:4`
- Compound components export a parent + sub-components (e.g. `Card` + `CardHeader` + `CardBody` + `CardFooter`) — `src/components/Card/index.ts:1`

## Loading states

- Loading is `loading?: boolean`, applied via `data-loading={loading || undefined}` + `aria-busy={loading || undefined}` + `disabled={disabled ?? loading}` — `src/components/Button/Button.tsx:89-94`
- Spinner is absolutely positioned over a hidden label span (`.mizu-button__label` with `visibility: hidden` when loading) — CSS side at `packages/css/src/components/button.css:67-73`
- See `Button.tsx` / `button.css` for the canonical implementation

## Tests

- Co-located: `Component.test.tsx` next to `Component.tsx` — e.g. `src/components/Card/Card.test.tsx`
- Use **vitest** + `@testing-library/react` + **vitest-axe** (NOT jest-axe)
- Every interactive component MUST have an `expect(await axe(container)).toHaveNoViolations()` assertion
- Test setup at `src/test-setup.ts` extends matchers via declaration merging in `vitest`'s namespace — `expect.extend` at line 7, `declare module 'vitest'` at line 77

## Public API

- Every package exports through its `src/index.ts` barrel
- `src/index.ts` is the single entry — every new component must be added there to ship in the bundle (e.g. `src/index.ts:6` and `:8`)
- The bundled `dist/index.js` and `dist/index.cjs` are prefixed with `'use client';` via `scripts/prepend-use-client.mjs` (postbuild, `package.json:653`). tsup/esbuild strips directive-style banners, so a postbuild script is required. **Do NOT remove this** — it's what makes `@mizunagara/react` consumable from Next 14+ App Router (RSC).

## React Doctor gate

**React Doctor gate** — `pnpm doctor:gate` runs on every commit (husky pre-commit) and in a dedicated `doctor` CI job. Every workspace must score 100/100. Config: `react-doctor.config.json`, docs: `docs/react-doctor.md`. The gate pins `react-doctor` in the root devDependencies so its rules cannot drift (root `../../package.json:12-15` for the scripts).

**Review loop** for every implementation — plan → implement → **run `pnpm doctor:diff` against changed files** → self-review → commit. Never skip the doctor step; it catches derived-state-in-effect, cascading setState, hydration flashes, and other React anti-patterns that lint + typecheck don't.

## Don't

- ❌ Don't use **jest** or **jest-axe** — use vitest + vitest-axe
- ❌ Don't remove the `prepend-use-client.mjs` postbuild step — Next 14+ RSC consumers depend on it
