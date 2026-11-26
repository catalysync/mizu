---
'@mizunagara/react': minor
---

**Breaking:** `Input` no longer accepts the `label` or `helpText` props. Wrap the input in `Field` instead, using `Field`'s `label` and `description` props (`<Field label="Email" description="Help"><Input /></Field>`). The Input docs page has a migration table.
