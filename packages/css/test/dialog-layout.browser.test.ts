import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const DIALOG = 'packages/css/dist/components/dialog.css';
// The dist build puts mizu in a cascade layer, so unlayered consumer CSS wins there whatever the
// specificity. The unlayered source is where a specificity fight can happen, so the consumer cases use it.
const DIALOG_SRC = 'packages/css/src/components/dialog.css';
// Stands in for a consumer utility class (Tailwind `max-w-md`) loaded by the app.
const UTILITY = '.max-w-md { max-width: 28rem; }';

const contentHtml = (size: string, extraClass = '') => `
  <div class="mizu-dialog__content ${extraClass}" data-size="${size}">
    <div class="mizu-dialog__header"><h2 class="mizu-dialog__title">Title</h2></div>
    <div class="mizu-dialog__body">Body</div>
    <button class="mizu-dialog__close" aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
    </button>
  </div>`;

describe.skipIf(!hasBrowser)('dialog close placement', () => {
  it('renders the close button at 24px and paints it above the sticky header', async () => {
    const result = await withPage([css(DIALOG)], contentHtml('md'), (page) =>
      page.evaluate(() => {
        const close = document.querySelector('.mizu-dialog__close') as HTMLElement;
        const header = document.querySelector('.mizu-dialog__header') as HTMLElement;
        const box = close.getBoundingClientRect();
        const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        const headerBox = header.getBoundingClientRect();
        return {
          width: box.width,
          height: box.height,
          headerOverlapsClose:
            box.left < headerBox.right &&
            box.right > headerBox.left &&
            box.top < headerBox.bottom &&
            box.bottom > headerBox.top,
          hitIsClose: hit !== null && close.contains(hit),
        };
      }),
    );
    expect(result.width).toBe(24);
    expect(result.height).toBe(24);
    expect(result.headerOverlapsClose).toBe(true);
    expect(result.hitIsClose).toBe(true);
  });
});

describe.skipIf(!hasBrowser)('dialog title clearance', () => {
  it('keeps a long title clear of the close button', async () => {
    const html = contentHtml('md').replace('>Title<', `>${'Long dialog title '.repeat(20)}<`);
    const edges = await withPage([css(DIALOG)], html, (page) =>
      page.evaluate(() => {
        const title = document.querySelector('.mizu-dialog__title')!.getBoundingClientRect();
        const close = document.querySelector('.mizu-dialog__close')!.getBoundingClientRect();
        return { titleRight: title.right, closeLeft: close.left };
      }),
    );
    expect(edges.titleRight).toBeLessThanOrEqual(edges.closeLeft);
  });
});

describe.skipIf(!hasBrowser)('dialog size via custom property', () => {
  it('uses the size token width when no consumer class is set', async () => {
    const width = await withPage([css(DIALOG)], contentHtml('lg'), (page) =>
      computed(page, '.mizu-dialog__content', 'max-width'),
    );
    expect(width).toBe('768px');
  });

  it('defaults to 32rem for md', async () => {
    const width = await withPage([css(DIALOG)], contentHtml('md'), (page) =>
      computed(page, '.mizu-dialog__content', 'max-width'),
    );
    expect(width).toBe('512px');
  });

  it('lets a consumer max-w-md win over size="lg" when the utility loads after dialog.css', async () => {
    const width = await withPage(
      [css(DIALOG_SRC), UTILITY],
      contentHtml('lg', 'max-w-md'),
      (page) => computed(page, '.mizu-dialog__content', 'max-width'),
    );
    expect(width).toBe('448px');
  });

  it('lets a consumer max-w-md win over size="lg" when the utility loads before dialog.css', async () => {
    const width = await withPage(
      [UTILITY, css(DIALOG_SRC)],
      contentHtml('lg', 'max-w-md'),
      (page) => computed(page, '.mizu-dialog__content', 'max-width'),
    );
    expect(width).toBe('448px');
  });
});
