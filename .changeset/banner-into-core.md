---
'@mizunagara/react': minor
'@mizunagara/css': minor
'@mizunagara/commerce': minor
---

`Banner` moves into `@mizunagara/react` (import it from there or from `@mizunagara/react/banner`), and `@mizunagara/commerce` re-exports it, so existing imports keep working. Its styles move to `@mizunagara/css`. Breaking for consumers who load only `@mizunagara/commerce/css` for banners: also load `@mizunagara/css`. `critical` banners now use `role="alert"`, and other tones use `role="status"`. The dismiss button also accepts a `dismissLabel` prop.
