# @mizunagara/tailwind-preset

Tailwind v4 theme bridge for the mizu design system. Maps Tailwind utility classes to `var(--mizu-*)` tokens.

## Usage (Tailwind v4)

```css
@import 'tailwindcss';
@import '@mizunagara/tokens/css';
@import '@mizunagara/tailwind-preset';
```

## Usage (Tailwind v3 legacy)

```js
const preset = require('@mizunagara/tailwind-preset/legacy');
module.exports = { presets: [preset] };
```
