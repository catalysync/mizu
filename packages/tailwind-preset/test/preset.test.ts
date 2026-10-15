import { compile } from '@tailwindcss/node';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const pkgDir = fileURLToPath(new URL('..', import.meta.url));

async function build(candidates: string[] = []) {
  const compiler = await compile('@import "tailwindcss";\n@import "./src/preset.css";\n', {
    base: pkgDir,
    onDependency: () => {},
  });
  return compiler.build(candidates);
}

// Split a selector list on top-level commas (not the ones inside :not(...)).
function splitSelectors(list: string) {
  const out: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of list) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(current.trim());
      current = '';
    } else current += ch;
  }
  return [...out, current.trim()];
}

// Every `selector { ... }` block whose selector list mentions `needle`.
function rulesFor(css: string, needle: string) {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selector]) => selector.includes(needle))
    .map(([, selector, body]) => ({ selector: selector.trim(), body }));
}

describe('tailwind v4 bridge', () => {
  // Tailwind v4's preflight dropped `cursor: pointer` on buttons, so every
  // button in a Tailwind + mizu app showed the arrow cursor. The bridge puts
  // the affordance back for enabled buttons only.
  it('restores cursor: pointer on enabled buttons in the base layer', async () => {
    const css = await build();
    const rules = rulesFor(css, 'button:not(:disabled)');
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.some((r) => /cursor:\s*pointer/.test(r.body))).toBe(true);
    expect(
      rules.some((r) =>
        splitSelectors(r.selector).some((s) => /^\[role="?button"?\]:not\(:disabled/.test(s)),
      ),
    ).toBe(true);
    const layerBase = css.indexOf('@layer base');
    expect(layerBase).toBeGreaterThanOrEqual(0);
    expect(css.indexOf('button:not(:disabled)')).toBeGreaterThan(layerBase);
  });

  it('does not give disabled buttons a pointer', async () => {
    const css = await build();
    const pointerButtonSelectors = rulesFor(css, 'button')
      .filter((r) => /cursor:\s*pointer/.test(r.body))
      .flatMap((r) => splitSelectors(r.selector))
      .filter((s) => /button/.test(s));
    expect(pointerButtonSelectors.length).toBeGreaterThan(0);
    for (const selector of pointerButtonSelectors) expect(selector).toMatch(/:not\(:disabled[,)]/);
  });

  it('still maps theme keys to mizu tokens', async () => {
    const css = await build(['bg-primary']);
    expect(css).toMatch(/--color-primary:\s*var\(--mizu-action-primary-default\)/);
    expect(css).toMatch(/\.bg-primary\s*\{[^}]*background-color:\s*var\(--color-primary\)/);
  });
});
