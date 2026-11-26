import { stylelintPlugins } from './packages/lint/src/stylelint.mjs';

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  plugins: stylelintPlugins,
  ignoreFiles: [
    '**/dist/**',
    '**/node_modules/**',
    '**/*.generated.*',
    // Third-party library overrides (react-awesome-query-builder) — can't follow BEM
    '**/components/query-builder.css',
    '**/components/advanced-query-builder.css',
  ],
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
  overrides: [
    {
      files: ['packages/css/src/**/*.css'],
      rules: { 'mizu/var-fallback': true },
    },
    {
      // Themes are left out on purpose: a theme is where raw colour values are meant to live.
      files: [
        'packages/css/src/components/**/*.css',
        'packages/css/src/layouts/**/*.css',
        'packages/css/src/shell/**/*.css',
        'packages/css/src/*.css',
      ],
      rules: { 'mizu/no-hex-color': true },
    },
    {
      // Identity files set tokens only. Component selectors that cannot move to a token yet
      // carry a stylelint-disable comment with the reason.
      files: ['packages/css/src/themes/**/*.css'],
      rules: { 'mizu/identity-tokens-only': true },
    },
  ],
};
