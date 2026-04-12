---
'@aspect/react': minor
'@aspect/css': minor
---

Quality passes (5 rounds of sage-carbon comparison):

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
