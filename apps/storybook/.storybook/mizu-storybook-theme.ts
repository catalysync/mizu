import { create } from 'storybook/theming';

// Brand theme for the Storybook *manager UI itself* (sidebar, topbar, tabs).
// The story canvas stays under mizu's own token-driven theming via decorators.
// These colors are a snapshot of mizu's default sample language — override
// freely via tweakmizu studio for your own language.
export const mizuStorybookTheme = create({
  base: 'light',
  brandTitle: 'mizu',
  brandUrl: 'https://github.com/catalysync/mizu',
  brandImage: '/mizu-logo.svg',
  brandTarget: '_self',

  colorPrimary: '#3b82f6',
  colorSecondary: '#22c55e',

  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,

  fontBase:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontCode:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  textColor: '#0f172a',
  textInverseColor: '#ffffff',
  textMutedColor: '#64748b',

  barTextColor: '#64748b',
  barSelectedColor: '#3b82f6',
  barHoverColor: '#3b82f6',
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#e2e8f0',
  inputTextColor: '#0f172a',
  inputBorderRadius: 6,

  booleanBg: '#f1f5f9',
  booleanSelectedBg: '#3b82f6',

  buttonBg: '#f1f5f9',
  buttonBorder: '#e2e8f0',
});
