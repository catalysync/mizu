import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

// Real-browser check for the shared invalid look: aria-invalid in form.css gives every form control
// the same danger border, with no per-component class. Each case launches Chromium.
const BROWSER_TIMEOUT = 30_000;
const STYLES = () => [
  css('packages/tokens/dist/css/variables.css'),
  css('packages/css/dist/mizu.css'),
];

describe.skipIf(!hasBrowser)('aria-invalid form controls', () => {
  it(
    'aria-invalid gives an input and a textarea the same danger border as each other, not the plain one',
    async () => {
      const result = await withPage(
        STYLES(),
        `<input class="mizu-input" id="input" aria-invalid="true">
         <textarea class="mizu-textarea" id="ta" aria-invalid="true"></textarea>
         <input class="mizu-input" id="plain">`,
        async (page) => ({
          input: await computed(page, '#input', 'border-top-color'),
          textarea: await computed(page, '#ta', 'border-top-color'),
          plain: await computed(page, '#plain', 'border-top-color'),
        }),
      );
      expect(result.input).toBe(result.textarea);
      expect(result.input).not.toBe(result.plain);
    },
    BROWSER_TIMEOUT,
  );

  it(
    'aria-invalid gives a select trigger the same danger border as an input',
    async () => {
      const result = await withPage(
        STYLES(),
        `<input class="mizu-input" id="input" aria-invalid="true">
         <button class="mizu-select__trigger" id="trigger" aria-invalid="true">a</button>`,
        async (page) => ({
          input: await computed(page, '#input', 'border-top-color'),
          trigger: await computed(page, '#trigger', 'border-top-color'),
        }),
      );
      expect(result.trigger).toBe(result.input);
    },
    BROWSER_TIMEOUT,
  );
});
