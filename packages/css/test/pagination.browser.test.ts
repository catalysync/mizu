import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = () => [
  css('packages/tokens/dist/css/variables.css'),
  css('packages/css/dist/mizu.css'),
];

const markup = `<nav class="mizu-pagination"><div class="mizu-pagination__pages">
  <button class="mizu-pagination__page" data-current="true" aria-current="page">3</button>
  <button class="mizu-pagination__page">4</button>
</div></nav>`;

describe.skipIf(!hasBrowser)('pagination in a browser', () => {
  it('draws the current page with the on-primary text token', async () => {
    const color = await withPage(
      styles(),
      `<div style="--mizu-text-on-primary: rgb(1, 2, 3)">${markup}</div>`,
      (page) => computed(page, '[data-current="true"]', 'color'),
    );
    expect(color).toBe('rgb(1, 2, 3)');
  });

  it('keeps the current page highlighted while it is hovered', async () => {
    const [rest, hovered] = await withPage(styles(), markup, async (page) => {
      const before = await computed(page, '[data-current="true"]', 'background-color');
      await page.hover('[data-current="true"]');
      const after = await computed(page, '[data-current="true"]', 'background-color');
      return [before, after];
    });
    expect(hovered).toBe(rest);
    expect(hovered).not.toBe('rgba(0, 0, 0, 0)');
  });

  it('still tints a non-current page on hover', async () => {
    const hovered = await withPage(styles(), markup, async (page) => {
      await page.hover('.mizu-pagination__page:not([data-current])');
      return computed(page, '.mizu-pagination__page:not([data-current])', 'background-color');
    });
    expect(hovered).not.toBe('rgba(0, 0, 0, 0)');
  });
});
