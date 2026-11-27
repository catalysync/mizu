---
'@mizunagara/react': minor
'@mizunagara/css': minor
---

PropertyFilter now supports keyboard suggestions: arrow keys move through property and value options, Enter picks one, and Escape closes the list. Properties' `operators` and `options` are honoured, so typing `Status != idle` creates a `!=` token and operators a property does not declare are rejected. Breaking for tests: the input now has the `combobox` role instead of `textbox`, so queries using `getByRole('textbox')` need updating.
