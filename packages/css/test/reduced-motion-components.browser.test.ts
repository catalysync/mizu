import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = [css('packages/tokens/dist/css/variables.css'), css('packages/css/dist/mizu.css')];
const REDUCED = '1e-05s';

describe.skipIf(!hasBrowser)(
  'reduced motion shortens component animations without !important',
  () => {
    it('sheet content animates normally, then with the reduced duration', async () => {
      await withPage(
        styles,
        '<div class="mizu-sheet__content" data-side="right" id="t"></div>',
        async (page) => {
          expect(await computed(page, '#t', 'animation-name')).toBe('mizu-sheet-slide-in-right');
          expect(await computed(page, '#t', 'animation-duration')).not.toBe(REDUCED);
          await page.emulateMedia({ reducedMotion: 'reduce' });
          expect(await computed(page, '#t', 'animation-name')).toBe('mizu-sheet-slide-in-right');
          expect(await computed(page, '#t', 'animation-duration')).toBe(REDUCED);
        },
      );
    });

    it('popover root keeps the reduced duration on the element that animates', async () => {
      await withPage(
        styles,
        '<div class="mizu-popover" id="t"><span id="c">x</span></div>',
        async (page) => {
          expect(await computed(page, '#t', 'animation-name')).toBe('mizu-popover-in');
          await page.emulateMedia({ reducedMotion: 'reduce' });
          expect(await computed(page, '#t', 'animation-duration')).toBe(REDUCED);
          expect(await computed(page, '#c', 'animation-duration')).toBe(REDUCED);
        },
      );
    });

    it('indeterminate progress fill keeps its 30% width and the reduced duration', async () => {
      await withPage(
        styles,
        '<div class="mizu-progress" data-state="indeterminate"><div class="mizu-progress__track" style="width: 200px"><div class="mizu-progress__fill" id="t"></div></div></div>',
        async (page) => {
          expect(await computed(page, '#t', 'animation-name')).toBe('mizu-progress-indeterminate');
          expect(await computed(page, '#t', 'width')).toBe('60px');
          await page.emulateMedia({ reducedMotion: 'reduce' });
          expect(await computed(page, '#t', 'animation-duration')).toBe(REDUCED);
          expect(await computed(page, '#t', 'width')).toBe('60px');
        },
      );
    });
  },
);
