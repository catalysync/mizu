import './global.css';
import './story-utils.css';
import '@aspect/tokens/css';
import '@aspect/css';
import '@aspect/css/typography';
import '@aspect/css/themes/dark';
import '@aspect/css/themes/cloud';
import '@aspect/css/themes/ecommerce';
import '@aspect/css/themes/finance';
import '@aspect/css/themes/customer-engagement';
import '@aspect/finance/css';
import '@aspect/finance/themes/reports';
import '@aspect/finance/themes/insights';
import '@aspect/finance/themes/analytics';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#020617' },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
      }
      return Story();
    },
  ],
};

export default preview;
