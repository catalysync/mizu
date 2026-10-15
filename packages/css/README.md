# @mizunagara/css

Framework-agnostic component CSS for the mizu design system. Uses `var(--mizu-*)` custom properties from `@mizunagara/tokens`.

## Usage

```css
@import '@mizunagara/tokens/css';
@import '@mizunagara/css';
```

Or cherry-pick individual components:

```css
@import '@mizunagara/css/components/button';
@import '@mizunagara/css/layouts/stack';
@import '@mizunagara/css/shell/app-layout';
```

## Build

```bash
pnpm build   # bundles via lightningcss
pnpm lint    # stylelint
```
