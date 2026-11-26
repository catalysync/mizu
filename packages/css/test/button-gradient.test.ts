import { describe, expect, it } from 'vitest';
import { read, stripComments } from './helpers';

const button = read('packages/css/src/components/button.css');
const HEX = /#[0-9a-fA-F]{3,8}\b/g;

// Hex colours are allowed only as the fallback argument of a var() call.
const withoutVarFallbacks = (css: string) => stripComments(css).replace(/var\([^()]*\)/g, '');

describe('button.css colour substrate', () => {
  it('has no hex colour outside a var() fallback', () => {
    expect(withoutVarFallbacks(button).match(HEX) ?? []).toEqual([]);
  });

  const gradientBlock = stripComments(button).match(/\.mizu-button--gradient\s*\{([^}]*)\}/)?.[1] ?? '';

  it('keeps the gradient free of brand colours', () => {
    expect(gradientBlock).toContain('linear-gradient(');
    expect(gradientBlock.match(HEX) ?? []).toEqual([]);
  });

  it('takes gradient stops from theme tokens with action colour fallbacks', () => {
    const oneLine = gradientBlock.replace(/\s+/g, ' ');
    expect(oneLine).toContain(
      'var(--mizu-button-gradient-from, var(--mizu-action-primary-default)) 0%, var(--mizu-button-gradient-to, var(--mizu-action-primary-hover)) 100%',
    );
    expect(oneLine).toContain(
      'var(--mizu-button-gradient-from, var(--mizu-action-primary-hover)) 0%, var(--mizu-button-gradient-to, var(--mizu-action-primary-active)) 100%',
    );
  });

  it('does not declare the gradient from/to stops in the substrate', () => {
    const declared = stripComments(button).match(/--mizu-button-gradient-(from|to)\s*:/g);
    expect(declared ?? []).toEqual([]);
  });
});
