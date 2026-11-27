// Layout checks for the overlay stories, run in a real browser against a built storybook.
// Usage: pnpm --filter @mizunagara/storybook build && pnpm --filter @mizunagara/storybook test:layout
// The build must be fresh: the CSS is baked into storybook-static at build time.
// Set MIZU_STORYBOOK_URL to run against an already-deployed storybook instead of storybook-static.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './browser.mjs';
import { serveStatic } from './serve.mjs';

const STATIC_DIR = fileURLToPath(new URL('../../storybook-static', import.meta.url));
const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 375, height: 667 };

let browser;
let server;
let base;

before(async () => {
  if (process.env.MIZU_STORYBOOK_URL) {
    base = process.env.MIZU_STORYBOOK_URL.replace(/\/$/, '');
    const preflight = await fetch(`${base}/iframe.html`).catch((error) => error);
    if (!(preflight instanceof Response) || !preflight.ok) {
      throw new Error(
        `MIZU_STORYBOOK_URL does not serve iframe.html: ${preflight.status ?? preflight.message}`,
      );
    }
  } else {
    if (!existsSync(`${STATIC_DIR}/iframe.html`)) {
      throw new Error(
        'storybook-static is missing. Run `pnpm --filter @mizunagara/storybook build` first, or set MIZU_STORYBOOK_URL.',
      );
    }
    server = await serveStatic(STATIC_DIR);
    base = server.url;
  }
  browser = await launchBrowser();
});

after(async () => {
  await browser?.close();
  await server?.close();
});

/** Open one story in its own page. Overlay animations are waited out by `settle`, not disabled. */
async function openStory(id, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'load' });
  await page.waitForSelector('#storybook-root > *');
  return { page, close: () => context.close() };
}

/**
 * Wait for running animations (overlay fades, slide-ins, dialog zoom) to finish, so measurements are
 * of the final layout. The timeout stops an endless animation from hanging the run.
 */
function settle(page) {
  return page.evaluate(() =>
    Promise.race([
      Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))),
      new Promise((done) => setTimeout(done, 5000)),
    ]),
  );
}

/** Click the trigger, wait for the panel to mount, then wait for its animations to finish. */
async function openOverlay(page, triggerName, panelSelector) {
  await page.getByRole('button', { name: triggerName }).click();
  await page.waitForSelector(panelSelector);
  await settle(page);
}

/**
 * Width of the content box. The dialog has a 1px border outside its 32rem max-width, so the border
 * box that getBoundingClientRect reports is 2px wider than the token value.
 */
function contentWidth(page, selector) {
  return page.$eval(selector, (el) => {
    const cs = getComputedStyle(el);
    return (
      el.getBoundingClientRect().width -
      parseFloat(cs.borderLeftWidth) -
      parseFloat(cs.borderRightWidth)
    );
  });
}

/**
 * Wait until the element has been placed and stopped moving: its box is unchanged between two polls
 * and no animation is running. Floating UI places popovers after mount, so settle() can run too early.
 */
function waitForStill(page, selector) {
  return page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const key = `${r.left},${r.top},${r.width},${r.height}`;
      const running = document.getAnimations().some((a) => a.playState === 'running');
      const still = key === window.__mizuLastBox && r.top > 0 && !running;
      window.__mizuLastBox = key;
      return still;
    },
    selector,
    { polling: 100, timeout: 5000 },
  );
}

/** Box of the first element matching `selector`, in CSS pixels of the viewport. */
function box(page, selector) {
  return page.$eval(selector, (el) => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      width: r.width,
      height: r.height,
    };
  });
}

/**
 * Class list and test id of the element that is topmost at (x, y). An icon inside a button hits its
 * svg, so the nearest classed ancestor is what gets reported.
 */
function hitAt(page, x, y) {
  return page.evaluate(
    ([px, py]) => {
      const el = document.elementFromPoint(px, py);
      if (!el) return null;
      return {
        className: el.closest('[class]')?.getAttribute('class') ?? '',
        testId: el.closest('[data-test]')?.getAttribute('data-test') ?? null,
      };
    },
    [x, y],
  );
}

const near = (actual, expected, tolerance = 1) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );

