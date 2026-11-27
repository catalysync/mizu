# @mizunagara/css — contributor guidance

Scope: `packages/css/`. Repo-wide rules are in [../../AGENTS.md](../../AGENTS.md).

## Build

- Plain CSS with `--mizu-*` custom properties, bundled by the **lightningcss** JS API (`build.mjs:1`).

## Layout

```
src/components/        → atomic components (button, input, badge, …)   e.g. src/components/button.css
src/layouts/           → layout primitives (stack, inline, grid, …)
src/shell/             → app shell (header, sidebar, content, layout, breadcrumbs)
src/themes/            → per-demo theme overrides (cloud, ecommerce, finance, customer-engagement)
src/typography.css     → standalone opt-in type sheet
```

## CSS rules

- Live in `packages/css/src/{components|layouts|shell|themes}/`
- Use BEM-style classes prefixed `mizu-` (`.mizu-button--primary`, `.mizu-app-sidebar__item`) — block definition at `src/components/button.css:11`
- Reference tokens only via `var(--mizu-*)` — no hex codes inline (the one exception is fallback values like `var(--mizu-action-destructive-default, #dc2626)`)
- State variations via `data-*` attributes, NOT className flags (`.mizu-button[data-loading="true"]`, not `.mizu-button--loading`) — see `src/components/button.css:67`
- `color-mix(in srgb, var(--mizu-text-primary) 6%, transparent)` is the canonical way to do hover/focus tints — works regardless of theme overrides (example: `src/themes/neon.css:50`)

## Loading states (CSS side)

- Spinner is absolutely positioned over a hidden label span (`.mizu-button__label` with `visibility: hidden` when loading) — `src/components/button.css:67-73`
- The React side of the loading contract is in [../react/AGENTS.md](../react/AGENTS.md)

## Per-demo theming

- Each demo lives in `apps/storybook/stories/demos/{name}/`
- Demos wrap their content in `<AppLayout data-mizu-theme="{name}">`
- Each theme is a CSS file at `packages/css/src/themes/{name}.css` containing a `[data-mizu-theme="{name}"] { --mizu-* override; }` block — example: `src/themes/cloud.css:7`
- All theme files are imported in `apps/storybook/.storybook/preview.ts` so they're always available; the data-attribute selector decides which one applies — `apps/storybook/.storybook/preview.ts:2`
- Same shell components, different theme overrides, different mock data — that's the substrate model

## Quality gates (CSS)

- `@mizunagara/css`: stylelint with BEM-friendly `selector-class-pattern` (`pnpm --filter @mizunagara/css lint`)
- Stylelint: root config at `stylelint.config.mjs` with BEM-friendly selector pattern (`stylelint.config.mjs:14`) and Tailwind at-rule whitelist (`@theme`, `@plugin`, `@source`, `@variant`, `@utility`, `@custom-variant`; `stylelint.config.mjs:19-22`)

## Don't

- ❌ Don't use **styled-components** or any runtime CSS-in-JS — we're CSS-first with `--mizu-*` custom properties
- ❌ Don't add classNames like `.mizu-button--loading` — use `data-loading` attributes (`src/components/button.css:67`)
- ❌ Don't hard-code colors / sizes / spacings — reference `var(--mizu-*)` tokens
