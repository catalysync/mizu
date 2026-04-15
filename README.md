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

## Where mizu + craft stop (and what to do about it)

The craft knob model covers roughly **60–70% of what makes a design system feel like itself** — the substrate. Tokens, voice, API opinions, stylistic cluster choices, accessibility floors. Anything global, continuous-ish, and orthogonal fits cleanly.

The other 30–40% does not fit a knob shape, and pretending otherwise just breaks the abstraction. Be aware of these limits up front:

| Limitation                     | Why a knob can't express it                                                                                                                  | Where it's handled instead                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Structural component forks** | "Is Select a dropdown, a command palette, or a bottom sheet?" is a fork, not a dial.                                                         | Packs (component set choice) + patterns (recipes)   |
| **Interaction orchestration**  | Optimistic vs pessimistic saves, save feedback flavor, wizard shape (step-at-a-time vs long-form), error recovery strategy.                  | Interaction packs                                   |
| **Shell architecture**         | Sidebar-first vs command-first vs workspace-tabs vs header-nav vs canvas — each implies different primitives and information architecture.   | Shell packs                                         |
| **Context-varying values**     | Compact tables + comfortable forms in the same app, or calm admin + playful marketing. One global knob forces a compromise.                  | Surface-context overrides (second axis, not a knob) |
| **Motion choreography**        | "Drawer slides from right" vs "fades in" vs "scales from trigger" is a recipe, not a duration.                                               | Motion packs                                        |
| **Empty / loading philosophy** | Platform-wide defaults — illustration slots? retry buttons on errors? skeletons vs spinners? — are recipes the system either has or doesn't. | Patterns + pack defaults                            |
| **Domain components**          | Debit/credit ledger rows, shipment timelines, redline diffs. Not universal — pack-level.                                                     | Domain packs (see `@aspect/finance`)                |
| **Composition boundaries**     | "Many small primitives" vs "few slot-rich components" is a library-wide philosophy, not a per-component dial.                                | Core decision, documented in architecture           |

### The stack that resolves it

Four layers, each the right shape for the decisions it holds:

1. **Tokens** — raw values (`--mizu-*`). Numbers, enums, color refs.
2. **Knobs** — language decisions authored in [craft](https://github.com/catalysync/tweakmizu). Profile clusters: Foundation, Shape, Density, Type, Motion, Depth, Focus, Iconography, Voice, API-opinions.
3. **Packs** — discrete architectural bundles. You _pick_ one; you don't tune a slider. Shell packs, interaction packs, domain packs, motion choreography packs.
4. **Patterns** — composed recipes in Storybook and docs. How to build bulk-edit, long-form wizards, command-driven workflows.

**Knobs are continuous-ish. Packs are forks. Patterns are recipes.** When you hit a decision that doesn't feel like it fits a knob, it probably belongs one layer up.

### How to use craft for this

If you're evaluating mizu and running into "but what about _X_?", check which layer X lives in:

- **X is a token or stylistic value** (color, radius, font, motion duration) → author it in craft's knob panels, export, ship.
- **X is a structural fork** (shell shape, interaction style, domain shape) → pick a pack in craft (or wait for the one you need — see [mizu-planning/20](https://github.com/catalysync/mizu-planning/blob/main/20-knobs-limits-pack-layer.md) for the roadmap). Packs layer over your knob profile; they don't replace it.
- **X is a composition recipe** (how to build a specific pattern) → use mizu's Storybook Patterns tier as the reference, compose the primitives yourself. Patterns are docs, not config.

If X doesn't fit any of the four, that's a real gap — open an issue, because either the knob set is missing a cluster, a pack needs to exist, or the pattern library needs that recipe written down.

> Longer treatment of where knobs stop and why packs exist: [`mizu-planning/20-knobs-limits-pack-layer.md`](https://github.com/catalysync/mizu-planning/blob/main/20-knobs-limits-pack-layer.md).

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
