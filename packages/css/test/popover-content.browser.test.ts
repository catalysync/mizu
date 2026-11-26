import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const BROWSER_TIMEOUT = 30_000;
const PANEL = '<div class="mizu-popover-content" id="panel">Calendar</div>';

// DatePicker and DateRangePicker portal a bare .mizu-popover-content; without this rule the panel is transparent.
describe.skipIf(!hasBrowser)('popover content surface', () => {
  it(
    'takes the surface token colour as its background',
    async () => {
      const [bg, expected, z] = await withPage(
        [
          css('packages/tokens/dist/css/variables.css'),
          css('packages/css/src/components/popover.css'),
        ],
        PANEL,
        async (page) => {
          const bgValue = await computed(page, '#panel', 'background-color');
          const token = await page.evaluate(() => {
            const probe = document.createElement('div');
            probe.style.backgroundColor = 'var(--mizu-surface-default)';
            document.body.append(probe);
            const value = getComputedStyle(probe).backgroundColor;
            probe.remove();
            return value;
          });
          const zIndex = await computed(page, '#panel', 'z-index');
          return [bgValue, token, zIndex] as const;
        },
      );
      expect(bg).not.toBe('rgba(0, 0, 0, 0)');
      expect(bg).toBe(expected);
      expect(z).not.toBe('auto');
    },
    BROWSER_TIMEOUT,
  );
});
