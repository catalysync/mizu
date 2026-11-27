import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = [css('packages/tokens/dist/css/variables.css'), css('packages/css/dist/mizu.css')];

describe.skipIf(!hasBrowser)('app header height', () => {
  it('defaults to 3.5rem (56px) and follows --mizu-app-header-height', async () => {
    await withPage(
      styles,
      '<header class="mizu-app-header" id="default"></header>' +
        '<div style="--mizu-app-header-height: 4rem"><header class="mizu-app-header" id="custom"></header></div>',
      async (page) => {
        expect(await computed(page, '#default', 'height')).toBe('56px');
        expect(await computed(page, '#custom', 'height')).toBe('64px');
      },
    );
  });
});
