# @aspect/tailwind-preset

Tailwind v4 theme bridge for the mizu design system. Maps Tailwind utility classes to `var(--mizu-*)` tokens.

## Usage (Tailwind v4)

```css
@import 'tailwindcss';
@import '@aspect/tokens/css';
@import '@aspect/tailwind-preset';
```

## Usage (Tailwind v3 legacy)

```js
const preset = require('@aspect/tailwind-preset/legacy');
module.exports = { presets: [preset] };
```
