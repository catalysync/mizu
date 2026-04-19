# Contributing to mizu

Thanks for your interest in contributing. mizu is a code-first, framework-agnostic design system — tokens, CSS, React bindings, layout primitives, shell composition, and framework bridges in one pnpm monorepo. This guide covers the workflow that keeps the tree green.

## Before you start

- **Bugs & small fixes:** open a pull request directly.
- **New features, API changes, new components:** open a GitHub issue first to align on scope. This avoids wasted work on something we'd ask to be redesigned.
- **Security issues:** do **not** open a public issue. See [`SECURITY.md`](./SECURITY.md).

By participating you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Prerequisites

- **Node.js** — active LTS or current.
- **pnpm 9** — the repository is a pnpm workspace with a frozen lockfile in CI.
- **Git** — with your user name and email configured.

## Setup

```bash
git clone https://github.com/catalysync/mizu.git
cd mizu
pnpm install
```

## Everyday commands

All tasks run through [turbo](https://turbo.build/) from the repo root:

```bash
pnpm turbo build         # build every package
pnpm turbo typecheck     # tsc --noEmit across packages
pnpm turbo lint          # eslint (flat config) + stylelint
pnpm turbo test          # vitest, with vitest-axe on interactive components
pnpm turbo dev           # dev servers for apps that declare one
```

Storybook and the docs site live under `apps/`:

```bash
pnpm --filter @aspect/storybook dev
pnpm --filter @aspect/docs dev
```

## Repository layout

```
packages/
  tokens/                  tokens pipeline (DTCG → CSS/JSON/ES6/RN)
  css/                     framework-agnostic component CSS
  react/                   React bindings
  tailwind-preset/         Tailwind v4 @theme bridge
  finance/, commerce/, …   domain packs
apps/
  storybook/               Storybook (components, patterns, demos)
  docs/                    public docs site (Next.js)
```

## Component patterns

When adding or modifying a React component under `packages/react/src/`:

- **Always `forwardRef`.**
- Use **`cn()`** from `../../utils/cn` to merge class names.
- Use **CVA** (class-variance-authority) for variant management.
- For interactive primitives (Modal, Drawer, Popover, Menu, Tooltip, etc.) wrap a **Radix** primitive — do not reinvent focus trap, overlay positioning, escape handling, or ARIA wiring.
- Compound components export a parent + sub-components (e.g. `Card` + `Card.Header` + `Card.Body` + `Card.Footer`).

## CSS & tokens

- CSS lives in `packages/css/src/` with BEM-style classes prefixed `mizu-` (for example, `.mizu-button--primary`).
- Reference tokens only via `var(--mizu-*)`; never hard-code hex, rgb, px, or numeric colors. The one exception is fallback values inside `var()` (e.g. `var(--mizu-text-primary, #111)`).
- State variations go on `data-*` attributes (`data-loading`, `data-invalid`, `data-selected`), not className flags like `--loading`.
- Hover / focus tints use `color-mix(in srgb, var(--mizu-text-primary) 6%, transparent)` so they work across every theme override.

## Tests

- Co-locate tests next to the component: `Component.test.tsx` beside `Component.tsx`.
- Use **vitest** + `@testing-library/react` + **vitest-axe**. Do not introduce `jest` or `jest-axe`.
- Every interactive component must include an `expect(await axe(container)).toHaveNoViolations()` assertion.
- Any component with a plausible accessibility pitfall (icon-only buttons, dialogs without titles, overlays without focus management) should ship a paired `Inaccessible` / `Accessible` story so the a11y addon can visibly flag the bad version.

## Stories & docs

- Stories live in `apps/storybook/stories/` using CSF 3 (`satisfies Meta<typeof Component>`).
- Interactive behavior stories go in `*.interaction.stories.tsx`.
- Narrative docs (usage, variants, accessibility guidance, props table) go in `Component.mdx` next to the stories file.
- The **Patterns** folder in Storybook is reserved for cross-cutting composition recipes. Product-specific shapes belong in a pack, not in Patterns.

### Story styling

- Use the utility classes in `apps/storybook/.storybook/story-utils.css` (`.story-sm`, `.story-md`, `.story-lg`, `.story-full`, `.story-dark-wrapper`, `.story-section-title`) to constrain story width, pad dark-canvas demos, and reset heading margins.
- Avoid ad-hoc inline wrappers like `style={{ width: N }}`, `style={{ maxWidth: N }}`, or `style={{ margin: 0 }}` inside stories — they sprawl quickly and bypass the shared convention.
- If none of the existing classes fits, add a new one to `story-utils.css` first, then use it.
- Provider wrappers (e.g. `TooltipProvider` for Tooltip stories) are legitimate uses of the per-story `decorators:` property. Layout / sizing concerns are not.

## Public API

- Every package exports through its `src/index.ts` barrel.
- `packages/react/src/index.ts` is the single entry for `@aspect/react`. A new component is only shipped once it's added to that barrel.

## Commits

- **Lowercase**, subject **≤30 characters**, imperative mood. Example: `add combobox component`, `fix: pre-existing typecheck`, `tokens: bump spacing scale`.
- **No attribution of any kind.** No `Co-Authored-By`, no AI-attribution lines, no "inspired by …" stamps pointing at external systems. The commit describes what the change is, not where the idea came from.
- **One logical change per commit.** Don't batch a feature, a refactor, and a test update into one diff.
- **Conventional Commits are welcome but not required.** If you use a type prefix, keep it lowercase (`fix:`, `feat:`, `docs:`, `refactor:`, `test:`).

## Changesets

Publishable packages (`@aspect/tokens`, `@aspect/css`, `@aspect/react`, `@aspect/tailwind-preset`, and the domain packs) are released via [changesets](https://github.com/changesets/changesets).

If your change is user-facing for any of those packages, add a changeset:

```bash
pnpm changeset
```

Follow the prompts to pick affected packages, bump type (`patch`, `minor`, `major`), and write a short summary.

Infra/app-only changes (Storybook config, docs site, workflows) do not need a changeset.

## Pull requests

Before opening:

1. Run `pnpm turbo build typecheck lint test` locally — or note in the PR if a subset is passing.
2. Add or update tests for behavior changes. Bug fixes should include a regression test.
3. Add a changeset if the change is user-facing for any published package.

In the PR description:

- Link the issue you're resolving (if any).
- Summarize what changed and why.
- List any user-visible changes that aren't covered by the changeset.

We review for correctness, accessibility, token discipline, and API shape consistency with the rest of the system. Expect to iterate — that's the point of review.

## Release process

Releases are driven by changesets via `.github/workflows/ci.yml`:

1. Merged changesets accumulate in a "Version Packages" PR opened by the changesets bot.
2. Merging that PR runs `changeset publish`, which bumps versions and publishes to npm.
3. Apps (`@aspect/storybook`, `@aspect/docs`) are not published — they deploy independently.

Maintainers handle the release PR. Contributors don't need to run changeset versioning by hand.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
