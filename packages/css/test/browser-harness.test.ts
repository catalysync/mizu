import { describe, expect, it } from 'vitest';
import { computed, hasBrowser, withPage } from './browser';

describe.skipIf(!hasBrowser)('browser harness', () => {
  it('computes styles in a real browser', async () => {
    const bg = await withPage(
      ['.x { background-color: rgb(1, 2, 3); }'],
      '<div class="x">x</div>',
      (page) => computed(page, '.x', 'background-color'),
    );
    expect(bg).toBe('rgb(1, 2, 3)');
  });
});
