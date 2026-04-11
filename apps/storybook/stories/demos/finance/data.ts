import type { ChartOfAccountsNode } from '@aspect/finance';

export type CustomerStatus = 'active' | 'dormant' | 'lead';

export interface Customer {
  id: string;
  name: string;
  email: string;
  balance: number;
  openInvoices: number;
  lastTransaction: string;
  status: CustomerStatus;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  issuedOn: string;
  dueOn: string;
  status: InvoiceStatus;
  amount: number;
  balance: number;
  lines: InvoiceLine[];
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  reference?: string;
  category: string;
  debit: number;
  credit: number;
}

export type ReconciliationStatus = 'matched' | 'unmatched' | 'disputed' | 'pending';

export interface ReconciliationItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: ReconciliationStatus;
  match?: string;
}

export interface ReportTile {
  id: string;
  title: string;
  description: string;
  tone:
    | 'profit-loss'
    | 'balance-sheet'
    | 'cash-flow'
    | 'aged-ar'
    | 'aged-ap'
    | 'by-customer'
    | 'by-vendor';
  sparkline: number[];
}

export const customers: Customer[] = [
  {
    id: 'c-001',
    name: 'Acme Holdings',
    email: 'ap@acme.com',
    balance: 12480,
    openInvoices: 2,
    lastTransaction: '2026-04-08',
    status: 'active',
  },
  {
    id: 'c-002',
    name: 'Harbor & Co.',
    email: 'billing@harbor.co',
    balance: 4320,
    openInvoices: 1,
    lastTransaction: '2026-04-05',
    status: 'active',
  },
  {
    id: 'c-003',
    name: 'Fleet Labs',
    email: 'accounts@fleetlabs.io',
    balance: 0,
    openInvoices: 0,
    lastTransaction: '2026-03-22',
    status: 'active',
  },
  {
    id: 'c-004',
    name: 'Tidewater Group',
    email: 'pay@tidewater.com',
    balance: 18700,
    openInvoices: 3,
    lastTransaction: '2026-04-11',
    status: 'active',
  },
  {
    id: 'c-005',
    name: 'Kiln Studio',
    email: 'hello@kilnstudio.work',
    balance: 850,
    openInvoices: 1,
    lastTransaction: '2026-04-02',
    status: 'active',
  },
  {
    id: 'c-006',
    name: 'Magnolia Ltd',
    email: 'finance@magnolia.ltd',
    balance: 0,
    openInvoices: 0,
    lastTransaction: '2025-12-14',
    status: 'dormant',
  },
  {
    id: 'c-007',
    name: 'Northlight Co-op',
    email: 'pay@northlight.coop',
    balance: 2200,
    openInvoices: 1,
    lastTransaction: '2026-04-01',
    status: 'active',
  },
  {
    id: 'c-008',
    name: 'Perch Digital',
    email: 'ops@perchdigital.com',
    balance: 0,
    openInvoices: 0,
    lastTransaction: '2026-01-03',
    status: 'lead',
  },
];

const LINE = (
  id: string,
  description: string,
  quantity: number,
  unitPrice: number,
  taxRate = 20,
): InvoiceLine => ({ id, description, quantity, unitPrice, taxRate });

