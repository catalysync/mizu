import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

describe.skipIf(!hasBrowser)('tabs in a browser', () => {
  const styles = () => [
    css('packages/tokens/dist/css/variables.css'),
    css('packages/css/dist/mizu.css'),
  ];

  const tabs = () => `
    <div class="mizu-tabs">
      <div class="mizu-tabs__list" role="tablist">
        <button class="mizu-tabs__trigger" role="tab" data-state="active">A</button>
        <button class="mizu-tabs__trigger" role="tab" data-state="inactive">B</button>
        <button class="mizu-tabs__trigger" role="tab" data-state="inactive" disabled>C</button>
      </div>
    </div>`;

  it('stacks the vertical list in a column beside the content', async () => {
    const [root, list] = await withPage(
      styles(),
      `<div class="mizu-tabs" data-orientation="vertical">
         <div class="mizu-tabs__list">
           <button class="mizu-tabs__trigger" data-state="active">A</button>
           <button class="mizu-tabs__trigger" data-state="inactive">B</button>
         </div>
       </div>`,
      async (page) => [
        await computed(page, '.mizu-tabs', 'flex-direction'),
        await computed(page, '.mizu-tabs__list', 'flex-direction'),
      ],
    );
    expect(root).toBe('row');
    expect(list).toBe('column');
  });

  it('drops the rail for a vertical segmented track', async () => {
    const width = await withPage(
      styles(),
      `<div class="mizu-tabs mizu-tabs--segmented" data-orientation="vertical">
         <div class="mizu-tabs__list"><button class="mizu-tabs__trigger" data-state="active">A</button></div>
       </div>`,
      (page) => computed(page, '.mizu-tabs__list', 'border-left-width'),
    );
    expect(width).toBe('0px');
  });

  it('keeps the horizontal underline layout by default', async () => {
    const list = await withPage(styles(), tabs(), (page) =>
      computed(page, '.mizu-tabs__list', 'flex-direction'),
    );
    expect(list).toBe('row');
  });

  it('draws the active indicator from the tabs indicator token', async () => {
    const color = await withPage(
      styles(),
      `<div style="--mizu-tabs-indicator-color: rgb(1, 2, 3)">${tabs()}</div>`,
      (page) => computed(page, '.mizu-tabs__trigger[data-state="active"]', 'border-bottom-color'),
    );
    expect(color).toBe('rgb(1, 2, 3)');
  });

  it('falls back to the primary action colour for the indicator', async () => {
    const color = await withPage(styles(), tabs(), (page) =>
      computed(page, '.mizu-tabs__trigger[data-state="active"]', 'border-bottom-color'),
    );
    expect(color).toBe('rgb(37, 99, 235)');
  });

  it('uses the disabled text colour for a disabled tab', async () => {
    const [disabled, enabled] = await withPage(styles(), tabs(), async (page) => [
      await page.$eval('.mizu-tabs__trigger:disabled', (el) =>
        getComputedStyle(el).getPropertyValue('color'),
      ),
      await page.$eval('.mizu-tabs__trigger:not(:disabled)', (el) =>
        getComputedStyle(el).getPropertyValue('color'),
      ),
    ]);
    expect(disabled).not.toBe(enabled);
    expect(disabled).toBe(
      await withPage(styles(), `<span style="color: var(--mizu-text-disabled)"></span>`, (page) =>
        computed(page, 'span', 'color'),
      ),
    );
  });

  it('draws a visible focus ring on keyboard focus', async () => {
    const outline = await withPage(styles(), tabs(), async (page) => {
      await page.keyboard.press('Tab');
      return page.$eval('.mizu-tabs__trigger[data-state="active"]', (el) => ({
        style: getComputedStyle(el).getPropertyValue('outline-style'),
        width: getComputedStyle(el).getPropertyValue('outline-width'),
        color: getComputedStyle(el).getPropertyValue('outline-color'),
      }));
    });
    expect(outline.style).toBe('solid');
    expect(outline.width).toBe('2px');
    expect(outline.color).toBe('rgb(37, 99, 235)');
  });
});
