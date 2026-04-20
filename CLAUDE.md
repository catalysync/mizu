# mizu

A code-first, framework-agnostic design system. Tokens → CSS → React bindings → Tailwind v4 bridge → Storybook + docs site, all in one pnpm monorepo.

## Stack

- **Package manager:** pnpm 9 (workspaces, frozen lockfile in CI)
- **Build orchestration:** turbo (`pnpm turbo build|lint|typecheck|test`)
- **Tokens:** Style Dictionary 5, **DTCG format** (`$value` / `$type`), emits CSS / JSON / ES6 / React Native in one pass
- **CSS:** plain CSS with `--mizu-*` custom properties, BEM class names (`.mizu-button--primary`), bundled by **lightningcss** JS API
- **React:** React 19, built with **tsup** (ESM + CJS + .d.ts + .d.cts)
- **Linting:** ESLint **flat config** + `jsx-a11y/recommended` (root `eslint.config.mjs`); stylelint with BEM-friendly `selector-class-pattern` (root `stylelint.config.mjs`)
- **Testing:** vitest + @testing-library/react + **vitest-axe** (NOT jest-axe)
- **Tailwind bridge:** Tailwind **v4** only, CSS-first via `@theme` block (`packages/tailwind-preset/src/preset.css`). A v3 fallback exists at `./legacy` but is not the recommended path.
- **Storybook:** v10, `@storybook/react-vite`, `addon-a11y` only (essentials are built into core in v9+)
- **Docs site:** Next.js 16, App Router, `@next/mdx`
- **Release:** changesets via `changesets/action@v1` in `.github/workflows/ci.yml`

## Workspace layout

```
packages/
  tokens/                  → @aspect/tokens (DTCG JSON → CSS/JSON/ES6/RN)
  css/                     → @aspect/css (framework-agnostic CSS)
    src/components/        → atomic components (button, input, badge, …)
    src/layouts/           → layout primitives (stack, inline, grid, …)
    src/shell/             → app shell (header, sidebar, content, layout, breadcrumbs)
    src/themes/            → per-demo theme overrides (cloud, ecommerce, finance, customer-engagement)
    src/typography.css     → standalone opt-in type sheet
  react/                   → @aspect/react (React bindings, ESM+CJS+dts via tsup)
  tailwind-preset/         → @aspect/tailwind-preset (v4 @theme bridge + ./legacy v3 fallback)
  tsconfig/                → @aspect/tsconfig (shared base/react/react-native tsconfigs)
apps/
  storybook/               → @aspect/storybook (Storybook 10 + Vite)
  docs/                    → @aspect/docs (Next.js 16)
.changeset/                → changesets config + pending changesets
.github/workflows/ci.yml   → quality + release pipeline
```

## Architectural decisions

1. **Compositional shell, not monolithic.** `AppHeader`, `AppSidebar`, `AppContent`, `AppBreadcrumbs`, `AppLayout` are independent components that can be assembled. Inspired by Carbon's `UIShell`, NOT Cloudscape's monolithic `AppLayout`. Reason: 8 of 9 surveyed design systems reject the monolithic shell because the host app needs to own the chrome (Polaris deprecated their `Frame` for this reason).

2. **Cloudscape is the atomic component reference, not the shell reference.** Component names, props, and patterns (PropertyFilter, KeyValuePairs, contentType presets, collection preferences) are borrowed from Cloudscape. The shell architecture is borrowed from Carbon.

3. **Tailwind v4 only.** No v3 plugin API. The bridge is a single CSS file with a `@theme {}` block that maps Tailwind theme keys to `var(--mizu-*)` references. Zero JavaScript on the bridge side. v3 legacy preset exists at `@aspect/tailwind-preset/legacy` but is not the recommended path.

4. **Components / Patterns / Demos** is the Storybook structure. Components are reusable atoms (live in `@aspect/react/components/*` or `@aspect/react/shell/*`); Patterns are opinionated compositions; Demos are full app shells with mock data and theme overrides. Same components reused across demos. Mirror of Cloudscape / Polaris / Tailwind UI's structure.

5. **Layout primitive vocabulary** (`Stack`, `Inline`, `Grid`, `Split`, `Center`, `Cluster`) is from **Braid** (SEEK) — the cleanest layout vocabulary in the field.

