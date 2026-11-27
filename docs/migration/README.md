# Migrating between mizu 0.x releases

mizu is pre-1.0, so a minor release can contain breaking changes. Each section below names a change, says who it affects, and shows the code before and after. Work through the sections that match the packages you use.

Packages covered: `@mizunagara/react`, `@mizunagara/css`, `@mizunagara/tokens`, `@mizunagara/commerce`.

## Breaking changes at a glance

| Change                                                                   | Package(s)                 | Who is affected                                                      |
| ------------------------------------------------------------------------ | -------------------------- | -------------------------------------------------------------------- |
| [Input no longer takes `label` or `helpText`](#input-label-and-helptext) | `react`                    | Anyone passing `label`, `helpText`, or a string `error` to `Input`   |
| [Pagination fires one callback per click](#pagination-callbacks)         | `react`                    | Code that relied on `onPageChange` firing with `onPrevious`/`onNext` |
| [Pagination moved to `@mizunagara/react`](#pagination-import)            | `react`, `commerce`        | Imports from `@mizunagara/commerce`                                  |
| [Cascade layers and unlayered precedence](#cascade-layers)               | `css`                      | Custom CSS that overrides mizu, or sits in its own `@layer`          |
| [Button tier-3 names are not on `:root`](#button-tier-3-names)           | `css`                      | Code that reads `--mizu-button-*` from `:root`                       |
| [z-index tokens come from `@mizunagara/tokens`](#z-index-tokens)         | `tokens`, `css`            | Pages that load only the component CSS                               |
| [Stack `gap` takes a scale step](#stack-gap-scale)                       | `react`                    | Anyone passing a CSS length to `gap`                                 |
| [Table `ref`, `className` and `style` go to the wrapper](#table-wrapper) | `react`                    | `useRef<HTMLTableElement>` and modifier classes on `Table`           |
| [`TableHeader` and `TableHead` are swapped](#table-header-names)         | `react`                    | Every table that uses `TableHead` or `TableHeader`                   |
| [Alert and Banner roles depend on tone](#alert-and-banner-roles)         | `react`, `css`, `commerce` | Tests and screen-reader behaviour for `info`/`warning` alerts        |
| [Density scales spacing only](#density-spacing-only)                     | `css`                      | Layouts that relied on density changing font size                    |
| [Progress uses `data-state`](#progress-state)                            | `react`, `css`             | CSS selectors on `.mizu-progress--indeterminate`                     |
| [AppContent drops `cards` and `wizard`](#appcontent-types)               | `react`                    | `contentType="cards"` or `"wizard"`                                  |
| [PropertyFilter input has role `combobox`](#property-filter-role)        | `react`                    | Tests that query `getByRole('textbox')`                              |
| [Tag dismiss class renamed](#tag-dismiss-class)                          | `css`                      | Direct use of `.mizu-tag__remove`                                    |

Not breaking on their own, but they change behaviour or DOM you may test against: see [Also check](#also-check).

---

## Input: label and helpText

`Input` no longer accepts `label` or `helpText`, and `error` is now a boolean. The message goes on `Field`, which also links it to the input with `aria-describedby`.

Before:

```tsx
<Input label="Email" helpText="We never share it" error="Enter a valid email" />
```

After:

```tsx
<Field label="Email" description="We never share it" errorMessage="Enter a valid email">
  <Input error />
</Field>
```

Mapping:

| Before                       | After                                                    |
| ---------------------------- | -------------------------------------------------------- |
| `<Input label="Email" />`    | `<Field label="Email"><Input /></Field>`                 |
| `<Input helpText="Help" />`  | `<Field description="Help"><Input /></Field>`            |
| `<Input error="Required" />` | `<Field errorMessage="Required"><Input error /></Field>` |

`Input warning` still shows without a `Field` wrapper. Search for `label=` and `helpText=` on `<Input>` tags to find the call sites.

## Pagination callbacks

Clicking Previous or Next used to call both `onPrevious`/`onNext` and `onPageChange`. Now each click fires exactly one callback: `onPrevious` or `onNext` when you pass it, and `onPageChange` only when they are missing.

Before:

```tsx
<Pagination
  onPrevious={() => fetchPage(page - 1)}
  onPageChange={(p) => setPage(p)} // used to run on Previous as well
/>
```

After, if you need the page state to update on Previous too:

```tsx
<Pagination
  onPrevious={() => {
    fetchPage(page - 1);
    setPage(page - 1);
  }}
  onPageChange={(p) => setPage(p)}
/>
```

Or drop `onPrevious` and let `onPageChange` handle every click:

```tsx
<Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
```

## Pagination import

`Pagination` moved from `@mizunagara/commerce` to `@mizunagara/react`. The react version also adds numbered page buttons (`page`, `totalPages`, `onPageChange`, `siblingCount`) and computes `hasPrevious`/`hasNext` from them.

Before:

```tsx
import { Pagination } from '@mizunagara/commerce';
```

After:

```tsx
import { Pagination } from '@mizunagara/react';
```

If your commerce usage passed props the react `Pagination` does not accept, TypeScript will report them. Check the `Pagination` props table in the docs before you move.

## Cascade layers

The stylesheets now sit in cascade layers: `mizu.tokens`, `mizu.base`, `mizu.components`, `mizu.shell`, `mizu.identity`, declared in that order. Component rules no longer use `!important`. Any **unlayered** rule in your app wins over any mizu rule, whatever its specificity.

Before, a higher-specificity or `!important` rule was needed to override mizu. After, a plain rule is enough, and the rule you used to write may now win where it used to lose.

Before:

```css
/* Needed !important or a higher specificity to win. */
.mizu-button--primary {
  background: red !important;
}
```

After:

```css
/* Unlayered: wins over every mizu layer. */
.mizu-button--primary {
  background: red;
}
```

If you put your overrides in your own layer, declare it **after** mizu's layers. Layers declared earlier lose to later ones:

```css
@import '@mizunagara/tokens/css';
@import '@mizunagara/css';

/* Keeps mizu's order, then your layer on top. */
@layer mizu.tokens, mizu.base, mizu.components, mizu.shell, mizu.identity, app;

@layer app {
  .mizu-button--primary {
    background: red;
  }
}
```

Also check:

- Dialogs, sheets, drawers, popovers and menus use an opaque background if the surface token is missing.
- Rules you wrote that depended on mizu losing (for example, a reset that used to be overridden) may now apply.

## Button tier-3 names

Button colours read `--mizu-button-{variant}-*` (for example `--mizu-button-primary-bg`), and fall back to the semantic token. mizu no longer declares those names on `:root`. Setting them on any ancestor still themes the buttons inside it, and setting them on `:root` still works. What stops working is reading them from `:root` when nothing has set them.

Before, this returned the default value from mizu:

```js
getComputedStyle(document.documentElement).getPropertyValue('--mizu-button-primary-bg');
```

After, it returns an empty string unless you set the value. Set it on the scope you want to theme:

```css
.checkout {
  --mizu-button-primary-bg: #0a58ca;
}
```

## z-index tokens

The `--mizu-z-*` scale moved from a hand-written file in `@mizunagara/css` to `@mizunagara/tokens`. Names and values are the same, but you must load the tokens stylesheet. Loading only the component CSS no longer defines them.

Before:

```css
@import '@mizunagara/css';
```

After:

```css
@import '@mizunagara/tokens/css';
@import '@mizunagara/css';
```

If you hard-coded an older overlay order (for example `--mizu-z-dropdown: 100`), remove that override. The current order is overlay 1000, drawer 1100, modal 1200, dropdown 1300, popover 1400, hover-card 1450, tooltip 1500, toast 1600. Dropdowns and selects opened inside a modal now sit above it.

## Stack gap scale

`Stack`'s `gap` only accepts a step from the spacing scale: `'none'`, `'1'` to `'6'`, `'8'`, `'10'`, `'12'`, `'16'`, `'20'`, `'24'`. A CSS string no longer compiles. Rendered values for the scale steps are unchanged, so `'1'` is `0.25rem` and `'4'` is `1rem`.

Before:

```tsx
<Stack gap="1rem">…</Stack>
```

After:

```tsx
<Stack gap="4">…</Stack>
```

Map any other length to the nearest step. The values live in `packages/tokens/src/base/spacing.json`.

## Table wrapper

`Table` applies `className`, `style` and `ref` to its scroll wrapper `div`, not the `<table>`. The ref is now an `HTMLDivElement`. Table-level attributes such as `id` and `aria-label` still go to the table. The `mizu-table--*` modifier classes passed through `className` now land on the wrapper and stop working, so use the new props.

Before:

```tsx
const ref = useRef<HTMLTableElement>(null);

<Table ref={ref} className="mizu-table--striped mizu-table--bordered" id="orders">
  …
</Table>;
```

After:

```tsx
const ref = useRef<HTMLDivElement>(null);

<Table ref={ref} striped bordered id="orders">
  …
</Table>;
```

Use `stickyFirstColumn` for the sticky first column. Use `caption` for the table's `<caption>`. `TableHead` cells now default to `scope="col"`; pass `scope="row"` for row headers.

## Table header names

`TableHeader` and `TableHead` were the wrong way round. `TableHeader` is now the `<thead>` section, and `TableHead` is the `<th>` cell. Swap the names wherever you use them. React's DOM-nesting warnings in development point at any usage you missed.

Before:

```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Name</TableHeader>
    </TableRow>
  </TableHead>
  …
</Table>
```

After:

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  …
</Table>
```

## Alert and Banner roles

`Alert` uses `role="alert"` only for the `danger` tone. The other tones use `role="status"`, so polite messages stop interrupting screen readers. `Banner` works the same way: `critical` uses `role="alert"`, other tones use `role="status"`. Pass `role` to override either one.

Before, an `info` or `warning` alert was announced immediately. To keep that behaviour, pass the role:

```tsx
<Alert tone="warning" role="alert">
  Session expires soon
</Alert>
```

`Alert` also gained a default icon per tone (pass `icon={null}` to hide it) and a `dismissLabel` prop.

`Banner` moved to `@mizunagara/react` (it is also re-exported from `@mizunagara/commerce`). If you loaded only `@mizunagara/commerce/css` for banners, also load `@mizunagara/css`, because the banner styles moved there.

## Density spacing only

`data-mizu-density="compact"` and `"comfortable"` now change padding and gaps only. Font sizes stay the same. If you relied on density to change text size, set font sizes explicitly:

```css
[data-mizu-density='compact'] .report-title {
  font-size: var(--mizu-font-size-lg);
}
```

## Progress state

`Progress` clamps `value` to the `0` to `max` range, so out-of-range values no longer render as indeterminate. The indeterminate state is now an attribute on `.mizu-progress`, not a class.

Before:

```css
.mizu-progress--indeterminate .mizu-progress__fill {
  /* … */
}
```

After:

```css
.mizu-progress[data-state='indeterminate'] .mizu-progress__fill {
  /* … */
}
```

An explicit `label` now takes precedence over `aria-label`. `valueText` sets a custom screen-reader value.

## AppContent types

`AppContentType` no longer has `cards` or `wizard`, because neither had styles. Use `default` or another supported type.

Before:

```tsx
<AppContent contentType="cards">…</AppContent>
```

After:

```tsx
<AppContent contentType="default">…</AppContent>
```

`AppContent` also takes an `as` prop (`main`, `div`, `section` or `article`), so an app with its own `main` landmark can avoid a nested one.

## Property filter role

The `PropertyFilter` input now has the `combobox` role instead of `textbox`, because it offers keyboard suggestions. Update tests that query it by role.

Before:

```tsx
screen.getByRole('textbox');
```

After:

```tsx
screen.getByRole('combobox');
```

## Tag dismiss class

`.mizu-tag__remove` was replaced by `.mizu-tag__dismiss`, which is the class the React binding has always rendered. Rename it in any direct CSS that targets the old class. The changeset for this release calls it non-breaking, but it breaks any stylesheet that targets the old name.

Before:

```css
.mizu-tag__remove {
  /* … */
}
```

After:

```css
.mizu-tag__dismiss {
  /* … */
}
```

## Breadcrumb (deprecated)

`AppBreadcrumbs` is the breadcrumb to use. It renders an ordered list and takes `maxVisible`, which collapses the middle crumbs into an ellipsis on long paths. The span-based `Breadcrumb`, `BreadcrumbLink` and `BreadcrumbCurrent` still work, and log a development warning. They are not removed yet.

Before:

```tsx
<Breadcrumb>
  <BreadcrumbLink href="/">Home</BreadcrumbLink>
  <BreadcrumbCurrent>Orders</BreadcrumbCurrent>
</Breadcrumb>
```

After:

```tsx
<AppBreadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Orders' }]} maxVisible={4} />
```

## Also check

These changes are not marked breaking, but they change DOM, CSS or behaviour that tests and styles may depend on.

- **Combobox** is rebuilt on cmdk. The trigger button and `.mizu-combobox__trigger`, `.mizu-combobox__placeholder`, `.mizu-combobox__search` were removed. On options, `data-selected` now marks the highlighted option, and `aria-checked` marks the chosen one.
- **Loading buttons** set `aria-disabled` instead of `disabled`, so they keep focus while busy. Selectors that matched `:disabled` to detect loading should match `[data-loading="true"]` or `[aria-disabled="true"]`.
- **DataTable** select-all keeps selections on rows hidden by a filter. Previously it replaced them.
- **TableRow** sets `data-clickable="true"` when it has `onClick`, and gets `cursor: pointer` from CSS. You no longer need `className="cursor-pointer"` on clickable rows.
- **Overlay scrim** uses `--mizu-overlay-scrim` and `--mizu-overlay-scrim-blur` for dialogs, sheets, drawers and the command menu. The default is black at 50% with no blur.
- **Chart categorical colours** no longer reuse the status colours, so re-theming a status colour no longer repaints charts.
- **Avatar** renders a placeholder icon instead of throwing when it has no `src`, `initials` or children. Pass `alt=""` for decorative images.

## Checking your migration

- Run `tsc` (or your type checker). The `Input`, `Stack`, `Table` and `Pagination` changes fail at compile time.
- Open the browser console in development. React's DOM-nesting warnings flag the swapped table headers, and the breadcrumb deprecation warning lists the old components.
- Check any test that queries `getByRole('textbox')` on a property filter, and any test that expects `Alert` to have `role="alert"` on a non-danger tone.
