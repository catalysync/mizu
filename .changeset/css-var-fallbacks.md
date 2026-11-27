---
'@mizunagara/css': patch
---

Colour, border, background and shadow references in component, layout and shell CSS now carry a fallback to the light theme value. Theme and typography styles now do too. Components keep their borders and colours when the token sheet is not loaded, and nothing changes where the tokens are present. Not breaking.
