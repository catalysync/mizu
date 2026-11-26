---
'@mizunagara/react': patch
'@mizunagara/css': patch
---

Loading buttons now set `aria-disabled` instead of the `disabled` attribute, so they keep keyboard focus while busy, and Enter or Space no longer submit a loading form. The label fades out with opacity instead of `visibility: hidden`, so the button keeps its accessible name. Not an API break, but code that matched `:disabled` to detect loading should match `[data-loading="true"]` or `[aria-disabled="true"]` instead.
