import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = () => [
  css('packages/tokens/dist/css/variables.css'),
  css('packages/css/dist/mizu.css'),
];

const button = `<button class="mizu-button mizu-button--md">x</button>`;
const px = (value: string) => parseFloat(value);

describe.skipIf(!hasBrowser)('density in a browser', () => {
  it('compact tightens computed button padding', async () => {
    const [def, compact] = await withPage(
      styles(),
      `${button}<div data-mizu-density="compact">${button}</div>`,
      async (page) => [
        px(await computed(page, 'button.mizu-button', 'padding-left')),
        px(
          await page.$eval(
            'div[data-mizu-density="compact"] button',
            (el) => getComputedStyle(el).paddingLeft,
          ),
        ),
      ],
    );
    expect(def).toBeCloseTo(16, 1);
    expect(compact).toBeCloseTo(14, 0);
    expect(compact).toBeLessThan(def);
  });

  it('comfortable loosens computed button padding', async () => {
    const padding = await withPage(
      styles(),
      `<div data-mizu-density="comfortable">${button}</div>`,
      (page) => page.$eval('button', (el) => parseFloat(getComputedStyle(el).paddingLeft)),
    );
    expect(padding).toBeCloseTo(18, 0);
  });

  it('density does not change font size', async () => {
    const [def, compact, comfortable] = await withPage(
      styles(),
      `${button}<div data-mizu-density="compact">${button}</div><div data-mizu-density="comfortable">${button}</div>`,
      (page) => page.$$eval('button', (els) => els.map((el) => getComputedStyle(el).fontSize)),
    );
    expect(compact).toBe(def);
    expect(comfortable).toBe(def);
  });

  it('density does not change the computed height', async () => {
    const [def, compact] = await withPage(
      styles(),
      `${button}<div data-mizu-density="compact">${button}</div>`,
      (page) => page.$$eval('button', (els) => els.map((el) => getComputedStyle(el).height)),
    );
    expect(compact).toBe(def);
  });
});