describe('Modal dialog layout', () => {
  it('is 32rem wide and centred in the viewport', async () => {
    const { page, close } = await openStory('components-overlays-modal--default', DESKTOP);
    try {
      await openOverlay(page, 'Open modal', '.mizu-dialog__content');
      const content = await box(page, '.mizu-dialog__content');
      near(await contentWidth(page, '.mizu-dialog__content'), 512, 0.5);
      near((content.left + content.right) / 2, DESKTOP.width / 2);
      near((content.top + content.bottom) / 2, DESKTOP.height / 2);
    } finally {
      await close();
    }
  });

  it('shrinks to 90vw on a phone-width viewport', async () => {
    const { page, close } = await openStory('components-overlays-modal--default', PHONE);
    try {
      await openOverlay(page, 'Open modal', '.mizu-dialog__content');
      const content = await box(page, '.mizu-dialog__content');
      near(await contentWidth(page, '.mizu-dialog__content'), PHONE.width * 0.9, 1);
      assert.ok(
        content.left >= 0 && content.right <= PHONE.width,
        'dialog stays inside the viewport',
      );
    } finally {
      await close();
    }
  });

  it('paints a scrim over the whole viewport, outside the dialog', async () => {
    const { page, close } = await openStory('components-overlays-modal--default', DESKTOP);
    try {
      await openOverlay(page, 'Open modal', '.mizu-dialog__content');
      const overlay = await box(page, '.mizu-dialog__overlay');
      assert.deepEqual(
        [overlay.left, overlay.top, overlay.width, overlay.height],
        [0, 0, DESKTOP.width, DESKTOP.height],
      );
      const hit = await hitAt(page, 4, 4);
      assert.match(hit.className, /mizu-dialog__overlay/);
    } finally {
      await close();
    }
  });

  it('places the close button 24px square, 1rem in from the top-right corner', async () => {
    const { page, close } = await openStory('components-overlays-modal--default', DESKTOP);
    try {
      await openOverlay(page, 'Open modal', '.mizu-dialog__content');
      const content = await box(page, '.mizu-dialog__content');
      const closeBox = await box(page, '.mizu-dialog__close');
      near(closeBox.width, 24, 0.5);
      near(closeBox.height, 24, 0.5);
      near(content.right - closeBox.right, 16);
      near(closeBox.top - content.top, 16);
      const hit = await hitAt(
        page,
        closeBox.left + closeBox.width / 2,
        closeBox.top + closeBox.height / 2,
      );
      assert.match(hit.className, /mizu-dialog__close/);
    } finally {
      await close();
    }
  });

  it('keeps the title clear of the close button', async () => {
    const { page, close } = await openStory('components-overlays-modal--default', DESKTOP);
    try {
      await openOverlay(page, 'Open modal', '.mizu-dialog__content');
      const title = await box(page, '.mizu-dialog__title');
      const closeBox = await box(page, '.mizu-dialog__close');
      assert.ok(
        title.right <= closeBox.left,
        `title right ${title.right} overlaps close left ${closeBox.left}`,
      );
    } finally {
      await close();
    }
  });
});

describe('Sheet layout', () => {
  it('docks the right sheet to the right edge at 24rem', async () => {
    const { page, close } = await openStory('components-overlays-sheet--right', DESKTOP);
    try {
      await openOverlay(page, 'Open sheet', '.mizu-sheet__content[data-side="right"]');
      const panel = await box(page, '.mizu-sheet__content[data-side="right"]');
      near(panel.right, DESKTOP.width, 0.5);
      near(panel.top, 0, 0.5);
      near(panel.bottom, DESKTOP.height, 0.5);
      near(panel.width, 384, 0.5);
    } finally {
      await close();
    }
  });

  it('caps the right sheet at 90vw on a phone-width viewport', async () => {
    const { page, close } = await openStory('components-overlays-sheet--right', PHONE);
    try {
      await openOverlay(page, 'Open sheet', '.mizu-sheet__content[data-side="right"]');
      const panel = await box(page, '.mizu-sheet__content[data-side="right"]');
      near(panel.width, PHONE.width * 0.9, 1);
      near(panel.right, PHONE.width, 0.5);
    } finally {
      await close();
    }
  });

  it('docks the left sheet to the left edge', async () => {
    const { page, close } = await openStory('components-overlays-sheet--left', DESKTOP);
    try {
      await openOverlay(page, 'Open left', '.mizu-sheet__content[data-side="left"]');
      const panel = await box(page, '.mizu-sheet__content[data-side="left"]');
      near(panel.left, 0, 0.5);
      near(panel.width, 384, 0.5);
    } finally {
      await close();
    }
  });

  it('docks the bottom sheet to the bottom edge, full width, at most 90vh tall', async () => {
    const { page, close } = await openStory('components-overlays-sheet--bottom', DESKTOP);
    try {
      await openOverlay(page, 'Open bottom', '.mizu-sheet__content[data-side="bottom"]');
      const panel = await box(page, '.mizu-sheet__content[data-side="bottom"]');
      near(panel.bottom, DESKTOP.height, 0.5);
      near(panel.width, DESKTOP.width, 0.5);
      assert.ok(
        panel.height <= DESKTOP.height * 0.9 + 0.5,
        `bottom sheet height ${panel.height} exceeds 90vh`,
      );
    } finally {
      await close();
    }
  });

  it('places the close button 12px in from the top-right corner of a right sheet', async () => {
    const { page, close } = await openStory('components-overlays-sheet--right', DESKTOP);
    try {
      await openOverlay(page, 'Open sheet', '.mizu-sheet__content[data-side="right"]');
      const panel = await box(page, '.mizu-sheet__content[data-side="right"]');
      const closeBox = await box(page, '.mizu-sheet__close');
      near(closeBox.width, 28, 0.5);
      near(panel.right - closeBox.right, 12);
      near(closeBox.top - panel.top, 12);
      const hit = await hitAt(
        page,
        closeBox.left + closeBox.width / 2,
        closeBox.top + closeBox.height / 2,
      );
      assert.match(hit.className, /mizu-sheet__close/);
    } finally {
      await close();
    }
  });

  it('paints a scrim over the page outside the panel', async () => {
    const { page, close } = await openStory('components-overlays-sheet--right', DESKTOP);
    try {
      await openOverlay(page, 'Open sheet', '.mizu-sheet__content[data-side="right"]');
      const hit = await hitAt(page, 100, 400);
      assert.ok(hit, 'no element at (100, 400)');
      assert.match(hit.className, /mizu-sheet__overlay/);
    } finally {
      await close();
    }
  });
});