export const invoices: Invoice[] = [
  {
    id: 'i-0412',
    number: 'INV-0412',
    customerId: 'c-004',
    customerName: 'Tidewater Group',
    issuedOn: '2026-04-01',
    dueOn: '2026-05-01',
    status: 'sent',
    amount: 9600,
    balance: 9600,
    lines: [
      LINE('l1', 'Q2 retainer — strategy', 1, 6000),
      LINE('l2', 'Workshop facilitation', 2, 1200),
      LINE('l3', 'Travel (estimated)', 1, 600),
    ],
    notes: 'Net 30. Bank transfer preferred.',
  },
  {
    id: 'i-0411',
    number: 'INV-0411',
    customerId: 'c-001',
    customerName: 'Acme Holdings',
    issuedOn: '2026-04-01',
    dueOn: '2026-04-15',
    status: 'overdue',
    amount: 4800,
    balance: 4800,
    lines: [LINE('l1', 'March consulting', 16, 250), LINE('l2', 'Expenses reimbursed', 1, 800, 0)],
  },
  {
    id: 'i-0410',
    number: 'INV-0410',
    customerId: 'c-002',
    customerName: 'Harbor & Co.',
    issuedOn: '2026-03-28',
    dueOn: '2026-04-27',
    status: 'sent',
    amount: 4320,
    balance: 4320,
    lines: [LINE('l1', 'Monthly subscription', 1, 3600)],
  },
  {
    id: 'i-0409',
    number: 'INV-0409',
    customerId: 'c-004',
    customerName: 'Tidewater Group',
    issuedOn: '2026-03-15',
    dueOn: '2026-04-14',
    status: 'paid',
    amount: 5500,
    balance: 0,
    lines: [LINE('l1', 'Discovery phase', 1, 4583.33)],
  },
  {
    id: 'i-0408',
    number: 'INV-0408',
    customerId: 'c-005',
    customerName: 'Kiln Studio',
    issuedOn: '2026-03-10',
    dueOn: '2026-04-09',
    status: 'overdue',
    amount: 850,
    balance: 850,
    lines: [LINE('l1', 'Brand audit', 1, 708.33)],
  },
  {
    id: 'i-0407',
    number: 'INV-0407',
    customerId: 'c-007',
    customerName: 'Northlight Co-op',
    issuedOn: '2026-03-05',
    dueOn: '2026-04-04',
    status: 'overdue',
    amount: 2200,
    balance: 2200,
    lines: [LINE('l1', 'Grant writing', 8, 200), LINE('l2', 'Editing rounds', 4, 150)],
  },
  {
    id: 'i-0406',
    number: 'INV-0406',
    customerId: 'c-003',
    customerName: 'Fleet Labs',
    issuedOn: '2026-02-28',
    dueOn: '2026-03-30',
    status: 'paid',
    amount: 12000,
    balance: 0,
    lines: [LINE('l1', 'Phase 1 delivery', 1, 10000)],
  },
  {
    id: 'i-0405',
    number: 'INV-0405',
    customerId: 'c-004',
    customerName: 'Tidewater Group',
    issuedOn: '2026-04-09',
    dueOn: '2026-05-09',
    status: 'draft',
    amount: 4100,
    balance: 4100,
    lines: [LINE('l1', 'Additional facilitation', 2, 1200), LINE('l2', 'Research time', 5, 300)],
    notes: 'Draft — confirm scope with Tidewater before sending.',
  },
];

export const accounts: ChartOfAccountsNode[] = [
  {
    id: '1000',
    code: '1000',
    name: 'Assets',
    type: 'asset',
    balance: 158420,
    children: [
      {
        id: '1100',
        code: '1100',
        name: 'Current assets',
        type: 'asset',
        balance: 92820,
        children: [
          { id: '1110', code: '1110', name: 'Business checking', type: 'asset', balance: 48200 },
          { id: '1120', code: '1120', name: 'Savings reserve', type: 'asset', balance: 20000 },
          {
            id: '1130',
            code: '1130',
            name: 'Accounts receivable',
            type: 'asset',
            balance: 24620,
          },
        ],
      },
      {
        id: '1200',
        code: '1200',
        name: 'Fixed assets',
        type: 'asset',
        balance: 65600,
        children: [
          { id: '1210', code: '1210', name: 'Equipment', type: 'asset', balance: 42000 },
          { id: '1220', code: '1220', name: 'Furniture', type: 'asset', balance: 23600 },
        ],
      },
    ],
  },
  {
    id: '2000',
    code: '2000',
    name: 'Liabilities',
    type: 'liability',
    balance: -32450,
    children: [
      { id: '2100', code: '2100', name: 'Accounts payable', type: 'liability', balance: -14200 },
      { id: '2200', code: '2200', name: 'Credit card', type: 'liability', balance: -3250 },
      { id: '2300', code: '2300', name: 'Payroll liabilities', type: 'liability', balance: -15000 },
    ],
  },
  {
    id: '3000',
    code: '3000',
    name: 'Equity',
    type: 'equity',
    balance: 125970,
    children: [
      { id: '3100', code: '3100', name: "Owner's equity", type: 'equity', balance: 80000 },
      { id: '3200', code: '3200', name: 'Retained earnings', type: 'equity', balance: 45970 },
    ],
  },
  {
    id: '4000',
    code: '4000',
    name: 'Revenue',
    type: 'revenue',
    balance: 84200,
    children: [
      { id: '4100', code: '4100', name: 'Consulting revenue', type: 'revenue', balance: 62400 },
      { id: '4200', code: '4200', name: 'Subscription revenue', type: 'revenue', balance: 18400 },
      { id: '4300', code: '4300', name: 'Workshop revenue', type: 'revenue', balance: 3400 },
    ],
  },
  {
    id: '5000',
    code: '5000',
    name: 'Expenses',
    type: 'expense',
    balance: 43210,
    children: [
      { id: '5100', code: '5100', name: 'Salaries & wages', type: 'expense', balance: 28000 },
      { id: '5200', code: '5200', name: 'Office rent', type: 'expense', balance: 7200 },
      { id: '5300', code: '5300', name: 'Software subscriptions', type: 'expense', balance: 2340 },
      { id: '5400', code: '5400', name: 'Travel', type: 'expense', balance: 1870 },
      { id: '5500', code: '5500', name: 'Professional services', type: 'expense', balance: 3800 },
    ],
  },
];

