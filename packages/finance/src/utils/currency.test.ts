import { describe, expect, it } from 'vitest';
import { formatCurrency, formatAccounting } from './currency';

describe('formatCurrency', () => {
  it('formats positive USD', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('formats negative USD', () => {
    expect(formatCurrency(-500)).toBe('-$500.00');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('formatAccounting', () => {
  it('wraps negatives in parentheses', () => {
    expect(formatAccounting(-500)).toBe('($500.00)');
  });

  it('does not wrap positives', () => {
    expect(formatAccounting(1000)).toBe('$1,000.00');
  });
});
