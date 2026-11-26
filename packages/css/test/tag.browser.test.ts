import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';
import { repo } from './helpers';

const tagCss = readFileSync(join(repo, 'packages/css/src/components/tag.css'), 'utf8');

describe('tag tone rules', () => {
  it('defines a class for every tone the React binding emits', () => {
    for (const tone of ['neutral', 'success', 'warning', 'danger', 'info']) {
      expect(tagCss).toMatch(new RegExp(`\\.mizu-tag--${tone}\\s*\\{`));
    }
  });

  it('defines the label and dismiss element rules', () => {
    expect(tagCss).toMatch(/\.mizu-tag__label\s*\{/);
    expect(tagCss).toMatch(/\.mizu-tag__dismiss\s*\{/);
    expect(tagCss).not.toMatch(/mizu-tag__remove/);
  });
});

describe.skipIf(!hasBrowser)('tag in a browser', () => {
  const styles = () => [
    css('packages/tokens/dist/css/variables.css'),
    css('packages/css/dist/mizu.css'),
  ];

  const tones = ['neutral', 'success', 'warning', 'danger', 'info'] as const;

  it('gives each tone a different computed background', async () => {
    const bgs: string[] = [];
    for (const tone of tones) {
      bgs.push(
        await withPage(styles(), `<span class="mizu-tag mizu-tag--${tone}">x</span>`, (page) =>
          computed(page, 'span', 'background-color'),
        ),
      );
    }
    expect(new Set(bgs).size).toBe(tones.length);
  });

  it('colours the success tone from the feedback tokens', async () => {
    const bg = await withPage(
      styles(),
      `<span class="mizu-tag mizu-tag--success">x</span>`,
      (page) => computed(page, 'span', 'background-color'),
    );
    const expected = await withPage(
      styles(),
      `<span style="background-color: var(--mizu-feedback-success-subtle)"></span>`,
      (page) => computed(page, 'span', 'background-color'),
    );
    expect(bg).toBe(expected);
  });

  it('keeps the neutral background when no tone class is given', async () => {
    const bg = await withPage(styles(), `<span class="mizu-tag">x</span>`, (page) =>
      computed(page, 'span', 'background-color'),
    );
    const expected = await withPage(
      styles(),
      `<span class="mizu-tag mizu-tag--neutral">x</span>`,
      (page) => computed(page, 'span', 'background-color'),
    );
    expect(bg).toBe(expected);
  });

  it('lets the dismiss button inherit the tone text colour', async () => {
    const color = await withPage(
      styles(),
      `<span class="mizu-tag mizu-tag--danger"><span class="mizu-tag__label">x</span><button class="mizu-tag__dismiss">r</button></span>`,
      (page) => computed(page, 'button', 'color'),
    );
    const expected = await withPage(
      styles(),
      `<span class="mizu-tag mizu-tag--danger">x</span>`,
      (page) => computed(page, 'span', 'color'),
    );
    expect(color).toBe(expected);
  });
});
