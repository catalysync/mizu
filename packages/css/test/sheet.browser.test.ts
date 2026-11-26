import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const BROWSER_TIMEOUT = 30_000;
const tokens = () => css('packages/tokens/dist/css/variables.css');
const sheet = () => css('packages/css/dist/components/sheet.css');
// Entry animations move the panels, which would make hit-tests depend on timing.
const NO_MOTION = '*, *::before, *::after { animation: none !important; }';

describe.skipIf(!hasBrowser)('sheet footer', () => {
  it(
    'footer paints an opaque background and stays pinned while the body scrolls',
    async () => {
      const body = `<div class="mizu-sheet__content" data-side="right" id="panel">
        <div class="mizu-sheet__body" id="scroll">
          <div style="height:1000px">scrolled content</div>
          <div class="mizu-sheet__footer" id="footer"><button type="button">Save</button></div>
          <div style="height:1000px">more content</div>
        </div>
      </div>`;
      await withPage([tokens(), sheet(), NO_MOTION], body, async (page) => {
        expect(await computed(page, '#footer', 'background-color')).toBe('rgb(255, 255, 255)');
        expect(await computed(page, '#footer', 'position')).toBe('sticky');

        // At scrollTop 0 the footer's natural position is below the scrollport, so it sticks to
        // the bottom edge and the scrolled content passes behind it.
        const probe = await page.evaluate(() => {
          const footer = document.getElementById('footer')!;
          const scroller = document.getElementById('scroll')!;
          const behind = scroller.firstElementChild!.getBoundingClientRect();
          const r = footer.getBoundingClientRect();
          const s = scroller.getBoundingClientRect();
          // Sticky offsets are measured from the padding edge of the scroller.
          const padBottom = parseFloat(getComputedStyle(scroller).paddingBottom);
          const x = r.left + r.width / 2;
          const y = r.top + r.height / 2;
          return {
            pinnedToBottom: Math.abs(r.bottom - (s.bottom - padBottom)) < 1,
            coversContent: behind.bottom > r.top && behind.top < r.bottom,
            hitIsFooter: footer.contains(document.elementFromPoint(x, y)),
          };
        });
        expect(probe.pinnedToBottom).toBe(true);
        expect(probe.coversContent).toBe(true);
        expect(probe.hitIsFooter).toBe(true);
      });
    },
    BROWSER_TIMEOUT,
  );
});

describe.skipIf(!hasBrowser)('sheet close button focus', () => {
  it(
    'shows a focus ring on the close button when it has keyboard focus',
    async () => {
      const body =
        '<div class="mizu-sheet__content" data-side="right"><button class="mizu-sheet__close" id="close" type="button" aria-label="Close"></button></div>';
      await withPage([tokens(), sheet(), NO_MOTION], body, async (page) => {
        expect(await computed(page, '#close', 'outline-style')).toBe('none');
        await page.evaluate(() => document.getElementById('close')!.focus());
        expect(
          await page.evaluate(() => document.getElementById('close')!.matches(':focus-visible')),
        ).toBe(true);
        expect(await computed(page, '#close', 'outline-style')).toBe('solid');
      });
    },
    BROWSER_TIMEOUT,
  );
});
