---
'@mizunagara/css': minor
'@mizunagara/react': patch
---

The stylesheets now ship inside cascade layers (`mizu.tokens`, `mizu.base`, `mizu.components`, `mizu.shell`, `mizu.identity`), so any unlayered rule in your app overrides mizu without `!important` or extra specificity. Component rules no longer use `!important`.

- Check custom overrides after upgrading: a rule that used to lose to mizu now wins, and a rule you put in your own `@layer` that is declared before mizu's layers will lose.
- Dialogs, sheets, drawers, popovers and menus fall back to an opaque background when the surface token is missing.
- Button colours read `--mizu-button-{variant}-*` with the semantic token as the fallback. The names are no longer declared on `:root`, so set them on any ancestor to theme the buttons inside it.
- CSS behaviour is now tested in a real Chromium as well as jsdom.
