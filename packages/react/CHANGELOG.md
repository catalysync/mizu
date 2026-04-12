# @aspect/react

## 1.0.0

### Minor Changes

- 79e6c84: add DataTable component with sortable columns, row selection (checkbox + select-all), expandable rows, zebra striping, density modes, loading skeletons, empty state, sticky header, and column alignment. Typed column definitions with generic `<T>` for full type safety. The #1 gap vs sage-carbon's FlatTable.
- ac50982: add DatePicker, DateRangePicker, and Calendar components. Zero date-library dependencies — uses native `Date` + `Intl.DateTimeFormat` with an ISO string contract for value serialization. Popover-based trigger via Radix Popover, min/max bounds, locale/weekStartsOn config, and Field context integration.
- b0601e2: add DefinitionList component with horizontal/vertical orientation, 1–3 column layout, and semantic `dl/dt/dd` structure
- e3ade86: add Field component — compositional wrapper for form controls with label, description, error message, required/optional hints, and automatic `aria-describedby` / `aria-invalid` wiring via context. Use with `useFieldContext()` to read the control id, description id, error id, and validation state from any nested control.
- 3cfd652: add Fieldset component with legend, description, and disabled state for grouping related form controls
- f836e62: add FileInput component with drag-and-drop dropzone, multi-file support, maxSize/maxFiles validation, removable file list, and Field context integration
- fbe5e56: add Form component — semantic `<form>` wrapper with title/description header, stack or grid layout, optional error summary (role="alert"), actions footer with start/end/between alignment, and global `disabled` state that propagates to all nested controls via a hidden fieldset wrapper.
- 1508eaf: add Heading component with 6 semantic levels, size override, and `as` prop for semantic/visual decoupling
- 11a184c: add Label component with accessible required marker (visible asterisk + sr-only text)
- 6c5f01d: add Link component with inline/subtle/standalone variants and secure `external` target handling
- 84c64c8: add NumberInput component with min/max/step/precision, keyboard arrow-key adjustment, prefix/suffix adornments, optional steppers, and `spinbutton` role. Auto-consumes Field context for id/label/required/disabled/aria-invalid.
- 6edfd9a: add PasswordInput component with show/hide toggle, optional 4-bar strength meter, and `estimatePasswordStrength` helper. Auto-consumes Field context for id/required/disabled/aria-invalid.
- be16ab3: add Spinner component with xs/sm/md/lg sizes and accessible sr-only label
- eefef8e: add StepFlow component — multi-step wizard with pending/current/complete/error states, horizontal/vertical orientation, and forward-navigation guarding via `allowSkip`
- 81d3039: add TimeInput component with 24h/12h format, optional seconds, auto-normalization on blur, and Field context integration
- 7594943: backfill Field context into legacy controls: Input, Textarea, Select (SelectTrigger), Checkbox, RadioGroup, and Switch now auto-consume `id`, `required`, `disabled`, `aria-invalid`, and `aria-describedby` from a parent `<Field>`. `<Field><Input /></Field>` now works across the entire library without manual wiring.
- f9e5744: initial component set: tokens (colors, typography, spacing, radii, shadows, animation), css components (button, badge, card, input, table, dialog, drawer, tooltip, tabs, empty-state, kv-pairs, activity-entry), layout primitives (stack, inline, grid, split, center, cluster), app shell (header, sidebar, content, breadcrumbs, layout), typography sheet, per-demo theme overrides, tailwind v4 preset with v3 legacy fallback
- 00c976b: move Pagination from `@aspect/commerce` to `@aspect/react` — pagination is a base primitive, not commerce-specific. The new `@aspect/react` Pagination also supports numbered page buttons with `page`/`totalPages`/`onPageChange`/`siblingCount`, ellipsis collapsing for long ranges, and auto-computed hasPrevious/hasNext from page state. Breaking change for `@aspect/commerce` consumers — update imports from `@aspect/commerce` to `@aspect/react`.
- 2a805f5: Quality passes (5 rounds of sage-carbon comparison):

  **CSS:**
  - Z-index token scale (11 named tiers, all hardcoded values replaced)
  - Button tier-3 component tokens (30+ CSS custom properties)
  - Disabled colors per variant (explicit colors replace global opacity hack)
  - Warning state on Input (`.mizu-input--warning`)
  - Shared `.mizu-sr-only` utility (deduplicated from 3 files)
  - `prefers-reduced-motion: reduce` on 9 animated CSS files
  - `data-component` on all 59 elements (48 components + 6 layouts + 5 shell)
  - Fixed token reference `--mizu-line-height-normal` → `--mizu-font-line-height-normal`

  **React:**
  - Button: `variant="gradient"` (animated AI button), `inverse` prop, `fullWidth` prop, icon-button a11y warning via Logger
  - Input: `warning` prop, `label`/`helpText` deprecation warnings, character-count aria-live toggle
  - Combobox: single + multi-select with search, pills, Field context
  - DataTable: sortable, selectable, expandable, striped, loading skeletons
  - Hooks: `useThrottle`, `useClickAway` (+ earlier: `useMediaQuery`, `usePrevious`, `useDebounce`, `useScrollLock`)
  - Utilities: `createStrictContext`, `Logger`, shared icon set (ChevronDown, X, Check, Search, ArrowRight)
  - Config pattern: `Button.config.ts`, `Input.config.ts`

  **Tests:** 487 total (was 281), every component expanded to 10-36 tests covering variants, disabled, keyboard, refs, className, a11y

### Patch Changes

- 0be060d: add vitest coverage config + thresholds. `@aspect/react` baseline: 75/79/59/75 statements/branches/functions/lines → thresholds 70/70/50/70. `@aspect/finance` baseline: 88/86/63/88 → thresholds 80/80/55/80. Run via `pnpm test:coverage` in each package. Thresholds are set below baseline to prevent regression; raise as coverage improves. Also fixes the test-setup type merge so `toBeInTheDocument`, `toHaveClass`, `toHaveAttribute` etc. are recognized during typecheck.
- 01f4d61: add sage-inspired ESLint plugins: `eslint-plugin-ssr-friendly`, `eslint-plugin-no-unsanitized`, `eslint-plugin-testing-library`, `eslint-plugin-jest-dom`. Tests now use `toBeInTheDocument`, `toHaveClass`, `toHaveAttribute`, `toHaveStyle`, and `toBeEnabled` matchers consistently. CSS components migrate off deprecated `clip: rect(...)` to `clip-path: inset(50%)`, off duplicate `appearance` declarations, and re-order selectors to comply with `no-descending-specificity`.
- Updated dependencies [79e6c84]
- Updated dependencies [ac50982]
- Updated dependencies [b0601e2]
- Updated dependencies [e3ade86]
- Updated dependencies [3cfd652]
- Updated dependencies [f836e62]
- Updated dependencies [fbe5e56]
- Updated dependencies [1508eaf]
- Updated dependencies [11a184c]
- Updated dependencies [6c5f01d]
- Updated dependencies [84c64c8]
- Updated dependencies [6edfd9a]
- Updated dependencies [be16ab3]
- Updated dependencies [eefef8e]
- Updated dependencies [81d3039]
- Updated dependencies [01f4d61]
- Updated dependencies [f9e5744]
- Updated dependencies [00c976b]
- Updated dependencies [2a805f5]
  - @aspect/css@1.0.0
  - @aspect/tokens@0.2.0
