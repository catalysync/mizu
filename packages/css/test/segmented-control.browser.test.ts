import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

describe.skipIf(!hasBrowser)('segmented control in a browser', () => {
  const styles = () => [
    css('packages/tokens/dist/css/variables.css'),
    css('packages/css/dist/mizu.css'),
  ];

  const body = `<div class="mizu-segmented-control" role="radiogroup">
    <button class="mizu-segmented-control__item" role="radio" data-state="checked" id="on">Day</button>
    <button class="mizu-segmented-control__item" role="radio" data-state="unchecked" id="off">Week</button>
  </div>`;

  it('gives the checked segment the raised surface and the others a transparent background', async () => {
    const [checked, unchecked] = await withPage(styles(), body, async (page) => [
      await page.$eval('#on', (el) => getComputedStyle(el).backgroundColor),
      await page.$eval('#off', (el) => getComputedStyle(el).backgroundColor),
    ]);
    expect(checked).not.toBe(unchecked);
    expect(unchecked).toBe('rgba(0, 0, 0, 0)');
  });

  it('marks disabled segments with the disabled text colour', async () => {
    const color = await withPage(
      styles(),
      `<button class="mizu-segmented-control__item" data-disabled id="d">Off</button>`,
      (page) => computed(page, '#d', 'pointer-events'),
    );
    expect(color).toBe('none');
  });
});
