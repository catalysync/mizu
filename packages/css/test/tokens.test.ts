import { describe, expect, it } from 'vitest';
import {
  blocks,
  contrast,
  darkTokens,
  read,
  resolve,
  rootTokens,
  stripComments,
  walk,
} from './helpers';

const STYLESHEET_PACKAGES = ['css', 'finance', 'commerce', 'charts'];
const THEME_SCOPED = /\[data-(mizu-theme|theme|mizu-identity|mizu-density)/;

const stylesheets = STYLESHEET_PACKAGES.flatMap((p) => walk(`packages/${p}/src`, ['.css']));
const sources = ['react', 'charts'].flatMap((p) =>
  walk(`packages/${p}/src`, ['.ts', '.tsx']).filter((f) => !f.includes('.test.')),
);

function definedEverywhere() {
  const defined = new Set(Object.keys(rootTokens()));
  for (const file of stylesheets) {
    for (const block of blocks(read(file))) {
      if (THEME_SCOPED.test(block.selector)) continue; // only exists while a theme is active
      Object.keys(block.declarations).forEach((name) => defined.add(name));
    }
  }
  for (const file of sources) {
    for (const m of read(file).matchAll(/['"](--mizu-[a-z0-9-]+)['"]\s*[:\]]/g)) defined.add(m[1]);
  }
  return defined;
}

describe('token references', () => {
  // A var() without a fallback that names an undefined token resolves to the
  // property's initial value: transparent backgrounds, black text, no border.
  it('every var(--mizu-*) without a fallback names a token defined outside a theme', () => {
    const defined = definedEverywhere();
    const missing = new Map<string, Set<string>>();
    for (const file of [...stylesheets, ...sources]) {
      for (const m of stripComments(read(file)).matchAll(/var\(\s*(--mizu-[a-z0-9-]+)\s*\)/g)) {
        if (defined.has(m[1])) continue;
        if (!missing.has(m[1])) missing.set(m[1], new Set());
        missing.get(m[1])!.add(file);
      }
    }
    expect(Object.fromEntries([...missing].map(([k, v]) => [k, [...v]]))).toEqual({});
  });

  it('the info feedback family matches success, warning and danger', () => {
    const tokens = rootTokens();
    for (const tone of ['success', 'warning', 'danger', 'info']) {
      expect(tokens).toHaveProperty(`--mizu-feedback-${tone}-default`);
      expect(tokens).toHaveProperty(`--mizu-feedback-${tone}-subtle`);
    }
  });

  it('defines the semantic roles products override for hover and on-primary text', () => {
    const tokens = rootTokens();
    expect(tokens).toHaveProperty('--mizu-surface-hover');
    expect(tokens).toHaveProperty('--mizu-text-on-primary');
  });
});

describe('new semantic tokens are readable', () => {
  it.each([
    ['light', rootTokens],
    ['dark', darkTokens],
  ])('%s text-tertiary meets WCAG AA (4.5:1) on surface-default', (_, tokens) => {
    const t = tokens();
    const ratio = contrast(
      resolve(t, '--mizu-text-tertiary'),
      resolve(t, '--mizu-surface-default'),
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('text-on-primary meets AA on the primary action colour in both modes', () => {
    for (const t of [rootTokens(), darkTokens()]) {
      const ratio = contrast(
        resolve(t, '--mizu-text-on-primary'),
        resolve(t, '--mizu-action-primary-default'),
      );
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });
});
