---
'@mizunagara/css': minor
---

Identity themes now set tokens only. The component rules that eleven themes used to restyle directly (button shape and type, card border and shadow, input edges, table head and cells, badge padding and radius, alert radius) read new component tokens whose defaults are the previous values, so rendered styles do not change. This change is not breaking.
