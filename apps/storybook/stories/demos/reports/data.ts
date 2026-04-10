export interface ReportRow {
  label: string;
  current: number;
  prior: number;
  type: 'section' | 'item' | 'subtotal' | 'total';
  drillDown?: boolean;
  negative?: boolean;
}

export const profitAndLoss: ReportRow[] = [
  { label: 'Income', current: 0, prior: 0, type: 'section' },
  { label: 'Product revenue', current: 284500, prior: 241200, type: 'item', drillDown: true },
  { label: 'Service revenue', current: 67800, prior: 58400, type: 'item', drillDown: true },
  { label: 'Other income', current: 3200, prior: 1800, type: 'item', drillDown: true },
  { label: 'Total Income', current: 355500, prior: 301400, type: 'subtotal' },

  { label: 'Cost of Goods Sold', current: 0, prior: 0, type: 'section' },
  { label: 'Materials', current: 89400, prior: 78200, type: 'item', drillDown: true },
  { label: 'Direct labor', current: 42300, prior: 38700, type: 'item', drillDown: true },
  { label: 'Shipping', current: 12100, prior: 10400, type: 'item', drillDown: true },
  { label: 'Total COGS', current: 143800, prior: 127300, type: 'subtotal' },

  { label: 'Gross Profit', current: 211700, prior: 174100, type: 'subtotal' },

  { label: 'Operating Expenses', current: 0, prior: 0, type: 'section' },
  { label: 'Salaries & wages', current: 98500, prior: 92100, type: 'item', drillDown: true },
  { label: 'Rent', current: 18000, prior: 18000, type: 'item', drillDown: true },
  { label: 'Marketing', current: 24300, prior: 19800, type: 'item', drillDown: true },
  { label: 'Software & tools', current: 8700, prior: 7200, type: 'item', drillDown: true },
  { label: 'Professional fees', current: 5400, prior: 4800, type: 'item', drillDown: true },
  { label: 'Depreciation', current: 6200, prior: 6200, type: 'item' },
  { label: 'Other expenses', current: 3100, prior: 2600, type: 'item', drillDown: true },
  { label: 'Total Operating Expenses', current: 164200, prior: 150700, type: 'subtotal' },

  { label: 'Net Income', current: 47500, prior: 23400, type: 'total' },
];
