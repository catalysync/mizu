import { describe, expect, it } from 'vitest';
import { css, hasBrowser, withPage } from './browser';

// Semantic colours are written as light-dark(light, dark) in the tokens sheet. These values are the
// ones the hand-written dark theme already shipped, so light and dark must resolve to them with or
// without a data-theme attribute.
const PAIRS: Record<string, [light: string, dark: string]> = {
  'surface-default': ['rgb(255, 255, 255)', 'rgb(2, 6, 23)'],
  'surface-secondary': ['rgb(248, 250, 252)', 'rgb(15, 23, 42)'],
  'surface-inverse': ['rgb(15, 23, 42)', 'rgb(255, 255, 255)'],
  'surface-hover': ['rgb(241, 245, 249)', 'rgb(30, 41, 59)'],
  'text-primary': ['rgb(15, 23, 42)', 'rgb(241, 245, 249)'],
  'text-secondary': ['rgb(71, 85, 105)', 'rgb(148, 163, 184)'],
  'text-inverse': ['rgb(255, 255, 255)', 'rgb(15, 23, 42)'],
  'text-disabled': ['rgb(148, 163, 184)', 'rgb(71, 85, 105)'],
  'text-tertiary': ['rgb(100, 116, 139)', 'rgb(148, 163, 184)'],
  'border-default': ['rgb(226, 232, 240)', 'rgb(30, 41, 59)'],
  'border-subtle': ['rgb(241, 245, 249)', 'rgb(15, 23, 42)'],
  'border-strong': ['rgb(148, 163, 184)', 'rgb(71, 85, 105)'],
  'feedback-success-default': ['rgb(5, 150, 105)', 'rgb(110, 231, 183)'],
  'feedback-success-subtle': ['rgb(236, 253, 245)', 'rgb(6, 78, 59)'],
  'feedback-warning-default': ['rgb(245, 158, 11)', 'rgb(252, 211, 77)'],
  'feedback-warning-subtle': ['rgb(255, 251, 235)', 'rgb(120, 53, 15)'],
  'feedback-danger-default': ['rgb(220, 38, 38)', 'rgb(252, 165, 165)'],
  'feedback-danger-subtle': ['rgb(254, 242, 242)', 'rgb(127, 29, 29)'],
  'feedback-info-default': ['rgb(37, 99, 235)', 'rgb(147, 197, 253)'],
  'feedback-info-subtle': ['rgb(239, 246, 255)', 'rgb(30, 58, 138)'],
};

const names = Object.keys(PAIRS);
const probes = (scope: string) =>
  names
    .map((n) => `<p class="probe ${scope}" data-n="${n}" style="color: var(--mizu-${n})"></p>`)
    .join('');

// Reads the computed colour of each probe inside a scope, keyed by token name.
const readScope = (page: import('playwright-core').Page, scope: string) =>
  page.$$eval(`.probe.${scope}`, (els) =>
    Object.fromEntries(
      els.map((el) => [(el as HTMLElement).dataset.n, getComputedStyle(el).color]),
    ),
  );

describe.skipIf(!hasBrowser)('semantic colours pair light and dark with light-dark()', () => {
  it('the token sheet pairs every listed colour with light-dark()', async () => {
    const vars = css('packages/tokens/dist/css/variables.css');
    for (const n of names) expect(vars).toMatch(new RegExp(`--mizu-${n}: light-dark\\(`));
  });

  it('light-dark() alone resolves to the light and dark values, with no theme sheet', async () => {
    const [light, dark] = await withPage(
      [css('packages/tokens/dist/css/variables.css')],
      `<div class="light">${probes('light')}</div><div class="dark" style="color-scheme: dark">${probes('dark')}</div>`,
      async (page) => [await readScope(page, 'light'), await readScope(page, 'dark')],
    );
    for (const n of names) {
      expect(light[n], `light ${n}`).toBe(PAIRS[n][0]);
      expect(dark[n], `dark ${n}`).toBe(PAIRS[n][1]);
    }
  });

  it('[data-theme="dark"] keeps the same dark values through the theme sheet', async () => {
    const dark = await withPage(
      [css('packages/tokens/dist/css/variables.css'), css('packages/tokens/dist/css/dark.css')],
      `<div class="themed" data-theme="dark">${probes('themed')}</div>`,
      (page) => readScope(page, 'themed'),
    );
    for (const n of names) expect(dark[n], `themed ${n}`).toBe(PAIRS[n][1]);
  });

  it('a light page still resolves to light values when the theme sheet is loaded', async () => {
    const light = await withPage(
      [css('packages/tokens/dist/css/variables.css'), css('packages/tokens/dist/css/dark.css')],
      `<div class="light">${probes('light')}</div>`,
      (page) => readScope(page, 'light'),
    );
    for (const n of names) expect(light[n], `light ${n}`).toBe(PAIRS[n][0]);
  });
  it('a colour-mix() over a paired token follows the scope it is used in', async () => {
    const [light, dark] = await withPage(
      [css('packages/tokens/dist/css/variables.css')],
      `<div class="light"><p class="mix" style="background-color: color-mix(in srgb, var(--mizu-text-primary) 50%, transparent)"></p></div><div style="color-scheme: dark"><p class="mix" style="background-color: color-mix(in srgb, var(--mizu-text-primary) 50%, transparent)"></p></div>`,
      async (page) => [
        await page.$eval('.light .mix', (el) => getComputedStyle(el).backgroundColor),
        await page.$eval('div[style] .mix', (el) => getComputedStyle(el).backgroundColor),
      ],
    );
    expect(light).toBe('color(srgb 0.0588235 0.0901961 0.164706 / 0.5)');
    expect(dark).toBe('color(srgb 0.945098 0.960784 0.976471 / 0.5)');
  });
});
