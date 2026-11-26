import { describe, expect, it } from 'vitest';
// The same detector the mizu/no-hex-color stylelint rule uses, so the test and the lint agree.
import { findHexColour } from '../../lint/src/css/values.mjs';
import { read, stripComments, walk } from './helpers';

// Themes are where raw colour values are meant to live. Everywhere else a colour is a token,
// or a hex inside a var() fallback, which findHexColour ignores.
describe('substrate CSS', () => {
  it('has no hex colour outside themes and var() fallbacks', () => {
    const offenders = walk('packages/css/src', ['.css'])
      .filter((file) => !file.includes('/themes/'))
      .flatMap((file) =>
        [...stripComments(read(file)).matchAll(/([a-z-]+)\s*:\s*([^;{}]+)(?=[;}])/gi)]
          .map((m) => ({ prop: m[1], hex: findHexColour(m[2]) }))
          .filter((d) => d.hex !== null)
          .map((d) => `${file}: ${d.prop} ${d.hex}`),
      );
    expect(offenders).toEqual([]);
  });
});
