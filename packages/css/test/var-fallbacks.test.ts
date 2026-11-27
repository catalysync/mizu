import { describe, expect, it } from 'vitest';
import {
  addFallbacks,
  cssFiles,
  DEFAULT_DIRS,
  findBareColourVars,
  lightBranch,
  lightTokens,
  resolveLiteral,
} from '../../../scripts/codemods/add-var-fallbacks.mjs';
import { read, repo } from './helpers';

const tokens = lightTokens(read('packages/tokens/dist/css/variables.css'));
const files = cssFiles(DEFAULT_DIRS).map((f) => f.slice(repo.length));

describe('colour var fallbacks', () => {
  it.each(files)('%s: every colour var has a fallback', (file) => {
    const { needs, unresolved } = findBareColourVars(read(file), tokens);
    const missing = needs.map((n) => `${n.name} in ${n.prop}`);
    expect(missing).toEqual([]);
    expect(unresolved.map((u) => u.name)).toEqual([]);
  });

  it('takes the light side of a light-dark() pair', () => {
    expect(lightBranch('light-dark(#0f172a, #f1f5f9)')).toBe('#0f172a');
    expect(lightBranch('light-dark(rgb(0 0 0 / 5%), #fff)')).toBe('rgb(0 0 0 / 5%)');
    expect(lightBranch('#fff')).toBe('#fff');
  });

  it('the codemod writes the resolved light value as the fallback', () => {
    expect(resolveLiteral(tokens, '--mizu-text-primary').toLowerCase()).toBe('#0f172a');
    expect(resolveLiteral(tokens, '--mizu-focus-ring-color')).toBe(
      resolveLiteral(tokens, '--mizu-action-primary-default'),
    );
  });

  it('the codemod adds fallbacks only to colour vars and is idempotent', () => {
    const input = [
      '.a {',
      '  color: var(--mizu-text-primary);',
      '  border: var(--mizu-focus-ring-width) solid var(--mizu-border-default);',
      '  border-radius: var(--mizu-radius-md);',
      '  background: color-mix(in srgb, var(--mizu-text-primary) 6%, transparent);',
      '  box-shadow: var(--mizu-shadow-sm);',
      '  --_c: var(--mizu-text-secondary);',
      '  color: var(--mizu-text-inverse, #fff);',
      '  /* color: var(--mizu-action-primary-default); */',
      '}',
    ].join('\n');
    const once = addFallbacks(input, tokens);
    expect(once.unresolved).toEqual([]);
    expect(once.added).toBe(5);
    expect(once.css).toContain('color: var(--mizu-text-primary, #0f172a);');
    expect(once.css).toContain('box-shadow: var(--mizu-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 5%));');
    expect(once.css).toContain(
      'border: var(--mizu-focus-ring-width) solid var(--mizu-border-default, #e2e8f0);',
    );
    expect(once.css).toContain('border-radius: var(--mizu-radius-md);');
    expect(once.css).toContain(
      'color-mix(in srgb, var(--mizu-text-primary, #0f172a) 6%, transparent)',
    );
    expect(once.css).toContain('--_c: var(--mizu-text-secondary, #475569);');
    expect(once.css).toContain('color: var(--mizu-text-inverse, #fff);');
    expect(once.css).toContain('/* color: var(--mizu-action-primary-default); */');
    const twice = addFallbacks(once.css, tokens);
    expect(twice.added).toBe(0);
    expect(twice.css).toBe(once.css);
  });
});
