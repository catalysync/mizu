import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';
import { repo } from './helpers';

const buttonCss = readFileSync(join(repo, 'packages/css/src/components/button.css'), 'utf8');

describe('button tier-3 tokens', () => {
  it('declares no :root block and no --mizu-button-* property in the substrate', () => {
    expect(buttonCss).not.toMatch(/:root\s*\{/);
    expect(buttonCss).not.toMatch(/--mizu-button-[\w-]+\s*:/);
  });
});

describe.skipIf(!hasBrowser)('button tier-3 tokens in a browser', () => {
  const styles = () => [
    css('packages/tokens/dist/css/variables.css'),
    css('packages/css/dist/mizu.css'),
  ];

  it('follows a semantic token overridden on an ancestor', async () => {
    const bg = await withPage(
      styles(),
      `<div style="--mizu-action-primary-default: rgb(1, 2, 3)"><button class="mizu-button mizu-button--primary">x</button></div>`,
      (page) => computed(page, 'button', 'background-color'),
    );
    expect(bg).toBe('rgb(1, 2, 3)');
  });

  it('lets an ancestor set the public tier-3 token directly', async () => {
    const bg = await withPage(
      styles(),
      `<div style="--mizu-button-primary-bg: rgb(4, 5, 6)"><button class="mizu-button mizu-button--primary">x</button></div>`,
      (page) => computed(page, 'button', 'background-color'),
    );
    expect(bg).toBe('rgb(4, 5, 6)');
  });

  it('keeps the default primary colour when nothing is overridden', async () => {
    const bg = await withPage(
      styles(),
      `<button class="mizu-button mizu-button--primary">x</button>`,
      (page) => computed(page, 'button', 'background-color'),
    );
    expect(bg).toBe('rgb(37, 99, 235)');
  });
});
