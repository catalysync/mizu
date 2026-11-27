---
'@mizunagara/tokens': minor
'@mizunagara/css': minor
---

Focus rings and the z-index scale are tokens, and reduced motion is scoped.

- New `--mizu-focus-ring-width`, `--mizu-focus-ring-color` and `--mizu-focus-ring-offset`. Every focus outline reads them; the default is unchanged (2px, primary colour, 2px offset).
- The `--mizu-z-*` scale is defined in `@mizunagara/tokens` instead of a hand-written file in `@mizunagara/css`. Names and values are unchanged. Load the tokens stylesheet (as the setup guide already says) to get them.
- Under `prefers-reduced-motion`, the `mizu-animate-*` utilities finish at once. The page-wide reset that reached every element is gone, and component spinners keep a slower animation so loading states stay visible.
