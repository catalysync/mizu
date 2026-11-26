import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';
import { repo } from './helpers';

// Each case launches Chromium; turbo runs test files in parallel, so allow more than the 5s default.
const BROWSER_TIMEOUT = 30_000;
const BUTTON = '<button class="mizu-button mizu-button--primary">Save</button>';
const CONSUMER = '.mizu-button{background:red}';

// Mizu sits in cascade layers, so an unlayered consumer rule wins over any mizu rule.
describe.skipIf(!hasBrowser)('cascade layers', () => {
  // The consumer sheet comes first in source order, so only the cascade layers can make it win.
  it(
    'unlayered consumer CSS overrides mizu.css',
    async () => {
      const bg = await withPage([CONSUMER, css('packages/css/dist/mizu.css')], BUTTON, (page) =>
        computed(page, '.mizu-button', 'background-color'),
      );
      expect(bg).toBe('rgb(255, 0, 0)');
    },
    BROWSER_TIMEOUT,
  );

  it(
    'unlayered consumer CSS overrides a single per-file sheet',
    async () => {
      const bg = await withPage(
        [CONSUMER, css('packages/css/dist/components/button.css')],
        BUTTON,
        (page) => computed(page, '.mizu-button', 'background-color'),
      );
      expect(bg).toBe('rgb(255, 0, 0)');
    },
    BROWSER_TIMEOUT,
  );

  // Tokens are layered too, so a theme set on <html> beats the :root token block.
  it(
    'a theme attribute on the root element overrides the token defaults',
    async () => {
      const tokens = css('packages/tokens/dist/css/variables.css');
      const dark = css('packages/css/dist/themes/dark.css');
      for (const styles of [
        [tokens, dark],
        [dark, tokens],
      ]) {
        const [light, themed] = await withPage(
          styles,
          '<div class="probe">x</div>',
          async (page) => {
            const read = () =>
              page.evaluate(() =>
                getComputedStyle(document.documentElement)
                  .getPropertyValue('--mizu-surface-default')
                  .trim(),
              );
            const before = await read();
            await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
            return [before, await read()];
          },
        );
        expect(themed).not.toBe('');
        expect(themed).not.toBe(light);
      }
    },
    BROWSER_TIMEOUT,
  );
});

describe('dist layer wrapping', () => {
  const dirs = ['components', 'layouts', 'shell', 'themes'];
  const perFile = [
    ...dirs.flatMap((d) =>
      readdirSync(join(repo, 'packages/css/src', d))
        .filter((f) => f.endsWith('.css'))
        .map((f) => join('packages/css/dist', d, f)),
    ),
    'packages/css/dist/typography.css',
  ];

  it.each(perFile)('%s starts with an @layer mizu. block', (rel) => {
    const text = readFileSync(join(repo, rel), 'utf8');
    expect(text.startsWith('@layer mizu.')).toBe(true);
  });

  it('dist/mizu.css defines the layer order before any layer block', () => {
    const text = readFileSync(join(repo, 'packages/css/dist/mizu.css'), 'utf8');
    expect(
      text.startsWith('@layer mizu.tokens, mizu.base, mizu.components, mizu.shell, mizu.identity;'),
    ).toBe(true);
    expect(text).not.toMatch(/@import/);
  });
});
