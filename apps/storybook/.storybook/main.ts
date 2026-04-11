import type { StorybookConfig } from '@storybook/react-vite';

// Set IGNORE_TESTS=true in CI runs that should skip *.interaction.stories.tsx
// and *.test.stories.tsx (e.g. pure visual regression / Chromatic runs).
const ignoreTests = process.env.IGNORE_TESTS === 'true';

const storyGlobs = ignoreTests
  ? ['../stories/**/*.stories.@(ts|tsx|mdx)']
  : ['../stories/**/*.@(stories|interaction|test).@(ts|tsx|mdx)'];

const config: StorybookConfig = {
  stories: [
    // Welcome comes first so Storybook opens to it by default.
    '../stories/welcome/*.stories.@(ts|tsx|mdx)',
    ...storyGlobs,
    // MDX docs live alongside the stories they reference.
    '../stories/**/*.mdx',
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