6. **Token theming pipeline:** base tokens → semantic tokens → component tokens, each tier referenceable by name. CSS output uses `outputReferences: true` so semantic vars stay as `var(--mizu-color-blue-600)` (not inlined) — consumers can override base tokens and the cascade flows to every semantic.

## Component patterns (apply to every new component)

These are conventions established in earlier sessions. Apply automatically; do not re-derive.

### CSS

- Live in `packages/css/src/{components|layouts|shell|themes}/`
- Use BEM-style classes prefixed `mizu-` (`.mizu-button--primary`, `.mizu-app-sidebar__item`)
- Reference tokens only via `var(--mizu-*)` — no hex codes inline (the one exception is fallback values like `var(--mizu-action-destructive-default, #dc2626)`)
- State variations via `data-*` attributes, NOT className flags (`.mizu-button[data-loading="true"]`, not `.mizu-button--loading`)
- `color-mix(in srgb, var(--mizu-text-primary) 6%, transparent)` is the canonical way to do hover/focus tints — works regardless of theme overrides

### React

- Live in `packages/react/src/{components|layouts|shell}/`
- Always `forwardRef`
- Use `cn()` from `../../utils/cn` (a thin clsx wrapper) to merge class names
- Use **CVA** (`class-variance-authority`) for variant management — see `Button.tsx` and `Badge.tsx`
- For interactive primitives (Modal, Drawer, Tooltip, Popover, etc.), wrap a **Radix** primitive — never reinvent overlay positioning, focus trap, escape handling, or aria management
- Use `Omit<HTMLAttributes<...>, 'title'>` when shipping a `title` prop that takes ReactNode (it conflicts with the native string `title`)
- Compound components export a parent + sub-components (e.g. `Card` + `CardHeader` + `CardBody` + `CardFooter`)

### Loading states

- Loading is `loading?: boolean`, applied via `data-loading={loading || undefined}` + `aria-busy={loading || undefined}` + `disabled={disabled ?? loading}`
- Spinner is absolutely positioned over a hidden label span (`.mizu-button__label` with `visibility: hidden` when loading)
- See `Button.tsx` / `button.css` for the canonical implementation

### Tests

- Co-located: `Component.test.tsx` next to `Component.tsx`
- Use **vitest** + `@testing-library/react` + **vitest-axe** (NOT jest-axe)
- Every interactive component MUST have an `expect(await axe(container)).toHaveNoViolations()` assertion
- Test setup at `packages/react/src/test-setup.ts` extends matchers via declaration merging in `vitest`'s namespace

### Stories

- Live in `apps/storybook/stories/`
- Use **CSF 3** (`satisfies Meta<typeof Component>` + `StoryObj<typeof meta>`), not the deprecated `Story.bind({})` pattern
- Every interactive component with potential a11y pitfalls (icon buttons, dialogs, etc.) MUST ship a paired **`Inaccessible` / `Accessible`** story so the a11y addon can visibly flag the bad version
- Demo stories use `parameters.layout: 'fullscreen'`
- Stories are exported by name; the meta `title` controls the sidebar tree (`'Components/Atoms/Button'`, `'Demos/Cloud'`)

### Public API

- Every package exports through its `src/index.ts` barrel
- `packages/react/src/index.ts` is the single entry — every new component must be added there to ship in the bundle
- The bundled `dist/index.js` and `dist/index.cjs` are prefixed with `'use client';` via `scripts/prepend-use-client.mjs` (postbuild). tsup/esbuild strips directive-style banners, so a postbuild script is required. **Do NOT remove this** — it's what makes `@aspect/react` consumable from Next 14+ App Router (RSC).

## Per-demo theming

- Each demo lives in `apps/storybook/stories/demos/{name}/`
- Demos wrap their content in `<AppLayout data-mizu-theme="{name}">`
- Each theme is a CSS file at `packages/css/src/themes/{name}.css` containing a `[data-mizu-theme="{name}"] { --mizu-* override; }` block
- All theme files are imported in `apps/storybook/.storybook/preview.ts` so they're always available; the data-attribute selector decides which one applies
- Same shell components, different theme overrides, different mock data — that's the substrate model

## Quality gates

`pnpm turbo build typecheck lint test` runs everything in topological order. As of the last green run:

