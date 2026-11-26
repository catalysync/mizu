import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = [css('packages/tokens/dist/css/variables.css'), css('packages/css/dist/mizu.css')];
const body =
  '<span class="mizu-spinner" id="spinner"></span><span class="mizu-animate-spin" id="util"></span>';

// Chromium may serialise 0.01ms as 1e-05s; both mean "effectively instant".
const instant = ['0.01ms', '1e-05s'];

describe.skipIf(!hasBrowser)('reduced motion policy', () => {
  it('keeps the spinner turning, slower, under reduced motion', async () => {
    const duration = await withPage(styles, body, async (page) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      return computed(page, '#spinner', 'animation-duration');
    });
    expect(duration).toBe('2s');
  });

  it('finishes the .mizu-animate-spin utility immediately under reduced motion', async () => {
    const duration = await withPage(styles, body, async (page) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      return computed(page, '#util', 'animation-duration');
    });
    expect(instant).toContain(duration);
  });

  it('uses the normal spinner duration without reduced motion', async () => {
    const duration = await withPage(styles, body, async (page) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      return computed(page, '#spinner', 'animation-duration');
    });
    expect(duration).toBe('0.6s');
  });
});
