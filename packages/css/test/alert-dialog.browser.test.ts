import { describe, expect, it } from 'vitest';
import { css, hasBrowser, withPage } from './browser';

// A long body must scroll inside the panel; the panel itself must stay within 85vh.
const LONG_BODY = '<div style="height: 3000px">long content</div>';

describe.skipIf(!hasBrowser)('alert dialog body scrolling', () => {
  it('caps the panel at 85vh and scrolls the body', async () => {
    const result = await withPage(
      [css('packages/css/dist/components/alert-dialog.css')],
      `<div class="mizu-alert-dialog__content" data-size="md">
         <div class="mizu-alert-dialog__header">Title</div>
         <div class="mizu-alert-dialog__body">${LONG_BODY}</div>
         <div class="mizu-alert-dialog__footer"><button>OK</button></div>
       </div>`,
      (page) =>
        page.evaluate(() => {
          const panel = document.querySelector('.mizu-alert-dialog__content') as HTMLElement;
          const body = document.querySelector('.mizu-alert-dialog__body') as HTMLElement;
          const footer = document.querySelector('.mizu-alert-dialog__footer') as HTMLElement;
          const panelRect = panel.getBoundingClientRect();
          const footerRect = footer.getBoundingClientRect();
          return {
            viewportHeight: window.innerHeight,
            panelHeight: panelRect.height,
            panelBottom: panelRect.bottom,
            footerBottom: footerRect.bottom,
            bodyOverflowY: getComputedStyle(body).overflowY,
            bodyClientHeight: body.clientHeight,
            bodyScrollHeight: body.scrollHeight,
            bodyMinHeight: getComputedStyle(body).minHeight,
          };
        }),
    );
    expect(result.panelHeight).toBeLessThanOrEqual(result.viewportHeight * 0.85 + 1);
    expect(result.bodyOverflowY).toBe('auto');
    expect(result.bodyMinHeight).toBe('0px');
    expect(result.bodyScrollHeight).toBeGreaterThan(result.bodyClientHeight);
    // The footer stays inside the panel instead of being pushed off screen.
    expect(result.footerBottom).toBeLessThanOrEqual(result.panelBottom + 1);
  });

  it('applies the sm size as a narrower panel', async () => {
    const width = await withPage(
      [css('packages/css/dist/components/alert-dialog.css')],
      '<div class="mizu-alert-dialog__content" data-size="sm">x</div>',
      (page) => page.$eval('.mizu-alert-dialog__content', (el) => getComputedStyle(el).maxWidth),
    );
    expect(width).toBe('384px');
  });
});
