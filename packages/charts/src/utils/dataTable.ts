import type { ChartConfig, ChartItem } from './types';

type Formatter = (value: string) => string;

const format = (value: number, formatter?: Formatter) =>
  formatter ? formatter(String(value)) : String(value);

/** Columns and rows for a cartesian chart: one row per category, one column per series. */
export function cartesianTable<K extends ChartConfig>(
  data: ChartItem<K>[],
  dataConfig: K,
  formatter?: Formatter,
) {
  const series = Object.keys(dataConfig) as (keyof K)[];
  return {
    columns: ['Category', ...series.map((key) => dataConfig[key].label ?? String(key))],
    rows: data.map((item) => [
      item.label,
      ...series.map((key) => format(item.values[key], formatter)),
    ]),
  };
}

export function pieTable(items: { label: string; value: number }[], formatter?: Formatter) {
  return {
    columns: ['Category', 'Value'],
    rows: items.map((item) => [item.label, format(item.value, formatter)]),
  };
}
