import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

// Black drop shadows vanish on a near-black page, so the dark shadow tokens carry a light edge
// ring. Checked on the computed box-shadow of a real dialog panel, not on the token text.
const sheets = () => [
  css('packages/tokens/dist/css/variables.css'),
  css('packages/css/dist/themes/dark.css'),
  css('packages/css/dist/components/dialog.css'),
];
const PANEL = '<div class="mizu-dialog__content">x</div>';

describe.skipIf(!hasBrowser)('dark elevation on a dialog panel', () => {
  it('a dark panel has an edge ring and a drop shadow', async () => {
    const shadow = await withPage(
      sheets(),
      `<div data-theme="dark" style="background: rgb(2, 6, 23)">${PANEL}</div>`,
      (page) => computed(page, '.mizu-dialog__content', 'box-shadow'),
    );
    expect(shadow).not.toBe('none');
    expect(shadow).toContain('rgba(255, 255, 255, 0.06) 0px 0px 0px 1px');
    expect(shadow).toContain('rgba(0, 0, 0, 0.6)');
  });

  it('the dark shadow differs from the light shadow the same panel gets by default', async () => {
    const [dark, light] = await withPage(
      sheets(),
      `<div data-theme="dark">${PANEL}</div><div class="light">${PANEL}</div>`,
      async (page) => [
        await page.$eval(
          '[data-theme="dark"] .mizu-dialog__content',
          (el) => getComputedStyle(el).boxShadow,
        ),
        await page.$eval('.light .mizu-dialog__content', (el) => getComputedStyle(el).boxShadow),
      ],
    );
    expect(dark).not.toBe(light);
    expect(light).not.toContain('255, 255, 255, 0.06');
  });
});
