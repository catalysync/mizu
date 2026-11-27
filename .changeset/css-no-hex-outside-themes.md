---
'@mizunagara/css': patch
---

Step flow and date picker selected states no longer use a raw `#fff`. They read `--mizu-text-on-primary`, so a theme can change that text colour like any other token. Light and dark rendering is unchanged.
