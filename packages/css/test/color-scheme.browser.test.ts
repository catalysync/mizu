import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

// Native controls and scrollbars read color-scheme, so the dark scope must set it, and the page
// (light by default) must not inherit dark from somewhere else.
const sheets = () => [
  css('packages/tokens/dist/css/variables.css'),
  css('packages/css/dist/themes/dark.css'),
];

describe.skipIf(!hasBrowser)('color-scheme follows the theme scope', () => {
  it('the dark scope computes color-scheme: dark', async () => {
    const scheme = await withPage(
      sheets(),
      '<main class="scroller" data-theme="dark"><p>x</p></main>',
      (page) => computed(page, '.scroller', 'color-scheme'),
    );
    expect(scheme).toBe('dark');
  });

  it('the default page computes color-scheme: light', async () => {
    const scheme = await withPage(sheets(), '<main class="scroller"><p>x</p></main>', (page) =>
      computed(page, '.scroller', 'color-scheme'),
    );
    expect(scheme).toBe('light');
  });

  it('a light page with a dark panel keeps the panel dark and the page light', async () => {
    const [page, panel] = await withPage(
      sheets(),
      '<main class="page"><section class="panel" data-theme="dark"></section></main>',
      async (p) => [
        await computed(p, '.page', 'color-scheme'),
        await computed(p, '.panel', 'color-scheme'),
      ],
    );
    expect(page).toBe('light');
    expect(panel).toBe('dark');
  });
});
