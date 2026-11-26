import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

describe.skipIf(!hasBrowser)('badge in a browser', () => {
  const styles = () => [
    css('packages/tokens/dist/css/variables.css'),
    css('packages/css/dist/mizu.css'),
  ];

  it('renders the dot appearance as a solid 0.5rem marker', async () => {
    const [width, height, bg] = await withPage(
      styles(),
      `<span class="mizu-badge mizu-badge--success" data-size="md" data-appearance="dot"></span>`,
      async (page) => [
        await computed(page, '.mizu-badge', 'width'),
        await computed(page, '.mizu-badge', 'height'),
        await computed(page, '.mizu-badge', 'background-color'),
      ],
    );
    expect(width).toBe('8px');
    expect(height).toBe('8px');
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  it('gives md a 20px height and sm 16px', async () => {
    const [md, sm] = await withPage(
      styles(),
      `<span class="mizu-badge" data-size="md">m</span><span class="mizu-badge" data-size="sm">s</span>`,
      async (page) => [
        await page.$eval('[data-size="md"]', (el) => getComputedStyle(el).height),
        await page.$eval('[data-size="sm"]', (el) => getComputedStyle(el).height),
      ],
    );
    expect(md).toBe('20px');
    expect(sm).toBe('16px');
  });

  it('lets the public --mizu-badge-bg and --mizu-badge-fg tokens override the tone', async () => {
    const bg = await withPage(
      styles(),
      `<div style="--mizu-badge-bg: rgb(7, 8, 9); --mizu-badge-fg: rgb(10, 11, 12)"><span class="mizu-badge mizu-badge--danger">x</span></div>`,
      async (page) => [
        await computed(page, '.mizu-badge', 'background-color'),
        await computed(page, '.mizu-badge', 'color'),
      ],
    );
    expect(bg).toEqual(['rgb(7, 8, 9)', 'rgb(10, 11, 12)']);
  });
});
