---
'@aspect/css': patch
---

Fix density.css to declare the default spacing + font-size scale at `:root`. Previously the file only contained `[data-mizu-density="compact"]` and `[data-mizu-density="comfortable"]` override blocks, so any consumer who didn't opt into a density attribute saw undefined values for `--mizu-spacing-1`…`--mizu-spacing-24` and `--mizu-font-size-xs`…`--mizu-font-size-4xl` — causing every component referencing those tokens to silently render with no padding, no gaps, and no font-size unless `@aspect/tokens` was also imported.

Compact and comfortable override blocks have also been realigned to match the canonical `step(n) = (base * n / 16) * multiplier` formula (multipliers 0.875 and 1.125), bringing them in line with the runtime calculation in tweakmizu's `densityVars` and the documented density spread.
