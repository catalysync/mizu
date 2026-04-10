export type DeltaIntent = 'positive' | 'negative' | 'neutral';

export function formatDelta(value: number, decimals = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(decimals)}%`;
}

export function deltaIntent(value: number): DeltaIntent {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}
