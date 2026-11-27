import { describe, expect, it } from 'vitest';
import { blocks, read, rootTokens, walk } from './helpers';

// Ordered from the bottom of the stack to the top. Overlays portal above
// modals and drawers, so dropdown and popover sit higher than modal.
const SCALE: [string, number][] = [
  ['base', 0],
  ['sticky', 10],
  ['header', 20],
  ['sidebar', 25],
  ['overlay', 1000],
  ['drawer', 1100],
  ['modal', 1200],
  ['dropdown', 1300],
  ['popover', 1400],
  ['hover-card', 1450],
  ['tooltip', 1500],
  ['toast', 1600],
  ['above-all', 9999],
];

describe('z-index scale', () => {
  it('ships every tier from the tokens output with the documented value', () => {
    const tokens = rootTokens();
    for (const [name, value] of SCALE) {
      expect(tokens, name).toHaveProperty(`--mizu-z-${name}`, String(value));
    }
  });

  it('keeps the tiers strictly increasing in stacking order', () => {
    const values = SCALE.map(([name]) => Number(rootTokens()[`--mizu-z-${name}`]));
    for (let i = 1; i < values.length; i++) {
      expect(values[i], `${SCALE[i][0]} above ${SCALE[i - 1][0]}`).toBeGreaterThan(values[i - 1]);
    }
  });

  it('does not redeclare the tiers in any stylesheet', () => {
    const stylesheets = walk('packages/css/src', ['.css']);
    const redeclared = stylesheets.filter((file) =>
      blocks(read(file)).some((block) =>
        Object.keys(block.declarations).some((name) => name.startsWith('--mizu-z-')),
      ),
    );
    expect(redeclared).toEqual([]);
  });
});
