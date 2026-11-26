import { describe, expect, it } from 'vitest';
import { css, hasBrowser, withPage } from './browser';

describe.skipIf(!hasBrowser)('toast layout in a browser', () => {
  const styles = () => [
    css('packages/tokens/dist/css/variables.css'),
    css('packages/css/dist/mizu.css'),
  ];

  // Same DOM shape Toaster renders: content wrapper, close button, action row.
  it('keeps close on the title row and puts actions on their own line below', async () => {
    const result = await withPage(
      styles(),
      `<div class="mizu-toast" data-has-actions>
         <div class="mizu-toast__content">
           <div class="mizu-toast__title">Deleted</div>
           <div class="mizu-toast__description">Item removed.</div>
         </div>
         <button class="mizu-toast__close" aria-label="Close">x</button>
         <div class="mizu-toast__actions"><button class="mizu-button mizu-button--sm">Undo</button></div>
       </div>`,
      (page) =>
        page.evaluate(() => {
          const rect = (sel: string) => document.querySelector(sel)!.getBoundingClientRect();
          const title = rect('.mizu-toast__title');
          const close = rect('.mizu-toast__close');
          const description = rect('.mizu-toast__description');
          const actions = rect('.mizu-toast__actions');
          return {
            closeRight: close.right,
            titleRight: title.right,
            closeTop: close.top,
            titleBottom: title.bottom,
            descriptionBottom: description.bottom,
            actionsTop: actions.top,
            actionsWidth: actions.width,
          };
        }),
    );
    // Close sits to the right of the title, not below it.
    expect(result.closeRight).toBeGreaterThan(result.titleRight);
    expect(result.closeTop).toBeLessThan(result.titleBottom);
    // Actions start below the content and span the row.
    expect(result.actionsTop).toBeGreaterThanOrEqual(result.descriptionBottom);
    expect(result.actionsWidth).toBeGreaterThan(0);
  });
});