describe('stacked sheet scrim', () => {
  it('a second sheet scrim paints above the first sheet panel, and its panel above that scrim', async () => {
    const { page, close } = await openStory('components-overlays-sheet--right', DESKTOP);
    try {
      await openOverlay(page, 'Open sheet', '.mizu-sheet__content[data-side="right"]');
      const firstPanel = await box(page, '.mizu-sheet__content[data-side="right"]');

      // Stand-in for a sheet opened from inside the first one. There is no stacked story yet, so the
      // same classes are injected. pointer-events:auto mirrors the Radix layer that a nested
      // dialog gets while the body has pointer-events disabled.
      await page.evaluate(() => {
        document.body.insertAdjacentHTML(
          'beforeend',
          '<div class="mizu-sheet__overlay" data-test="stacked-overlay" style="pointer-events:auto"></div>' +
            '<div class="mizu-sheet__content" data-side="left" data-test="stacked-panel" style="pointer-events:auto">' +
            '<p>Nested</p></div>',
        );
      });

      await settle(page);

      const zIndices = await page.evaluate(() => ({
        firstPanel: getComputedStyle(
          document.querySelector('.mizu-sheet__content[data-side="right"]'),
        ).zIndex,
        stackedOverlay: getComputedStyle(document.querySelector('[data-test="stacked-overlay"]'))
          .zIndex,
      }));
      assert.equal(zIndices.stackedOverlay, zIndices.firstPanel);

      const overFirstPanel = await hitAt(page, (firstPanel.left + firstPanel.right) / 2, 400);
      assert.equal(
        overFirstPanel.testId,
        'stacked-overlay',
        'nested scrim must cover the first panel',
      );

      const overNestedPanel = await hitAt(page, 100, 400);
      assert.equal(
        overNestedPanel.testId,
        'stacked-panel',
        'nested panel must be hit-testable above its scrim',
      );
    } finally {
      await close();
    }
  });
});

describe('Popover layout', () => {
  it('opens below its trigger, centred on it, offset by sideOffset plus the arrow', async () => {
    const { page, close } = await openStory('components-overlays-popover--default', DESKTOP);
    try {
      const trigger = page.getByRole('button', { name: 'Edit name' });
      await trigger.click();
      await page.waitForSelector('.mizu-popover[data-side="bottom"]');
      await waitForStill(page, '.mizu-popover');
      const triggerBox = await trigger.boundingBox();
      const content = await box(page, '.mizu-popover');
      // Radix adds the arrow height to sideOffset (6px), so the gap is 6px plus the measured arrow.
      const arrow = await box(page, '.mizu-popover__arrow');
      near(content.top - (triggerBox.y + triggerBox.height), 6 + arrow.height, 1);
      near((content.left + content.right) / 2, triggerBox.x + triggerBox.width / 2, 1);
    } finally {
      await close();
    }
  });

  it('stays inside a narrow viewport', async () => {
    const { page, close } = await openStory('components-overlays-popover--default', {
      width: 320,
      height: 568,
    });
    try {
      await openOverlay(page, 'Edit name', '.mizu-popover');
      await waitForStill(page, '.mizu-popover');
      const content = await box(page, '.mizu-popover');
      assert.ok(content.left >= 0, `popover left edge ${content.left} is off screen`);
      assert.ok(content.right <= 320, `popover right edge ${content.right} is off screen`);
    } finally {
      await close();
    }
  });
});
