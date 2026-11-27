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

  it(
    'a focused invalid underline input turns only its bottom edge red',
    async () => {
      const sides = await withPage(
        STYLES(),
        `<input class="mizu-input mizu-input--underline" id="u" aria-invalid="true">`,
        async (page) => {
          await page.focus('#u');
          // Border colours transition; wait for the focus state to settle before reading.
          await page.waitForTimeout(400);
          return {
            top: await computed(page, '#u', 'border-top-color'),
            left: await computed(page, '#u', 'border-left-color'),
            right: await computed(page, '#u', 'border-right-color'),
            bottom: await computed(page, '#u', 'border-bottom-color'),
          };
        },
      );
      expect(sides.bottom).not.toBe(sides.top);
      expect(sides.top).toBe(sides.left);
      expect(sides.top).toBe(sides.right);
    },
    BROWSER_TIMEOUT,
  );

  it(
    'an invalid select trigger keeps the danger border while open',
    async () => {
      const result = await withPage(
        STYLES(),
        `<button class="mizu-select__trigger" id="open" data-state="open" aria-invalid="true">a</button>
         <input class="mizu-input" id="input" aria-invalid="true">`,
        async (page) => ({
          trigger: await computed(page, '#open', 'border-top-color'),
          input: await computed(page, '#input', 'border-top-color'),
        }),
      );
      expect(result.trigger).toBe(result.input);
    },
    BROWSER_TIMEOUT,
  );
});
