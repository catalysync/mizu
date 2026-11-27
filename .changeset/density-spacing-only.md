---
'@mizunagara/css': minor
---

Density now scales spacing tokens only. `data-mizu-density="compact"` and `"comfortable"` change padding and gaps, but font sizes stay the same on every density. This is breaking for anyone who relied on density also changing text size; set font sizes explicitly if you need that.
