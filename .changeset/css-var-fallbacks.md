---
'@mizunagara/css': patch
---

Theme and typography styles now give every colour token a fallback, the same as components already did. If a token is unset, the declaration falls back to the token's light value instead of being dropped. Rendering is unchanged wherever the tokens are defined.
