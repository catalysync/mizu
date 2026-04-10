/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['**/dist/**', '**/node_modules/**', '**/*.generated.*'],
  rules: {
    // allow BEM-style block__element--modifier on top of kebab-case
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { message: 'class selectors must be kebab-case BEM' },
    ],
    // tailwind v4 introduces a handful of custom at-rules
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['theme', 'plugin', 'source', 'variant', 'utility', 'custom-variant'],
      },
    ],
    // comments preceding custom props are intentional grouping headers
    'custom-property-empty-line-before': null,
    'custom-property-pattern': null,
  },
};
