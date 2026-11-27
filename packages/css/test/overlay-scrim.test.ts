import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';
import { read, stripComments, walk } from './helpers';

const componentFiles = walk('packages/css/src/components', ['.css']);

/** Every rule whose selector names an overlay part (`.mizu-*__overlay`). */
function overlayRules() {
  const rules: { file: string; selector: string; body: string }[] = [];
  for (const file of componentFiles) {
    for (const m of stripComments(read(file)).matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      const selector = m[1].trim();
      if (/__overlay\b/.test(selector)) rules.push({ file, selector, body: m[2] });
    }
  }
  return rules;
}

describe('overlay scrim', () => {
  it('no component CSS hard-codes an rgba(0 scrim', () => {
    const hits = componentFiles.filter((f) => /rgba\(0/.test(read(f)));
    expect(hits).toEqual([]);
  });

  it('finds the overlay rules it is meant to cover', () => {
    const files = new Set(overlayRules().map((r) => r.file));
    for (const name of ['dialog', 'alert-dialog', 'command-menu', 'sheet', 'drawer']) {
      expect(files).toContain(`packages/css/src/components/${name}.css`);
    }
  });

  it('every __overlay rule paints the shared scrim token and blur token', () => {
    const rules = overlayRules().filter((r) => /\bbackground\s*:/.test(r.body));
    expect(rules.length).toBeGreaterThanOrEqual(5);
    for (const rule of rules) {
      expect(rule.body, `${rule.file} ${rule.selector}`).toMatch(
        /background:\s*var\(--mizu-overlay-scrim,\s*rgb\(0 0 0 \/ 50%\)\)/,
      );
      expect(rule.body, `${rule.file} ${rule.selector}`).toMatch(
        /backdrop-filter:\s*blur\(var\(--mizu-overlay-scrim-blur,\s*0\)\)/,
      );
    }
  });
});

describe.skipIf(!hasBrowser)('overlay scrim in a real browser', () => {
  const styles = (extra = '') => [
    css('packages/tokens/dist/css/variables.css'),
    css('packages/css/dist/components/dialog.css'),
    css('packages/css/dist/components/command-menu.css'),
    extra,
  ];

  it('paints the scrim token, and a theme override of the token changes every overlay', async () => {
    const body =
      '<div class="mizu-dialog__overlay" id="d"></div><div class="mizu-command-menu__overlay" id="c"></div>';
    await withPage(styles(), body, async (page) => {
      expect(await computed(page, '#d', 'background-color')).toBe('rgba(0, 0, 0, 0.5)');
      expect(await computed(page, '#c', 'background-color')).toBe('rgba(0, 0, 0, 0.5)');
    });
    await withPage(
      styles(':root { --mizu-overlay-scrim: rgb(255 0 0 / 20%); }'),
      body,
      async (page) => {
        expect(await computed(page, '#d', 'background-color')).toBe('rgba(255, 0, 0, 0.2)');
        expect(await computed(page, '#c', 'background-color')).toBe('rgba(255, 0, 0, 0.2)');
      },
    );
  }, 30_000);

  it('applies the blur token as a backdrop filter', async () => {
    await withPage(
      styles(':root { --mizu-overlay-scrim-blur: 4px; }'),
      '<div class="mizu-dialog__overlay" id="d"></div>',
      async (page) => {
        expect(await computed(page, '#d', 'backdrop-filter')).toBe('blur(4px)');
      },
    );
  }, 30_000);
});
