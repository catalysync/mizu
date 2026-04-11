---
'@aspect/react': minor
---

backfill Field context into legacy controls: Input, Textarea, Select (SelectTrigger), Checkbox, RadioGroup, and Switch now auto-consume `id`, `required`, `disabled`, `aria-invalid`, and `aria-describedby` from a parent `<Field>`. `<Field><Input /></Field>` now works across the entire library without manual wiring.
