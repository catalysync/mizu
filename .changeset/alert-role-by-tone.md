---
'@mizunagara/react': minor
---

`Alert` now uses `role="alert"` only for the `danger` tone and `role="status"` for the others, so polite tones no longer interrupt screen readers. Pass `role` to override. Breaking for consumers who relied on info or warning alerts being announced as alerts. Adds a default icon per tone (pass `icon={null}` to hide it) and a `dismissLabel` prop for the dismiss button.
