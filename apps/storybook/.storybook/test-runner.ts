import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

/*
 * Story-level accessibility tests, run by @storybook/test-runner against a
 * headless Playwright browser. Complements the vitest-axe assertions in
 * component unit tests — this layer catches a11y regressions in the story
 * *composition* context (e.g. a component inside a filter bar, or a demo
 * layout) that a unit test in isolation would miss.
 *
 * Rules are tuned to the same WCAG 2.1 AA + best-practice set the a11y
 * addon uses in `preview.ts`, so dev-time feedback and CI stay aligned.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
    await configureAxe(page, {
      rules: [
        { id: 'wcag2a', enabled: true },
        { id: 'wcag2aa', enabled: true },
        { id: 'wcag21a', enabled: true },
        { id: 'wcag21aa', enabled: true },
        { id: 'best-practice', enabled: true },
      ],
    });
  },
  async postVisit(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
