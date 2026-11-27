---
'@mizunagara/react': minor
---

`Spinner` takes its default screen-reader label from the active locale (`feedback.loading`, set through `I18nProvider`) instead of the hard-coded English word "Loading". With the built-in en-US locale the default text is now "Loading…"; an explicit `label` prop still overrides it. The reduced-motion behaviour is unchanged: the spinner keeps turning, slower, under `prefers-reduced-motion`.
