import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

// Select trigger heights come from the control height tokens, one per data-size value.
const BROWSER_TIMEOUT = 30_000;

describe.skipIf(!hasBrowser)('select trigger sizes', () => {
  it(
    'each data-size gives the trigger its control height token',
    async () => {
      const heights = await withPage(
        [css('packages/tokens/dist/css/variables.css'), css('packages/css/dist/mizu.css')],
        `<button class="mizu-select__trigger" data-size="sm" id="sm">a</button>
         <button class="mizu-select__trigger" data-size="md" id="md">a</button>
         <button class="mizu-select__trigger" data-size="lg" id="lg">a</button>`,
        async (page) => ({
          sm: await computed(page, '#sm', 'height'),
          md: await computed(page, '#md', 'height'),
          lg: await computed(page, '#lg', 'height'),
        }),
      );
      expect(heights).toEqual({ sm: '32px', md: '40px', lg: '44px' });
    },
    BROWSER_TIMEOUT,
  );
});

describe.skipIf(!hasBrowser)('select trigger sizes without the tokens sheet', () => {
  it(
    'keeps the documented heights when only the component sheet is loaded',
    async () => {
      const heights = await withPage(
        [css('packages/css/dist/mizu.css')],
        `<button class="mizu-select__trigger" data-size="sm" id="sm">a</button>
         <button class="mizu-select__trigger" id="md">a</button>
         <button class="mizu-select__trigger" data-size="lg" id="lg">a</button>`,
        async (page) => ({
          sm: await computed(page, '#sm', 'height'),
          md: await computed(page, '#md', 'height'),
          lg: await computed(page, '#lg', 'height'),
        }),
      );
      expect(heights).toEqual({ sm: '32px', md: '40px', lg: '44px' });
    },
    BROWSER_TIMEOUT,
  );
});
