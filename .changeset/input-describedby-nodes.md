---
'@mizunagara/react': patch
---

Fix `Input` `aria-describedby`: it now references only the help and error elements that `Field` renders, so it no longer points at ids for nodes that are not in the DOM.