export const transactions: Transaction[] = [
  {
    id: 't-001',
    date: '2026-04-11',
    description: 'Stripe payout',
    reference: 'STR-APR-11',
    category: 'Revenue',
    debit: 0,
    credit: 6200,
  },
  {
    id: 't-002',
    date: '2026-04-10',
    description: 'Office rent — April',
    reference: 'RENT-04',
    category: 'Office rent',
    debit: 2400,
    credit: 0,
  },
  {
    id: 't-003',
    date: '2026-04-09',
    description: 'Software — Linear',
    reference: 'CARD-8812',
    category: 'Software',
    debit: 96,
    credit: 0,
  },
  {
    id: 't-004',
    date: '2026-04-08',
    description: 'Payment — Fleet Labs',
    reference: 'INV-0406',
    category: 'Revenue',
    debit: 0,
    credit: 12000,
  },
  {
    id: 't-005',
    date: '2026-04-07',
    description: 'Flights — Workshop travel',
    reference: 'CARD-8812',
    category: 'Travel',
    debit: 640,
    credit: 0,
  },
  {
    id: 't-006',
    date: '2026-04-05',
    description: 'Payroll — staff',
    reference: 'PAY-04',
    category: 'Payroll',
    debit: 14000,
    credit: 0,
  },
  {
    id: 't-007',
    date: '2026-04-03',
    description: 'Client deposit — Harbor',
    reference: 'INV-0410',
    category: 'Revenue',
    debit: 0,
    credit: 4320,
  },
  {
    id: 't-008',
    date: '2026-04-02',
    description: 'Contractor — freelancer',
    reference: 'CONT-0402',
    category: 'Professional services',
    debit: 1800,
    credit: 0,
  },
];

export const reconciliation: ReconciliationItem[] = [
  {
    id: 'r-001',
    date: '2026-04-11',
    description: 'Stripe payout',
    amount: 6200,
    status: 'matched',
    match: 'Stripe payout · t-001',
  },
  {
    id: 'r-002',
    date: '2026-04-08',
    description: 'Fleet Labs — wire',
    amount: 12000,
    status: 'matched',
    match: 'Payment INV-0406 · t-004',
  },
  {
    id: 'r-003',
    date: '2026-04-07',
    description: 'AMEX — travel charge',
    amount: -640,
    status: 'matched',
    match: 'Flights · t-005',
  },
  {
    id: 'r-004',
    date: '2026-04-05',
    description: 'Wise — unknown payer',
    amount: 2100,
    status: 'unmatched',
  },
  {
    id: 'r-005',
    date: '2026-04-03',
    description: 'Harbor & Co.',
    amount: 4320,
    status: 'matched',
    match: 'INV-0410 · t-007',
  },
  {
    id: 'r-006',
    date: '2026-04-02',
    description: 'ACH — Kiln refund?',
    amount: -200,
    status: 'disputed',
    match: 'Needs review',
  },
  {
    id: 'r-007',
    date: '2026-04-02',
    description: 'Contractor payout',
    amount: -1800,
    status: 'pending',
  },
];

export const reports: ReportTile[] = [
  {
    id: 'pl',
    title: 'Profit & Loss',
    description: 'Revenue minus expenses for the period',
    tone: 'profit-loss',
    sparkline: [8, 12, 9, 14, 18, 17, 22, 24, 20, 26, 28, 31],
  },
  {
    id: 'bs',
    title: 'Balance Sheet',
    description: 'Snapshot of assets, liabilities, equity',
    tone: 'balance-sheet',
    sparkline: [120, 122, 128, 130, 134, 138, 140, 146, 150, 154, 156, 158],
  },
  {
    id: 'cf',
    title: 'Cash Flow',
    description: 'Operating, investing, financing',
    tone: 'cash-flow',
    sparkline: [5, 7, 4, 9, 12, 8, 11, 14, 10, 15, 13, 18],
  },
  {
    id: 'ar',
    title: 'Aged Receivables',
    description: 'Current · 1-30 · 31-60 · 61-90 · 90+',
    tone: 'aged-ar',
    sparkline: [22, 18, 14, 10, 6],
  },
  {
    id: 'ap',
    title: 'Aged Payables',
    description: 'What you owe, by age bucket',
    tone: 'aged-ap',
    sparkline: [14, 10, 6, 3, 1],
  },
  {
    id: 'sbc',
    title: 'Sales by Customer',
    description: 'Revenue grouped by customer',
    tone: 'by-customer',
    sparkline: [12, 18, 24, 10, 8, 6, 4, 2],
  },
];

export const overviewKpis = {
  mrr: 18400,
  outstandingAr: 24620,
  cashInBank: 68200,
  netProfitMonth: 11840,
  deltas: {
    mrr: 0.12,
    outstandingAr: -0.04,
    cashInBank: 0.08,
    netProfitMonth: 0.21,
  },
};
