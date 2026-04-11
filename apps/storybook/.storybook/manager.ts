import { addons } from 'storybook/manager-api';
import { mizuStorybookTheme } from './mizu-storybook-theme';

addons.setConfig({
  theme: mizuStorybookTheme,
  sidebar: {
    showRoots: true,
  },
});
