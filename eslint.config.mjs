import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import ssrFriendly from 'eslint-plugin-ssr-friendly';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/storybook-static/**',
      '**/node_modules/**',
      '**/*.generated.*',
      'pnpm-lock.yaml',
      'research/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node, ...globals.es2022 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'ssr-friendly': ssrFriendly,
      'no-unsanitized': noUnsanitized,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'no-unsanitized/method': 'error',
      'no-unsanitized/property': 'error',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/test-setup.{ts,tsx}'],
    plugins: {
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
    },
    rules: {
      ...testingLibrary.configs.react.rules,
      ...jestDom.configs.recommended.rules,
      'testing-library/no-node-access': 'off',
      'testing-library/no-container': 'off',
    },
  },
  {
    // Storybook render functions are components at runtime but look like arrow
    // functions to ESLint. Storybook's CSF3 convention allows hooks inside render.
    files: ['**/stories/**/*.{ts,tsx}', '**/*.stories.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  prettier,
);
