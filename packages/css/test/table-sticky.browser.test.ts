import { describe, expect, it } from 'vitest';
import { css, hasBrowser, withPage } from './browser';

const rows = Array.from({ length: 80 }, (_, i) => `<tr><td>Row ${i}</td></tr>`).join('');

function table(sticky: boolean) {
  return `<div class="mizu-table-wrapper" style="--mizu-table-max-height: 120px"><table class="mizu-table${sticky ? ' mizu-table--sticky' : ''}"><thead><tr><th scope="col">Name</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

async function scrollAndMeasure(sticky: boolean) {
  return withPage([css('packages/css/src/components/table.css')], table(sticky), (page) =>
    page.evaluate(() => {
      const wrapper = document.querySelector<HTMLElement>('.mizu-table-wrapper')!;
      wrapper.scrollTop = 400;
      const head = document.querySelector('thead')!.getBoundingClientRect();
      const box = wrapper.getBoundingClientRect();
      return {
        scrollTop: wrapper.scrollTop,
        height: box.height,
        headOffset: head.top - box.top,
      };
    }),
  );
}

describe.skipIf(!hasBrowser)('table sticky header with maxHeight', () => {
  it('caps the wrapper height and scrolls the body', async () => {
    const m = await scrollAndMeasure(true);
    expect(m.height).toBeLessThanOrEqual(121);
    expect(m.scrollTop).toBeGreaterThan(0);
  });

  it('keeps the header visible while the body scrolls when stickyHeader is set', async () => {
    const m = await scrollAndMeasure(true);
    expect(m.headOffset).toBeGreaterThanOrEqual(-1);
    expect(m.headOffset).toBeLessThanOrEqual(1);
  });

  it('control: without stickyHeader the header scrolls out of view', async () => {
    const m = await scrollAndMeasure(false);
    expect(m.scrollTop).toBeGreaterThan(0);
    expect(m.headOffset).toBeLessThan(-50);
  });
});
