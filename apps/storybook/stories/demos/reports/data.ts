export interface ReportRow {
  label: string;
  current: number;
  prior: number;
  type: 'section' | 'item' | 'subtotal' | 'total';
  drillDown?: boolean;
  negative?: boolean;
}

export const balanceSheet: ReportRow[] = [
  { label: 'Assets', current: 0, prior: 0, type: 'section' },
  { label: 'Cash and equivalents', current: 1204000, prior: 982000, type: 'item', drillDown: true },
  { label: 'Accounts receivable', current: 94200, prior: 112800, type: 'item', drillDown: true },
  { label: 'Inventory', current: 38400, prior: 42100, type: 'item', drillDown: true },
  { label: 'Prepaid expenses', current: 12600, prior: 11400, type: 'item' },
  { label: 'Total Current Assets', current: 1349200, prior: 1148300, type: 'subtotal' },
  { label: 'Property & equipment', current: 186000, prior: 192200, type: 'item', drillDown: true },
  { label: 'Intangible assets', current: 24000, prior: 28000, type: 'item' },
  { label: 'Total Assets', current: 1559200, prior: 1368500, type: 'subtotal' },

  { label: 'Liabilities', current: 0, prior: 0, type: 'section' },
  { label: 'Accounts payable', current: 67800, prior: 58200, type: 'item', drillDown: true },
  { label: 'Accrued expenses', current: 34200, prior: 31400, type: 'item', drillDown: true },
  { label: 'Deferred revenue', current: 89400, prior: 72600, type: 'item', drillDown: true },
  { label: 'Total Current Liabilities', current: 191400, prior: 162200, type: 'subtotal' },
  { label: 'Long-term debt', current: 250000, prior: 250000, type: 'item' },
  { label: 'Total Liabilities', current: 441400, prior: 412200, type: 'subtotal' },

  { label: 'Equity', current: 0, prior: 0, type: 'section' },
  { label: 'Common stock', current: 500000, prior: 500000, type: 'item' },
  { label: 'Retained earnings', current: 617800, prior: 456300, type: 'item', drillDown: true },
  { label: 'Total Equity', current: 1117800, prior: 956300, type: 'subtotal' },

  { label: 'Total Liabilities & Equity', current: 1559200, prior: 1368500, type: 'total' },
];

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
