---
'@aspect/css': patch
---

polish modal default styling — softer overlay (50% black), 1px content border, sharper title typography (tight line-height + letter-spacing), legibility line-height on description, smaller opacity-based close button with focus ring. Animations now reuse the global `mizu-fade-in` and `mizu-zoom-in` keyframes from `animation.css` instead of duplicating them locally.
