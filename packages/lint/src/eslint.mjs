import ariaInvalidBoundStyle from './jsx/aria-invalid-bound-style.mjs';
import iconButtonLabel from './jsx/icon-button-label.mjs';
import noStaticClick from './jsx/no-static-click.mjs';

// ESLint plugin object. Register it under the `mizu` namespace in a flat config.
export const eslintPlugin = {
  meta: { name: '@mizunagara/lint' },
  rules: {
    'icon-button-label': iconButtonLabel,
    'aria-invalid-bound-style': ariaInvalidBoundStyle,
    'no-static-click': noStaticClick,
  },
};

// Severity for each rule when a config turns the plugin on. Callers choose the level.
export const eslintRules = {
  'mizu/icon-button-label': 'error',
  'mizu/aria-invalid-bound-style': 'error',
  'mizu/no-static-click': 'error',
};

export default eslintPlugin;
