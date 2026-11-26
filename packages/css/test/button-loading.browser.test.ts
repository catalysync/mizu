import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = () => [
  css('packages/tokens/dist/css/variables.css'),
  css('packages/css/dist/mizu.css'),
];

const loadingButton = `<button id="b" class="mizu-button mizu-button--primary" data-loading="true" aria-busy="true" aria-disabled="true"><span class="mizu-button__label">Save</span><span class="mizu-button__spinner" aria-hidden="true"></span></button>`;

describe.skipIf(!hasBrowser)('button loading state in a browser', () => {
  it('hides the label with opacity, not visibility, so the name survives', async () => {
    const values = await withPage(styles(), loadingButton, (page) =>
      Promise.all([
        computed(page, '.mizu-button__label', 'opacity'),
        computed(page, '.mizu-button__label', 'visibility'),
      ]),
    );
    expect(values).toEqual(['0', 'visible']);
  });

  it('exposes the button by its name while loading', async () => {
    const count = await withPage(styles(), loadingButton, (page) =>
      page.getByRole('button', { name: 'Save' }).count(),
    );
    expect(count).toBe(1);
  });

  it('keeps the button natively enabled and focusable while loading', async () => {
    const result = await withPage(styles(), loadingButton, async (page) => {
      await page.focus('#b');
      return {
        disabled: await page.$eval('#b', (el) => (el as HTMLButtonElement).disabled),
        focused: await page.$eval('#b', (el) => el === document.activeElement),
      };
    });
    expect(result).toEqual({ disabled: false, focused: true });
  });

  it('uses the disabled look while loading', async () => {
    const opacity = await withPage(styles(), loadingButton, (page) =>
      computed(page, '#b', 'opacity'),
    );
    expect(opacity).toBe('0.55');
  });
});
