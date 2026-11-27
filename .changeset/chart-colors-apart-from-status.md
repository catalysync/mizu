---
'@mizunagara/tokens': minor
'@mizunagara/css': patch
---

Chart series colours no longer reuse the status colours. `--mizu-chart-categorical-1..8` aliased the same steps as feedback (slot 3 was exactly `feedback-warning-default`; slots 2 and 4 were emerald and red), so an ordinary series read as a warning or an error, and re-theming a status colour repainted charts.

The slots now draw from a dedicated ramp, `--mizu-color-chart-1..8` (plus `--mizu-color-chart-dark-1..8`, applied by the dark sample theme). Every step is at least OKLab ΔE 10 from success, warning and danger. The order is fixed, and adjacent slots pass the colour-vision-deficiency, normal-vision and lightness checks on white and on slate-950. Four light-mode slots are below 3:1 against white, so charts keep their legends and tooltips.
