import { describe, expect, it } from 'vitest';
import { css } from './browser';
import { read, walk } from './helpers';

const sources = walk('packages/css/src', ['.css']);

describe('focus ring', () => {
  it('no stylesheet hard-codes a 2px solid outline', () => {
    const offenders = sources.filter((f) => /outline:\s*2px solid/.test(read(f)));
    expect(offenders).toEqual([]);
  });

  it('component and layout outlines read colour and width from the focus tokens', () => {
    for (const file of sources.filter((f) => !f.includes('/themes/'))) {
      for (const m of read(file).matchAll(/outline:\s*([^;]+);/g)) {
        if (m[1].trim() === 'none') continue;
        expect(m[1], file).toContain('--mizu-focus-ring-');
      }
    }
  });

  it('the token sheet defines the focus ring tokens', () => {
    const tokens = css('packages/tokens/dist/css/variables.css');
    expect(tokens).toMatch(/--mizu-focus-ring-color:\s*var\(--mizu-action-primary-default\)/);
    expect(tokens).toMatch(/--mizu-focus-ring-width:\s*2px/);
    expect(tokens).toMatch(/--mizu-focus-ring-offset:\s*2px/);
  });
});
