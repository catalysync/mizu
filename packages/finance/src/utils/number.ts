const thresholds: [number, string][] = [
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K'],
];

export function formatCompact(value: number, decimals = 1): string {
  const abs = Math.abs(value);
  for (const [threshold, suffix] of thresholds) {
    if (abs >= threshold) {
      return `${(value / threshold).toFixed(decimals)}${suffix}`;
    }
  }
  return value.toFixed(0);
}
