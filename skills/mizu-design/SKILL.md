---
name: mizu-design
description: Use when building, changing or reviewing UI that uses the mizu design system (@mizunagara/tokens, @mizunagara/css, @mizunagara/react). Covers which token tier to reference, the var() fallback rule, the cascade layer order, how identity and demo themes attach, which component already exists, and the ethos rules that keep mizu language-absent.
metadata:
  type: reference
---

# mizu design

mizu is a framework-agnostic design substrate: tokens, plain CSS, React bindings, layout primitives and shell composition in one monorepo. This skill is the factual reference for working inside that system. For the full component list with CSS file and React export names, see [components.md](components.md).

## 1. What mizu is, and what it is not

- mizu is a base layer on top of Radix. It does not have a design language. The default theme is a sample, not an opinion. See [docs/ethos.md](../../docs/ethos.md) for the cited rules.
- Accessibility, semantic HTML, composition and prop-API guidance apply everywhere. Visual style (colors, radii, motion curves, voice) is a recommendation from the default sample only. Override it freely.
- **No brand in the substrate.** Files in `packages/tokens/src/base|semantic|component`, `packages/css/src/components|layouts|shell` and `packages/react/src` must not carry brand names, product copy, a product voice, or brand-specific values. Brand values belong in an identity file (see section 5) or in the consuming app.
- **Language-absent.** Components take their text from props and children. Do not add built-in strings that assume a product voice; labels, empty-state copy and error wording are the consumer's to supply.

## 2. Token tiers

Tokens are DTCG JSON (`$value` / `$type`) built by Style Dictionary 5 into `packages/tokens/dist/css/variables.css`. Three source tiers, each referenceable by name:

| Tier                          | Source                     | Examples of emitted names                                                                                                                                              |
| ----------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base (raw palette and scales) | `src/base/*.json`          | `--mizu-color-*`, `--mizu-spacing-*`, `--mizu-radius-*`, `--mizu-shadow-*`, `--mizu-font-*`, `--mizu-text-*`, `--mizu-duration-*`, `--mizu-easing-*`, `--mizu-chart-*` |
| Semantic (meaning)            | `src/semantic/colors.json` | `--mizu-action-*`, `--mizu-feedback-*`, `--mizu-surface-*`, `--mizu-text-*`, `--mizu-border-*`, `--mizu-chart-*`                                                       |
| Component                     | `src/component/*.json`     | `--mizu-control-*`, `--mizu-touch-*`, `--mizu-focus-*`, `--mizu-overlay-*`, `--mizu-z-*`                                                                               |

Rules for picking a tier:

- Components and consumer CSS reference **semantic** or **component** tokens. Do not reference base palette names from a component; that couples it to a color ramp.
- The CSS output uses `outputReferences: true`, so a semantic variable stays as `var(--mizu-color-blue-600)` in the output. Overriding a base token therefore cascades into every semantic token that points at it.
- Dark mode is its own dictionary (`packages/tokens/themes/mizu-dark.json`) emitted to `dist/css/dark.css` under `[data-theme="dark"]`. It overrides base and semantic names; do not merge it into the light source.
- Density is a separate attribute, `data-mizu-density="compact" | "comfortable"`, handled in `packages/css/src/density.css`.

## 3. Fallback rule

- Reference tokens only through `var(--mizu-*)`. No hard-coded hex, rgb, or numeric colors, sizes or spacings in component CSS or React.
- The one allowed literal is a fallback inside `var()`, for example `var(--mizu-action-destructive-default, #dc2626)`.
- A token that exists only inside a theme block (one scoped by `data-mizu-theme`, `data-mizu-identity`, `data-mizu-density` or `data-theme`) must be referenced **with** a fallback. Without one, the property falls back to its initial value: a transparent background, black text, no border.
- This is enforced by `packages/css/test/tokens.test.ts`: every `var(--mizu-*)` without a fallback must name a token defined outside a theme.
- State variation uses `data-*` attributes (`data-loading`, `data-invalid`, `data-selected`), never className flags such as `--loading`.
- Hover and focus tints use `color-mix(in srgb, var(--mizu-text-primary) 6%, transparent)`, so they work under any theme.

## 4. Cascade layers

The build (`packages/tokens/build/config.mjs` and `packages/css/build.mjs`) declares this order:

```css
@layer mizu.tokens, mizu.base, mizu.components, mizu.shell, mizu.identity;
```

- `mizu.tokens`: the token `:root` block and `density.css`.
- `mizu.base`: `utilities.css`, `animation.css`, `reduced-motion.css`, `typography.css`.
- `mizu.components`: `components/*` and `layouts/*`.
- `mizu.shell`: `shell/*`.
- `mizu.identity`: `themes/*`.

Consequences:

- Unlayered consumer CSS beats every mizu layer. This is tested in `packages/css/test/layers.browser.test.ts`.
- A theme set on `<html>` beats the `:root` token defaults, because the theme sits in a later layer.
- Do not add `!important` to substrate CSS. `packages/css/test/no-important.test.ts` allows it only in `reduced-motion.css`.

## 5. Identity and demo themes

- **Identity themes** are CSS-only files in `packages/css/src/themes/` that set `[data-mizu-identity="<name>"]`. They do two things: token overrides (`--mizu-*` on the scoped element) and structural overrides (`[data-mizu-identity="<name>"] .mizu-button { ... }`). Apply by setting the attribute on a root element. No React change is needed.
- **Demo themes** (`cloud`, `ecommerce`, `finance`, `customer-engagement`) use `[data-mizu-theme="<name>"]` and wrap one demo's subtree.
- Structural overrides rely on specificity, so they can be overridden by accident. Keep them scoped under the attribute and prefer token overrides where a token exists.
- A new brand is a new identity file, not a change to a component, a shell file or the base tokens. Adding brand values to `src/base`, `src/semantic`, `src/component`, `components/`, `layouts/`, `shell/` or `packages/react/src` breaks the ethos rule in section 1.
- Every theme attribute is listed in `THEME_SCOPED` in `packages/css/test/tokens.test.ts`. Add a new theme attribute there too, or the fallback check will not treat its tokens as theme-only.

## 6. Components and layout

- Check the component index in [components.md](components.md) before creating anything. Reuse an existing React component or CSS block first.
- React components live in `packages/react/src/components/<Name>/`, use `forwardRef`, `cn()` and CVA variants, and wrap a Radix primitive for interactive overlays. Export through `packages/react/src/index.ts`; a component is not shipped until it is in the barrel.
- Layout uses the Braid-style primitives: `Stack`, `Inline`, `Grid`, `Split`, `Center`, `Cluster`, plus `Resizable*`.
- App chrome uses the compositional shell: `AppLayout`, `AppHeader`, `AppSidebar`, `AppContent` (with `AppContentHeader`), `AppBreadcrumbs`. Do not add a monolithic layout with slot props. The host app owns the chrome.
- Component status tags in Storybook are `stable`, `experimental` or `deprecated`. New components start `experimental`.

## 7. Checklist before you ship UI

1. Every color, size and spacing comes from a `var(--mizu-*)` token, with a fallback only if the token is theme-only.
2. State is expressed with `data-*` attributes.
3. No brand names, copy or brand values were added to the substrate.
4. The component you used is in [components.md](components.md), or you have added it to the barrel with a test.
5. Interactive components have a vitest-axe assertion, and components with an a11y pitfall have a paired `Inaccessible` / `Accessible` Storybook story.
6. Tests for the substrate CSS pass: `pnpm --filter @mizunagara/css test`, and `pnpm --filter @mizunagara/react test` for React changes.
