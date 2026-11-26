import { describe, expect, it } from 'vitest';
import { css, hasBrowser, withPage } from './browser';

const DIALOG = 'packages/css/dist/components/dialog.css';
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
