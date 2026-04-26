---
'@aspect/react': patch
'@aspect/css': patch
---

`TableRow` now toggles `data-clickable="true"` when an `onClick` handler (or `role="button"`) is set, and `.mizu-table tbody tr[data-clickable="true"]` gets `cursor: pointer`. Consumers no longer need to hand-roll `className="cursor-pointer"` on every clickable row.

Also: `Stack`'s Storybook story now warns against `<Stack as="form">` and points users to the `Form` component, which is the canonical primitive for forms (noValidate, title/description/actions slots, disabled propagation).
