const CATEGORICAL_COUNT = 8;

export function getCategoricalColor(index: number): string {
  const slot = (index % CATEGORICAL_COUNT) + 1;
  return `var(--mizu-chart-categorical-${slot})`;
}

export function resolveColor(color: string | undefined, index: number): string {
  if (!color) return getCategoricalColor(index);
  if (color.startsWith('--')) return `var(${color})`;
  return color;
}
