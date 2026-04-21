import '@aspect/css';
import '@aspect/css/themes/atlas';
import '@aspect/css/themes/bold';
import '@aspect/css/themes/clinical';
import '@aspect/css/themes/cloud';
import '@aspect/css/themes/customer-engagement';
import '@aspect/css/themes/dark';
import '@aspect/css/themes/ecommerce';
import '@aspect/css/themes/editorial';
import '@aspect/css/themes/elevated';
import '@aspect/css/themes/finance';
import '@aspect/css/themes/fluent';
import '@aspect/css/themes/industrial';
import '@aspect/css/themes/layered';
import '@aspect/css/themes/minimal';
import '@aspect/css/themes/monochrome';
import '@aspect/css/themes/muted';
import '@aspect/css/themes/neon';
import '@aspect/css/themes/organic';
import '@aspect/css/themes/playful';
import '@aspect/css/themes/precise';
import '@aspect/css/themes/refined';
import '@aspect/css/themes/rounded';
import '@aspect/css/themes/sage';
import '@aspect/css/themes/sharp';
import '@aspect/css/themes/structured';
import '@aspect/css/themes/utilitarian';
import '@aspect/css/typography';
import '@aspect/finance/css';
import '@aspect/finance/themes/analytics';
import '@aspect/finance/themes/insights';
import '@aspect/finance/themes/reports';
import '@aspect/tokens/css';
import type { Preview } from '@storybook/react-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from '../mocks/handlers';
import { withCanvasContrast } from './decorators/withCanvasContrast';
import { withDensity } from './decorators/withDensity';
import { withMizuTheme } from './decorators/withMizuTheme';
import { withReducedMotion } from './decorators/withReducedMotion';
import { withStrictMode } from './decorators/withStrictMode';
import './global.css';
import { mizuStorybookTheme } from './mizu-storybook-theme';
import './story-utils.css';

initialize();

const preview: Preview = {
  parameters: {
    // Surface play() function errors as real test failures instead of console warnings.
    // Makes flaky interaction stories visible in CI.
    throwPlayFunctionExceptions: true,
    // Chromatic diff tolerance — 0.2 (20%) absorbs font-rendering variance + sub-pixel drift
    // without hiding real visual regressions. Applied when a Chromatic run reads this param.
    chromatic: { diffThreshold: 0.2 },
    docs: {
      theme: mizuStorybookTheme,
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: { disable: true },
    // Tailwind v4 breakpoints — keep in sync with packages/tailwind-preset.
    viewport: {
      viewports: {
        xs: { name: 'xs (320)', styles: { width: '320px', height: '900px' } },
        sm: { name: 'sm (640)', styles: { width: '640px', height: '900px' } },
        md: { name: 'md (768)', styles: { width: '768px', height: '900px' } },
        lg: { name: 'lg (1024)', styles: { width: '1024px', height: '900px' } },
        xl: { name: 'xl (1280)', styles: { width: '1280px', height: '900px' } },
        '2xl': { name: '2xl (1536)', styles: { width: '1536px', height: '900px' } },
      },
    },
    // Run axe-core against the full WCAG 2.1 AA tag set plus best-practice
    // rules — stricter than the default storybook a11y config so we catch
    // more violations.
    a11y: {
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
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
          { value: 'atlas', title: 'Atlas' },
          { value: 'playful', title: 'Playful' },
          { value: 'clinical', title: 'Clinical' },
          { value: 'editorial', title: 'Editorial' },
          { value: 'neon', title: 'Neon' },
          { value: 'sage', title: 'Sage' },
        ],
        dynamicTitle: true,
      },
    },
    reducedMotion: {
      description: 'Reduced motion',
      defaultValue: 'off',
      toolbar: {
        title: 'Motion',
        icon: 'accessibility',
        items: [
          { value: 'off', title: 'Motion on' },
          { value: 'on', title: 'Reduced' },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: 'Component density',
      defaultValue: 'default',
      toolbar: {
        title: 'Density',
        icon: 'grow',
        items: [
          { value: 'compact', title: 'Compact' },
          { value: 'default', title: 'Default' },
          { value: 'spacious', title: 'Spacious' },
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
    canvasContrast: {
      description: 'Canvas contrast — override the body background for contrast testing',
      defaultValue: 'default',
      toolbar: {
        title: 'Canvas',
        icon: 'contrast',
        items: [
          { value: 'default', title: 'Default canvas' },
          { value: 'subtle', title: 'Subtle gray' },
          { value: 'painted', title: 'Brand tint' },
          { value: 'hard', title: 'High contrast' },
        ],
        dynamicTitle: true,
      },
    },
  },
  loaders: [mswLoader],
  decorators: [withStrictMode, withCanvasContrast, withMizuTheme, withReducedMotion, withDensity],
  // Opt every story into auto-generated Docs tabs. MDX files (Button.mdx,
  // Patterns.mdx, …) still override per-component when present.
  tags: ['autodocs'],
};

export default preview;
