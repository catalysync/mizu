import { describe, expect, it } from 'vitest';
import { read, walk } from './helpers';

// `--mizu-surface-primary` is kept as a token alias for existing consumers, but
// component and theme stylesheets must use `--mizu-surface-default`.
describe('surface tokens', () => {
  it('no stylesheet under packages/css/src references surface-primary', () => {
    const offenders = walk('packages/css/src', ['.css']).filter((file) =>
      read(file).includes('surface-primary'),
    );
    expect(offenders).toEqual([]);
  });
});
