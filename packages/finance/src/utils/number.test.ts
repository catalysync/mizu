import { describe, expect, it } from 'vitest';
import { formatCompact } from './number';

describe('formatCompact', () => {
  it('formats millions', () => {
    expect(formatCompact(1234567)).toBe('1.2M');
  });

  it('formats billions', () => {
    expect(formatCompact(2500000000)).toBe('2.5B');
  });

  it('formats thousands', () => {
    expect(formatCompact(45000)).toBe('45.0K');
  });

  it('returns raw number below threshold', () => {
    expect(formatCompact(999)).toBe('999');
  });

  it('handles negatives', () => {
    expect(formatCompact(-1500000)).toBe('-1.5M');
  });
});
