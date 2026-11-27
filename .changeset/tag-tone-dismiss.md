---
'@mizunagara/css': patch
---

Tag now has styles for every tone (neutral, success, warning, danger, info), so each tone shows its own background and text colour. The label and dismiss button get their own rules, and the dismiss button now has a focus ring and inherits the tone's text colour. The unused `.mizu-tag__remove` class is replaced by `.mizu-tag__dismiss`, which is what the React binding already renders. Not breaking.
