---
'@mizunagara/tokens': minor
'@mizunagara/css': minor
---

One scrim for every modal layer, and fewer hard-coded colours.

- Dialog, alert dialog, sheet, drawer and command menu share `--mizu-overlay-scrim` and `--mizu-overlay-scrim-blur` instead of five different backdrops. The default is black at 50% with no blur.
- Components read `--mizu-surface-default` instead of the `--mizu-surface-primary` alias. The alias still exists, so themes that set it keep working for now.
- The gradient button no longer has fixed violet and pink stops. It runs between the primary action colours, and a theme sets `--mizu-button-gradient-from` and `--mizu-button-gradient-to` for a branded gradient.
