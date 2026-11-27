# Identity, mode and density contract

This describes what the code on this branch does with the attributes that choose an identity, a
light or dark mode, and a density. The decision itself is in [RFC-004](../rfcs/004-identity-theming.md).
Every rule below names the file that enforces it.

## Attributes

| Attribute                                    | Set by                                    | Effect                                                                                          | Source                                                                                                                                                       |
| -------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data-mizu-identity="<name>"`                | consumer                                  | Token overrides and structural rules for one of 21 identities                                   | `packages/css/src/themes/*.css` (e.g. `sage.css:7`)                                                                                                          |
| `data-theme="dark"`                          | consumer                                  | Dark token values and `color-scheme: dark`                                                      | `packages/tokens/build/config.mjs:59`, `:71-85`                                                                                                              |
| `data-mizu-density="compact"\|"comfortable"` | consumer                                  | Spacing scale only; font sizes never change                                                     | `packages/css/src/density.css:38`, `:54`                                                                                                                     |
| `data-mizu-theme="<name>"`                   | consumer                                  | Product or demo theme (`cloud`, `finance`, `ecommerce`, `customer-engagement`); not an identity | `packages/css/src/themes/cloud.css:7`                                                                                                                        |
| `data-density="compact"\|"comfortable"`      | `density` prop on `Table` and `DataTable` | Padding on that table only; not the root density scale                                          | `packages/react/src/components/Table/Table.tsx:59`, `packages/react/src/components/DataTable/DataTable.tsx:153`, `packages/css/src/components/table.css:105` |

Identity, mode and density are attributes, not React props. No component takes an identity prop;
React code only forwards the attributes (see Portals below).

## Scope and cascade

- Token defaults live on `:root` in `@layer mizu.tokens`. Identity and theme files live in
  `@layer mizu.identity`, which comes last (`packages/css/build.mjs:11`, `:23`). An attribute on
  any element, including `<html>`, therefore overrides the defaults. Covered by
  `packages/css/test/layers.browser.test.ts` (theme set on `<html>`).
- Unlayered consumer CSS beats every mizu layer (`layers.browser.test.ts`).
- Token overrides inherit. An identity on an ancestor applies to its whole subtree, unless a
  descendant sets the same token itself (see the precedence rules below).

## Mode and `color-scheme`

- Light is the default. `packages/tokens/dist/css/variables.css` sets `color-scheme: light` on
  `:root`, emitted by `packages/tokens/build/config.mjs:71-77`.
- Dark is `[data-theme="dark"]` in `packages/tokens/dist/css/dark.css`, with
  `color-scheme: dark` added by `config.mjs:83-85`. Consumers load it as `@mizunagara/css/themes/dark`
  (`packages/css/build.mjs:83`, `apps/docs/app/layout.tsx`).
- `color-scheme` follows the element that carries `data-theme`. A dark panel inside a light page
  computes dark and the page stays light (`packages/css/test/color-scheme.browser.test.ts`).
- Do not set `color-scheme` by hand. Set `data-theme`, and load the dark sheet, or the attribute does
  nothing: the dark values are only in that sheet.

## Feedback colours in dark mode

- Light values: `--mizu-feedback-{success,warning,danger,info}-{default,subtle}` in
  `packages/tokens/src/semantic/colors.json`.
- Dark values (`packages/tokens/dist/css/dark.css:16-23`): `default` uses the 300 step, which is text
  and icon colour on the tint; `subtle` uses the 900 step. Stated in the `$description` of
  `packages/tokens/themes/mizu-dark.json`, so a badge reads light-on-dark rather than inverting the
  light palette.
- Enforced by `packages/css/test/feedback-dark.test.ts`: text on the subtle tint meets 4.5:1, the
  default meets 3:1 against `--mizu-surface-default`, and the light values are unchanged.

## Density

- `data-mizu-density` scales the spacing tokens only. Compact is 0.875x and comfortable is 1.125x the
  default (`packages/css/src/density.css:38-68`). Font-size tokens are not redeclared in either scope.
  Enforced by `packages/css/test/density.test.ts`.
- `Table` and `DataTable` write `data-density` on the table element and only change its cell padding
  (`packages/css/src/components/table.css:105-111`, `data-table.css:136-143`). That attribute does
  not change the root scale and portals do not copy it.

## Identity rules

- An identity is CSS only. Token overrides go on `[data-mizu-identity="<name>"]` (`sage.css:7`).
  Structural rules are written under the same attribute, for existing mizu classes only
  (`sage.css:39`, `.mizu-button`). RFC-004 accepts structural overrides, so this is not a
  tokens-only identity.
- Components read tokens only: `var(--mizu-*)`, with no hard-coded colour (`CONTRIBUTING.md:73`,
  `packages/css/AGENTS.md:23`). Identity files do not all follow this. `sage.css:46` hard-codes
  `#ffbc19` in a focus outline. No test enforces the rule for identity files. The closest enforced
  rules are `packages/css/test/tokens.test.ts` (every `var(--mizu-*)` names a defined token) and
  `packages/css/test/no-important.test.ts`.

## Portals

- Radix mounts overlays under `<body>`, outside the identity wrapper. `Portal.tsx:6` names the three
  attributes that decide tokens and density: `data-mizu-identity`, `data-mizu-density` and
  `data-theme`.
- `copyPortalIdentity` (`packages/react/src/primitives/Portal.tsx`) copies each one from the nearest
  ancestor that sets it. An attribute already set on the overlay is kept. Nothing is added when there
  is no ancestor.
- Copy happens once, when the overlay mounts. There is no observer, so a later change to the trigger's
  attributes does not reach an open overlay.
- Used by the 11 overlays listed in `.changeset/portal-identity.md`: Modal, Sheet, Drawer, AlertDialog,
  Popover, Tooltip, HoverCard, Select, DropdownMenu, ContextMenu and Combobox. Tests:
  `packages/react/src/primitives/Portal.test.tsx`.

## Precedence: identity and dark together

Identity and dark sets both live in `@layer mizu.identity` at equal specificity. When both set the
same token on one element, the sheet loaded later wins, and the result is not the one you want.
Measured in a real browser (Chromium, built `variables.css`, `dark.css` and `sage.css`), reading
`--mizu-text-primary` and `--mizu-surface-default` from the probe element:

| Markup                                                       | Sheet order | `--mizu-text-primary` | `--mizu-surface-default` |
| ------------------------------------------------------------ | ----------- | --------------------- | ------------------------ |
| `data-theme="dark" data-mizu-identity="sage"` on one element | dark, sage  | `#000000e6` (wrong)   | `#020617`                |
| same                                                         | sage, dark  | `#f1f5f9`             | `#020617`                |
| `sage` on an ancestor of `data-theme="dark"`                 | dark, sage  | `#f1f5f9`             | `#020617`                |
| `sage` on a descendant of `data-theme="dark"`                | dark, sage  | `#000000e6` (wrong)   | `#020617`                |

The wrong rows give near-black text on the dark surface. Sage sets its own light text colour, and
either the sheet order or the nesting lets that win.

Rules that work today:

1. Put `data-mizu-identity` on an ancestor of any `data-theme="dark"` element, never on the dark
   element itself or below it.
2. Use only one of the two on each element.

Known consequences of the open problem:

- Storybook loads `dark` before `sage` (`apps/storybook/.storybook/preview.ts:7`, `:24`) and its
  decorator sets both attributes on `<html>` (`apps/storybook/.storybook/decorators/withMizuTheme.tsx`).
  With theme dark and an identity that sets `--mizu-text-primary` (sage does), Storybook shows the
  first wrong row above.
- A dark overlay opened inside a sage-on-ancestor tree gets both attributes copied onto the same
  element by the portal, so it hits the first wrong row.

Open. This doc records the behaviour. The fix is a CSS change (for example, keep `text-primary` and
`surface-default` out of identity files, or move identity out of the layer that dark uses). It is not
made here.
