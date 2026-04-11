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
    // Co-located MDX docs inside the react package (e.g. Button.mdx next to Button.tsx).
    '../../../packages/react/src/components/**/*.mdx',
  ],
  addons: ['@storybook/addon-a11y'],
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
