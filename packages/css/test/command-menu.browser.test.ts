import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

describe.skipIf(!hasBrowser)('command menu title', () => {
  it('dialog title is visually hidden', async () => {
    const styles = await withPage(
      [css('packages/css/dist/components/command-menu.css')],
      '<h2 class="mizu-command-menu__title">Command menu</h2>',
      async (page) => ({
        width: await computed(page, '.mizu-command-menu__title', 'width'),
        height: await computed(page, '.mizu-command-menu__title', 'height'),
        position: await computed(page, '.mizu-command-menu__title', 'position'),
        clip: await computed(page, '.mizu-command-menu__title', 'clip-path'),
      }),
    );
    expect(styles.width).toBe('1px');
    expect(styles.height).toBe('1px');
    expect(styles.position).toBe('absolute');
    expect(styles.clip).toBe('inset(50%)');
  });
});
