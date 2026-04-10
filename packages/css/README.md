# @aspect/css

Framework-agnostic component CSS for the mizu design system. Uses `var(--mizu-*)` custom properties from `@aspect/tokens`.

## Usage

```css
@import '@aspect/tokens/css';
@import '@aspect/css';
```

Or cherry-pick individual components:

```css
@import '@aspect/css/components/button';
@import '@aspect/css/layouts/stack';
@import '@aspect/css/shell/app-layout';
```

## Build

```bash
pnpm build   # bundles via lightningcss
pnpm lint    # stylelint
```
