---
'@mizunagara/css': patch
---

Focus rings stay visible in forced-colors mode for text inputs, textareas, selects, toggle groups, the date picker trigger, the slider thumb, autocomplete, the combobox, the command menu and highlighted menu and option items. These controls drew their ring or highlight with box-shadow or a background tint, which forced colors removes. The global forced-colors focus rule now sets a full 2px outline with the focus ring offset, where it used to recolour only the browser's default ring. Consumer CSS that sets its own outline still wins.
