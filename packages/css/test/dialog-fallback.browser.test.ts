import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

// Floating panels must paint an opaque surface even when no token sheet is loaded.
const TRANSPARENT = ['rgba(0, 0, 0, 0)', 'transparent'];

describe.skipIf(!hasBrowser)('panel background fallbacks without tokens', () => {
  it('dialog content has an opaque background with only dialog.css loaded', async () => {
    const bg = await withPage(
      [css('packages/css/dist/components/dialog.css')],
      '<div class="mizu-dialog__content">x</div>',
      (page) => computed(page, '.mizu-dialog__content', 'background-color'),
    );
    expect(TRANSPARENT).not.toContain(bg);
    expect(bg).toBe('rgb(255, 255, 255)');
  });

  it('alert-dialog content has an opaque background with only alert-dialog.css loaded', async () => {
    const bg = await withPage(
      [css('packages/css/dist/components/alert-dialog.css')],
      '<div class="mizu-alert-dialog__content">x</div>',
      (page) => computed(page, '.mizu-alert-dialog__content', 'background-color'),
    );
    expect(TRANSPARENT).not.toContain(bg);
    expect(bg).toBe('rgb(255, 255, 255)');
  });

  it('sheet content has an opaque background with only sheet.css loaded', async () => {
    const bg = await withPage(
      [css('packages/css/dist/components/sheet.css')],
      '<div class="mizu-sheet__content">x</div>',
      (page) => computed(page, '.mizu-sheet__content', 'background-color'),
    );
    expect(TRANSPARENT).not.toContain(bg);
    expect(bg).toBe('rgb(255, 255, 255)');
  });

  it('dialog content keeps a border and shadow fallback', async () => {
    const styles = await withPage(
      [css('packages/css/dist/components/dialog.css')],
      '<div class="mizu-dialog__content">x</div>',
      async (page) => ({
        border: await computed(page, '.mizu-dialog__content', 'border-top-style'),
        shadow: await computed(page, '.mizu-dialog__content', 'box-shadow'),
      }),
    );
    expect(styles.border).toBe('solid');
    expect(styles.shadow).not.toBe('none');
  });
});