- 12 turbo tasks
- All packages: build clean
- `@aspect/react`: typecheck + lint + test (with vitest-axe a11y check)
- `@aspect/css`: stylelint with BEM-friendly `selector-class-pattern`
- `@aspect/storybook` and `@aspect/docs`: build to `storybook-static/` and `.next/` respectively

**React Doctor gate** — `pnpm doctor:gate` runs on every commit (husky pre-commit) and in a dedicated `doctor` CI job. Every workspace must score 100/100. Config: `react-doctor.config.json`, docs: `docs/react-doctor.md`, known debt: `mizu-planning/27-react-doctor-debt.md`.

**Review loop** for every implementation — plan → implement → **run `pnpm doctor:diff` against changed files** → self-review → commit. Never skip the doctor step; it catches derived-state-in-effect, cascading setState, hydration flashes, and other React anti-patterns that lint + typecheck don't.

CI runs the same commands on every push and PR. Release flow uses `changesets/action@v1`: dev creates a changeset (`pnpm changeset`), CI auto-opens a "Version Packages" PR, merging it triggers npm publish.

## Conventions

- **Commits:** lowercase, ≤30 chars subject, no Claude attribution
- **Vercel:** each app has its own `vercel.json` with `cd ../..` build command. Vercel project Root Directory must be set to `apps/storybook` or `apps/docs` in the project settings. Two separate Vercel projects, one per app.
- **Turbo cache:** `turbo.json` declares outputs `dist/**`, `.next/**` (excluding `.next/cache/**`), `storybook-static/**`
- **ESLint:** flat config at root, every package with TS/JSX has a `lint` script that runs `eslint .`
- **Stylelint:** root config at `stylelint.config.mjs` with BEM-friendly selector pattern + Tailwind at-rule whitelist (`@theme`, `@plugin`, `@source`, `@variant`, `@utility`, `@custom-variant`)
- **Prettier:** runs via lint-staged on every commit (husky pre-commit hook)
- **Changesets:** `access: public`, `ignore: ['@aspect/storybook', '@aspect/docs']` (apps don't get published)

## What NOT to do

- ❌ Don't use **styled-components** or any runtime CSS-in-JS — we're CSS-first with `--mizu-*` custom properties
- ❌ Don't use **jest** or **jest-axe** — use vitest + vitest-axe
- ❌ Don't add classNames like `.mizu-button--loading` — use `data-loading` attributes
- ❌ Don't hard-code colors / sizes / spacings — reference `var(--mizu-*)` tokens
- ❌ Don't ship a monolithic `AppLayout` slot soup like Cloudscape — keep the shell decomposed
- ❌ Don't add Tailwind v3 patterns (config files, `theme.extend.colors`, `prefix:` option) — Tailwind v4 only
- ❌ Don't remove the `prepend-use-client.mjs` postbuild step — Next 14+ RSC consumers depend on it
- ❌ Don't commit `storybook-static/`, `.next/`, `dist/`, or any other build output — they're in `.gitignore`
- ❌ Don't write multi-line JSDoc blocks on every function — comments should explain non-obvious _why_, not _what_
- ❌ Don't introduce styled-component themes, Radix's own theme, or Tailwind UI patterns wholesale — mizu has its own architecture; borrow ideas, not copies

## Open backlog (as of last session)

- **Other 3 demos** (ecommerce, finance, customer-engagement) — shell + atomic components are ready, just need mock data + content stories + theme overrides (themes already exist at `packages/css/src/themes/`)
- **CommandMenu (Cmd+K)** — copy Geist's pattern, build on `cmdk` library
- **Form components beyond Input** — Select, Combobox, Checkbox, Radio, Switch, Textarea (use Radix primitives)
- **Patterns layer in Storybook** — composed examples like "multi-step wizard", "filter form", "resource list with bulk actions"
- **Token tier 3 (component tokens)** — `packages/tokens/src/component/` exists in the build glob but is empty
- **CommandMenu, Combobox, Select** — Radix primitives wrapped, BEM CSS, paired a11y stories

## Reference points

- Cloudscape: https://cloudscape.design (atomic component reference)
- Carbon: https://carbondesignsystem.com (compositional shell reference)
- Braid: https://seek-oss.github.io/braid-design-system (layout primitives reference)
- Geist: https://vercel.com/geist (10-step neutral scale reference)
- Linear: https://linear.app (LCH-based theming reference)
