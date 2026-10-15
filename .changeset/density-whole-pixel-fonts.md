---
'@mizunagara/css': patch
---

Round the compact and comfortable density font sizes to whole pixels. Compact used values such as `0.656rem` (10.5px) and `0.766rem` (12.26px), which render blurry. Each step now sits within half a pixel of the 0.875× / 1.125× target: compact is 11, 12, 14, 16, 18, 21, 26 and 32px; comfortable is 14, 16, 18, 20, 23, 27, 34 and 41px.
