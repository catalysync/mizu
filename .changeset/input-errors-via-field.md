---
'@mizunagara/react': minor
---

**Breaking:** `Input`'s `error` prop is now a boolean and no longer renders a message. Pass the message to `Field`'s `errorMessage` prop instead: `<Field errorMessage="Required"><Input error /></Field>`. `aria-describedby` now points only at elements that are rendered, and an Input `warning` shows without a `Field` wrapper.
