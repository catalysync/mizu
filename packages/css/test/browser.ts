import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from 'playwright-core';
import { repo } from './helpers';

/**
 * Real-browser harness for cascade and computed-style checks that jsdom cannot do
 * (cascade layers, custom-property fallbacks, color-scheme). Uses a system Chromium:
 * set MIZU_CHROMIUM, or one of the standard paths must exist. Tests that need it use
 * `describe.skipIf(!hasBrowser)`; CI must provide a browser (MIZU_REQUIRE_BROWSER=1 fails instead of skipping).
 */
export const chromiumPath =
  process.env.MIZU_CHROMIUM ??
  ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find((p) =>
    existsSync(p),
  );

if (!chromiumPath && process.env.MIZU_REQUIRE_BROWSER === '1') {
  throw new Error('MIZU_REQUIRE_BROWSER=1 but no Chromium found (set MIZU_CHROMIUM)');
}

export const hasBrowser = Boolean(chromiumPath);

/** Built CSS from packages/css/dist (run the css build first), or any repo-relative file. */
export function css(rel: string) {
  return readFileSync(join(repo, rel), 'utf8');
}

/** Open a page with the given stylesheets (in order) and body HTML, then run `fn`. */
export async function withPage<T>(
  styles: string[],
  body: string,
  fn: (page: Page) => Promise<T>,
): Promise<T> {
  const { chromium } = await import('playwright-core');
  const browser = await chromium.launch({ executablePath: chromiumPath, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    const head = styles.map((s) => `<style>${s}</style>`).join('\n');
    await page.setContent(`<!doctype html><html><head>${head}</head><body>${body}</body></html>`);
    return await fn(page);
  } finally {
    await browser.close();
  }
}

/** getComputedStyle(el)[prop] for the first element matching `selector`. */
export function computed(page: Page, selector: string, prop: string) {
  return page.$eval(
    selector,
    (el, p) => getComputedStyle(el).getPropertyValue(p),
    prop,
  );
}
