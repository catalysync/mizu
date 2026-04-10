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
import '@aspect/css/themes/rounded';
import '@aspect/css/themes/sharp';
import '@aspect/css/themes/elevated';
import '@aspect/css/themes/bold';
import '@aspect/css/themes/minimal';
import '@aspect/css/themes/precise';
import '@aspect/css/themes/structured';
import '@aspect/css/themes/refined';
import '@aspect/css/themes/monochrome';
import '@aspect/css/themes/utilitarian';
import '@aspect/css/themes/fluent';
import '@aspect/css/themes/layered';
import '@aspect/css/themes/industrial';
import '@aspect/css/themes/organic';
import '@aspect/css/themes/muted';
import '@aspect/finance/css';
import '@aspect/finance/themes/reports';
import '@aspect/finance/themes/insights';
import '@aspect/finance/themes/analytics';
import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from '../mocks/handlers';

initialize();

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
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
      },
    },
    msw: {
      handlers,
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
    identity: {
      description: 'Visual identity',
      defaultValue: 'none',
      toolbar: {
        title: 'Identity',
        icon: 'paintbrush',
        items: [
          { value: 'none', title: 'Default' },
          { value: 'rounded', title: 'Rounded' },
          { value: 'sharp', title: 'Sharp' },
          { value: 'elevated', title: 'Elevated' },
          { value: 'bold', title: 'Bold' },
          { value: 'minimal', title: 'Minimal' },
          { value: 'precise', title: 'Precise' },
          { value: 'structured', title: 'Structured' },
          { value: 'refined', title: 'Refined' },
          { value: 'monochrome', title: 'Monochrome' },
          { value: 'utilitarian', title: 'Utilitarian' },
          { value: 'fluent', title: 'Fluent' },
          { value: 'layered', title: 'Layered' },
          { value: 'industrial', title: 'Industrial' },
          { value: 'organic', title: 'Organic' },
          { value: 'muted', title: 'Muted' },
        ],
        dynamicTitle: true,
      },
    },
    strictMode: {
      description: 'React StrictMode',
      defaultValue: 'off',
      toolbar: {
        title: 'Strict',
        icon: 'shield',
        items: ['off', 'on'],
        dynamicTitle: true,
      },
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light';
      const identity = context.globals.identity ?? 'none';
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
        if (identity && identity !== 'none') {
          document.documentElement.dataset.mizuIdentity = identity;
        } else {
          delete document.documentElement.dataset.mizuIdentity;
        }
        document.body.style.backgroundColor = theme === 'dark' ? 'var(--mizu-surface-default)' : '';
        document.body.style.color = theme === 'dark' ? 'var(--mizu-text-primary)' : '';
      }
      const strict = context.globals.strictMode === 'on';
      const story = Story();
      return strict ? React.createElement(React.StrictMode, null, story) : story;
    },
  ],
};

export default preview;
