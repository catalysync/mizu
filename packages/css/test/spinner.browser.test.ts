import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = [css('packages/tokens/dist/css/variables.css'), css('packages/css/dist/mizu.css')];
const body = '<span class="mizu-spinner mizu-spinner--size-md" id="spinner"></span>';

// Reduced motion slows the spinner but never stops it: loading state must stay visible.
describe.skipIf(!hasBrowser)('spinner reduced-motion policy', () => {
  it('spins normally without reduced motion', async () => {
    const values = await withPage(styles, body, async (page) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      return {
        name: await computed(page, '#spinner', 'animation-name'),
        duration: await computed(page, '#spinner', 'animation-duration'),
        count: await computed(page, '#spinner', 'animation-iteration-count'),
      };
    });
    expect(values).toEqual({ name: 'mizu-spinner-spin', duration: '0.6s', count: 'infinite' });
  });

  it('keeps spinning, slower and infinite, under reduced motion', async () => {
    const values = await withPage(styles, body, async (page) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      return {
        name: await computed(page, '#spinner', 'animation-name'),
        duration: await computed(page, '#spinner', 'animation-duration'),
        count: await computed(page, '#spinner', 'animation-iteration-count'),
      };
    });
    expect(values).toEqual({ name: 'mizu-spinner-spin', duration: '2s', count: 'infinite' });
  });
});
