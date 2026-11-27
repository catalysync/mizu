---
'@mizunagara/css': patch
---

invalid inputs, textareas and select triggers now get the danger border from `aria-invalid="true"` in one shared rule in `form.css`. Previously only the `.mizu-input--error` class did this. Not breaking; consumers that set their own border on those controls keep their override.
