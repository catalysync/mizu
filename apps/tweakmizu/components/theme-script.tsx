'use client';

import { defaultStyles } from '@/config/theme';

export function ThemeScript() {
  const scriptContent = `
    (function() {
      var storageKey = "editor-storage";
      var root = document.documentElement;
      var defaults = ${JSON.stringify(defaultStyles)};

      var themeState = null;
      try {
        var raw = localStorage.getItem(storageKey);
        if (raw) {
          themeState = JSON.parse(raw)?.state?.themeState;
        }
      } catch (e) {}

      var styles = (themeState && themeState.styles) || defaults;

      for (var key in defaults) {
        var value = styles[key];
        if (value !== undefined) {
          root.style.setProperty("--mizu-" + key, value);
        }
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} suppressHydrationWarning />;
}
