---
'@aspect/react': minor
---

add `FormField` — opt-in react-hook-form bridge that pairs RHF's `Controller` with mizu's `<Field>`. Pass `control`, `name`, `rules`, plus the usual Field props (`label`, `description`, `required`, `showOptionalHint`, …); the children render-prop receives RHF's `field` to spread onto any mizu input. RHF validation errors flow into Field's `errorMessage` automatically (and thus `aria-invalid` + `aria-describedby`). `react-hook-form` is declared as an **optional peer** (>=7.50.0) — not pulled into the bundle for non-RHF consumers since it's now external in tsup config.
