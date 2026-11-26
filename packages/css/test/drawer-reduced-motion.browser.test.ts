import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = [css('packages/tokens/dist/css/variables.css'), css('packages/css/dist/mizu.css')];
const REDUCED = '1e-05s';

describe.skipIf(!hasBrowser)('drawer motion', () => {
  it('panel slides in normally, then with the reduced duration', async () => {
    await withPage(
      styles,
      '<div class="mizu-drawer__content" data-side="right" id="t"></div>',
      async (page) => {
        expect(await computed(page, '#t', 'animation-name')).toBe('mizu-drawer-slide-in-right');
        expect(await computed(page, '#t', 'animation-duration')).not.toBe(REDUCED);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        expect(await computed(page, '#t', 'animation-name')).toBe('mizu-drawer-slide-in-right');
        expect(await computed(page, '#t', 'animation-duration')).toBe(REDUCED);
      },
    );
  });

  it('overlay fade gets the reduced duration', async () => {
    await withPage(styles, '<div class="mizu-drawer__overlay" id="t"></div>', async (page) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      expect(await computed(page, '#t', 'animation-duration')).toBe(REDUCED);
    });
  });
});
