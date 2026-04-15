<p align="left">
  <img src=".github/mizu-logo.svg" alt="mizu" height="40" />
</p>

# mizu

fluid design for saas

## What mizu is

**mizu is a base layer on top of Radix.** Radix handles the hard primitives (focus trap, overlay positioning, ARIA wiring, keyboard semantics); mizu adds the visual substrate — tokens, CSS, React bindings, layout primitives, shell composition, and framework bridges — so a product team can assemble an application without rebuilding the foundations.

**mizu does not have a design language.** It ships with a neutral default theme as a starting point, but that theme is a _sample_, not the system's opinion. There is no "mizu believes X about UI" manifesto. The same components are meant to serve very different products — enterprise accounting, Palantir-style IDEs, commerce dashboards — and each of those has its own principles, vocabulary, grammar and voice. mizu stays deliberately language-absent so it can be the canvas for all of them.

This matters for how you read the docs: guidance about accessibility, semantic HTML, component composition, and prop API usage is authoritative and applies everywhere. Guidance about _visual style_ — colors, radii, motion curves, voice — is only ever a recommendation from the default sample. Override freely.

> The layer that **does** have a design language is [tweakmizu](https://github.com/catalysync/tweakmizu) — the studio that lets each product author its own language on top of mizu and export a themed, component-configured starter. mizu is the canvas; tweakmizu is where the painting happens.

## Why not just use a public corporate design system?

There are excellent open-source design systems published by large engineering orgs — cloud consoles, enterprise platforms, big-tech productivity suites, ecommerce platforms, developer-tool vendors. They ship thousands of hours of accessibility hardening, i18n, RTL, keyboard behavior, and edge-case coverage. For a lot of internal tools, one of them is the right answer.

But here's the gap they don't fill, especially for SaaS:

**What you can actually customize:** tokens. Colors, some spacing, fonts. The surface layer.

**What stays baked in:** the _design language_ underneath. Shape DNA (corner radii, border weight, chrome style), motion personality (easing, duration, reduced-motion stance), density rhythm, depth recipe (shadows vs. borders vs. surfaces), type scale ratio, focus treatment, iconography style, voice. Those are hundreds of coupled decisions made by the parent org's design team — and they're what make their system _feel like them_. Override the tokens and you still look like a reskinned version of a cloud console, an enterprise platform, or a productivity suite. For SaaS teams trying to build a recognizable product identity, that's a real anti-feature.

**What mizu + tweakmizu do differently:**

- **mizu** is deliberately language-absent. No baked-in shape/motion/depth opinions. The components are the canvas.
- **tweakmizu (craft)** treats the design language as a first-class, serializable artifact — ten clusters (Foundation, Shape, Density, Type, Motion, Depth, Focus, Iconography, Voice, API-opinions) you author, not inherit. Same components can render sharp-dense-dark or soft-airy-light without touching any code.
- The output is your language, compiled to CSS custom properties and a component-configured starter. You own the DNA.

**Be honest about the trade-offs:**

- Those corporate systems have 5–10 years of production hardening, and entire teams maintaining them. mizu doesn't — yet.
- Their opinions are also load-bearing: someone already made ten thousand decisions so you don't have to. mizu puts those decisions back on you. That's why craft ships archetypes (curated starting points) and an AI prompt flow (describe what you're building → get a drafted profile) — pressure releases for the blank-canvas problem.
- More knobs means more ways to make something ugly. Constraints exist (ranges, enum choices, accessibility floors baked into the schema) but the system trusts the author.

So the positioning isn't "mizu is better." It's: **mizu is for teams who want a design language, not a rebranded vendor house style.** If your product lives inside someone else's platform, use their system. If you're building something that has to look like _you_, start language-absent and author up.

## Quick start

```bash
pnpm add @aspect/react @aspect/css @aspect/tokens
```

```css
@import '@aspect/tokens/css';
@import '@aspect/css';
```

```tsx
import { Button } from '@aspect/react';
```

No React? Use the CSS classes directly:

```html
<button class="mizu-button mizu-button--primary mizu-button--md">Go</button>
```

## Packages

| Package                   | What it does                                                 |
| ------------------------- | ------------------------------------------------------------ |
| `@aspect/tokens`          | Design tokens → CSS variables, JSON, ES module, React Native |
| `@aspect/css`             | Framework-agnostic component CSS                             |
| `@aspect/react`           | React components (Radix + CVA + tsup)                        |
| `@aspect/finance`         | Finance industry components and utilities                    |
| `@aspect/tailwind-preset` | Tailwind v4 theme bridge                                     |
| `@aspect/tsconfig`        | Shared TypeScript configs                                    |

## Apps

| App       | URL                                                            |
| --------- | -------------------------------------------------------------- |
| Storybook | [mizu-storybook.vercel.app](https://mizu-storybook.vercel.app) |
| Docs      | [mizu-docs.vercel.app](https://mizu-docs.vercel.app)           |

## Development

```bash
pnpm install
pnpm turbo build        # build everything
pnpm turbo dev          # dev servers
pnpm turbo test         # vitest
pnpm turbo lint         # eslint + stylelint
pnpm turbo typecheck    # tsc --noEmit
```

## Stack

pnpm workspaces, Turborepo, Style Dictionary 5 (DTCG), lightningcss, React 19, Radix UI, CVA, tsup, vitest + vitest-axe, ESLint flat config + jsx-a11y, Storybook 10, Next.js 16, Changesets.

## License

MIT
