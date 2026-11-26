import { describe, expect, it } from 'vitest';
import { read, walk } from './helpers';

// Component rules win by cascade order and specificity. The only !important left is the
// manual reduced-motion toggle, which has to beat inline styles set by consumers.
describe('substrate CSS', () => {
  it('uses !important only in reduced-motion.css', () => {
    const offenders = walk('packages/css/src', ['.css'])
      .filter((file) => !file.endsWith('/reduced-motion.css'))
      .flatMap((file) =>
        read(file)
          .split('\n')
          .filter((line) => line.includes('!important'))
          .map((line) => `${file}: ${line.trim()}`),
      );
    expect(offenders).toEqual([]);
  });
});
