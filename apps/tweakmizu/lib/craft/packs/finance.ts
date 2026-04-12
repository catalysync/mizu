import type { Entity, Page, NavItem } from '../app-schema';
import type { DomainPack, WorkflowDef } from './types';

const entities: Entity[] = [
  {
    id: 'invoice',
    name: 'Invoice',
    plural: 'Invoices',
    fields: [
      { id: 'number', label: 'Invoice #', type: 'string', required: true, primary: true },
      { id: 'customer', label: 'Customer', type: 'string', required: true, primary: false },
      { id: 'issuedOn', label: 'Issued', type: 'date', required: true, primary: false },
      { id: 'dueOn', label: 'Due', type: 'date', required: true, primary: false },
      { id: 'amount', label: 'Amount', type: 'currency', required: true, primary: false },
      { id: 'balance', label: 'Balance', type: 'currency', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['draft', 'approved', 'sent', 'part-paid', 'paid', 'overdue', 'void'],
        required: false,
        primary: false,
      },
      { id: 'approvedBy', label: 'Approved by', type: 'string', required: false, primary: false },
      { id: 'currency', label: 'Currency', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'customer',
    name: 'Customer',
    plural: 'Customers',
    fields: [
      { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
      { id: 'email', label: 'Email', type: 'email', required: true, primary: false },
      { id: 'balance', label: 'Balance', type: 'currency', required: false, primary: false },
      {
        id: 'openInvoices',
        label: 'Open invoices',
        type: 'number',
        required: false,
        primary: false,
      },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['active', 'dormant', 'lead'],
        required: false,
        primary: false,
      },
      {
        id: 'lastTransaction',
        label: 'Last transaction',
        type: 'date',
        required: false,
        primary: false,
      },
    ],
  },
  {
    id: 'journal-entry',
    name: 'Journal entry',
    plural: 'Journal entries',
    fields: [
      { id: 'number', label: 'Journal #', type: 'string', required: true, primary: true },
      { id: 'date', label: 'Date', type: 'date', required: true, primary: false },
      { id: 'description', label: 'Description', type: 'text', required: false, primary: false },
      { id: 'debitTotal', label: 'Debit', type: 'currency', required: false, primary: false },
      { id: 'creditTotal', label: 'Credit', type: 'currency', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['draft', 'posted', 'reversed'],
        required: false,
        primary: false,
      },
      { id: 'period', label: 'Period', type: 'string', required: false, primary: false },
      { id: 'source', label: 'Source', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'bank-transaction',
    name: 'Bank transaction',
    plural: 'Bank transactions',
    fields: [
      { id: 'date', label: 'Date', type: 'date', required: true, primary: false },
      { id: 'description', label: 'Description', type: 'string', required: true, primary: true },
      { id: 'amount', label: 'Amount', type: 'currency', required: true, primary: false },
      { id: 'category', label: 'Category', type: 'string', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['imported', 'categorized', 'matched', 'reconciled'],
        required: false,
        primary: false,
      },
      { id: 'reference', label: 'Ref', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'vendor',
    name: 'Vendor',
    plural: 'Vendors',
    fields: [
      { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
      { id: 'email', label: 'Email', type: 'email', required: false, primary: false },
      { id: 'balance', label: 'Balance owed', type: 'currency', required: false, primary: false },
      { id: 'openBills', label: 'Open bills', type: 'number', required: false, primary: false },
    ],
  },
  {
    id: 'tax-rate',
    name: 'Tax rate',
    plural: 'Tax rates',
    fields: [
      { id: 'name', label: 'Name', type: 'string', required: true, primary: true },
      { id: 'rate', label: 'Rate', type: 'percent', required: true, primary: false },
      { id: 'type', label: 'Type', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'vat-return',
    name: 'VAT return',
    plural: 'VAT returns',
    fields: [
      { id: 'period', label: 'Period', type: 'string', required: true, primary: true },
      { id: 'dueDate', label: 'Due date', type: 'date', required: true, primary: false },
      { id: 'netVat', label: 'Net VAT', type: 'currency', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['draft', 'submitted', 'accepted', 'amended'],
        required: false,
        primary: false,
      },
    ],
  },
  {
    id: 'fiscal-period',
    name: 'Fiscal period',
    plural: 'Fiscal periods',
    fields: [
      { id: 'name', label: 'Period', type: 'string', required: true, primary: true },
      { id: 'startDate', label: 'Start', type: 'date', required: true, primary: false },
      { id: 'endDate', label: 'End', type: 'date', required: true, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['open', 'closing', 'closed', 'locked'],
        required: false,
        primary: false,
      },
    ],
  },
  {
    id: 'payment',
    name: 'Payment',
    plural: 'Payments',
    fields: [
      { id: 'date', label: 'Date', type: 'date', required: true, primary: false },
      { id: 'customer', label: 'From', type: 'string', required: true, primary: true },
      { id: 'amount', label: 'Amount', type: 'currency', required: true, primary: false },
      { id: 'method', label: 'Method', type: 'string', required: false, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['pending', 'processed', 'failed', 'reconciled'],
        required: false,
        primary: false,
      },
      { id: 'invoiceRef', label: 'Invoice', type: 'string', required: false, primary: false },
    ],
  },
  {
    id: 'expense-claim',
    name: 'Expense claim',
    plural: 'Expense claims',
    fields: [
      { id: 'date', label: 'Date', type: 'date', required: true, primary: false },
      { id: 'claimant', label: 'Claimant', type: 'string', required: true, primary: true },
      { id: 'description', label: 'Description', type: 'text', required: false, primary: false },
      { id: 'amount', label: 'Amount', type: 'currency', required: true, primary: false },
      {
        id: 'status',
        label: 'Status',
        type: 'badge',
        badgeValues: ['draft', 'submitted', 'approved', 'rejected', 'reimbursed'],
        required: false,
        primary: false,
      },
    ],
  },
];

const workflows: WorkflowDef[] = [
  {
    entityId: 'invoice',
    states: [
      { id: 'draft', label: 'Draft', transitions: ['approved'] },
      { id: 'approved', label: 'Approved', transitions: ['sent'] },
      { id: 'sent', label: 'Sent', transitions: ['part-paid', 'paid', 'overdue', 'void'] },
      { id: 'part-paid', label: 'Part paid', transitions: ['paid', 'void'] },
      { id: 'paid', label: 'Paid', transitions: [] },
      { id: 'overdue', label: 'Overdue', transitions: ['paid', 'void'] },
      { id: 'void', label: 'Void', transitions: [] },
    ],
  },
  {
    entityId: 'journal-entry',
    states: [
      { id: 'draft', label: 'Draft', transitions: ['posted'] },
      { id: 'posted', label: 'Posted', transitions: ['reversed'] },
      { id: 'reversed', label: 'Reversed', transitions: [] },
    ],
  },
  {
    entityId: 'bank-transaction',
    states: [
      { id: 'imported', label: 'Imported', transitions: ['categorized'] },
      { id: 'categorized', label: 'Categorized', transitions: ['matched'] },
      { id: 'matched', label: 'Matched', transitions: ['reconciled'] },
      { id: 'reconciled', label: 'Reconciled', transitions: [] },
    ],
  },
  {
    entityId: 'vat-return',
    states: [
      { id: 'draft', label: 'Draft', transitions: ['submitted'] },
      { id: 'submitted', label: 'Submitted', transitions: ['accepted', 'amended'] },
      { id: 'accepted', label: 'Accepted', transitions: [] },
      { id: 'amended', label: 'Amended', transitions: ['submitted'] },
    ],
  },
  {
    entityId: 'fiscal-period',
    states: [
      { id: 'open', label: 'Open', transitions: ['closing'] },
      { id: 'closing', label: 'Closing', transitions: ['closed'] },
      { id: 'closed', label: 'Closed', transitions: ['locked'] },
      { id: 'locked', label: 'Locked', transitions: [] },
    ],
  },
];

const defaultPages: Page[] = [
  {
    id: 'dashboard',
    path: '/',
    title: 'Dashboard',
    icon: 'layout',
    composition: {
      header: {
        title: 'Dashboard',
        description: 'Q2 2026 · April 1 – June 30',
        actions: [{ label: 'New invoice', variant: 'primary' }],
      },
      sections: [
        {
          id: 'kpis',
          kind: 'kpi-row',
          kpis: [
            { label: 'Revenue (period)', value: '$84,200', delta: '+18%' },
            { label: 'Outstanding AR', value: '$24,620', delta: '-4%' },
            { label: 'Cash in bank', value: '$68,200', delta: '+8%' },
            { label: 'Net profit', value: '$22,590', delta: '+21%' },
          ],
        },
        { id: 'activity', kind: 'activity-list', title: 'Recent activity' },
      ],
    },
  },
  {
    id: 'invoices',
    path: '/invoices',
    title: 'Invoices',
    icon: 'file-text',
    composition: {
      header: {
        title: 'Invoices',
        description: '50 total · 12 outstanding · 3 overdue',
        actions: [
          { label: 'Import', variant: 'ghost' },
          { label: 'New invoice', variant: 'primary' },
        ],
      },
      sections: [
        {
          id: 'invoices-table',
          kind: 'table',
          entityId: 'invoice',
          columnIds: ['number', 'customer', 'issuedOn', 'dueOn', 'amount', 'balance', 'status'],
        },
      ],
    },
  },
  {
    id: 'customers',
    path: '/customers',
    title: 'Customers',
    icon: 'users',
    composition: {
      header: {
        title: 'Customers',
        description: '20 total · 15 active',
        actions: [{ label: 'Add customer', variant: 'primary' }],
      },
      sections: [
        {
          id: 'customers-table',
          kind: 'table',
          entityId: 'customer',
          columnIds: ['name', 'email', 'balance', 'openInvoices', 'status'],
        },
      ],
    },
  },
  {
    id: 'bank',
    path: '/bank',
    title: 'Bank',
    icon: 'landmark',
    composition: {
      header: {
        title: 'Bank reconciliation',
        description: 'Business checking · April 2026',
        actions: [{ label: 'Finalize', variant: 'primary' }],
      },
      sections: [
        {
          id: 'bank-table',
          kind: 'table',
          entityId: 'bank-transaction',
          columnIds: ['date', 'description', 'amount', 'category', 'status'],
        },
      ],
    },
  },
  {
    id: 'journals',
    path: '/journals',
    title: 'Journal entries',
    icon: 'book-open',
    composition: {
      header: {
        title: 'Journal entries',
        description: 'Double-entry ledger',
        actions: [{ label: 'New journal', variant: 'primary' }],
      },
      sections: [
        {
          id: 'journals-table',
          kind: 'table',
          entityId: 'journal-entry',
          columnIds: ['number', 'date', 'description', 'debitTotal', 'creditTotal', 'status'],
        },
      ],
    },
  },
  {
    id: 'vat',
    path: '/vat',
    title: 'VAT returns',
    icon: 'receipt',
    composition: {
      header: {
        title: 'VAT returns',
        description: 'Making Tax Digital',
        actions: [{ label: 'Prepare return', variant: 'primary' }],
      },
      sections: [
        {
          id: 'vat-table',
          kind: 'table',
          entityId: 'vat-return',
          columnIds: ['period', 'dueDate', 'netVat', 'status'],
        },
      ],
    },
  },
  {
    id: 'reports',
    path: '/reports',
    title: 'Reports',
    icon: 'bar-chart',
    composition: {
      header: {
        title: 'Reports',
        description: 'Profit & Loss, Balance Sheet, Cash Flow, Aging',
        actions: [{ label: 'Custom report', variant: 'primary' }],
      },
      sections: [
        {
          id: 'reports-text',
          kind: 'text',
          title: 'Available reports',
          body: 'Profit & Loss · Balance Sheet · Cash Flow Statement · Aged Receivables · Aged Payables · Sales by Customer · Expenses by Vendor · VAT Return Summary',
        },
      ],
    },
  },
  {
    id: 'chart-of-accounts',
    path: '/accounts',
    title: 'Chart of accounts',
    icon: 'list-tree',
    composition: {
      header: {
        title: 'Chart of accounts',
        description: '40 accounts across Assets, Liabilities, Equity, Revenue, Expenses',
        actions: [
          { label: 'Import', variant: 'ghost' },
          { label: 'New account', variant: 'primary' },
        ],
      },
      sections: [
        {
          id: 'coa-text',
          kind: 'text',
          body: 'Hierarchical tree: Assets → Current Assets → Checking Account. Each row shows code, name, type, and balance.',
        },
      ],
    },
  },
  {
    id: 'settings',
    path: '/settings',
    title: 'Settings',
    icon: 'settings',
    composition: {
      header: {
        title: 'Settings',
        description: 'Company profile, tax rates, fiscal year, integrations',
        actions: [],
      },
      sections: [{ id: 'settings-form', kind: 'settings-form' }],
    },
  },
];

const defaultNav: NavItem[] = [
  { pageId: 'dashboard', section: 'primary' },
  { pageId: 'invoices', section: 'primary' },
  { pageId: 'customers', section: 'primary' },
  { pageId: 'bank', section: 'primary' },
  { pageId: 'journals', section: 'primary' },
  { pageId: 'vat', section: 'primary' },
  { pageId: 'reports', section: 'primary' },
  { pageId: 'chart-of-accounts', section: 'secondary' },
  { pageId: 'settings', section: 'secondary' },
];

const promptContext = `You are generating a finance/accounting design system. Use the following domain knowledge:

ENTITIES: Invoice (with full approval workflow: draft→approved→sent→part-paid→paid→overdue→void), Journal Entry (double-entry: draft→posted→reversed), Customer, Vendor, Bank Transaction (imported→categorized→matched→reconciled), Payment (pending→processed→failed→reconciled), Tax Rate, VAT Return (draft→submitted→accepted→amended), Fiscal Period (open→closing→closed→locked), Expense Claim (draft→submitted→approved→rejected→reimbursed).

CONSTRAINTS:
- Every accounting product needs an audit log (who/when/what/old-value/new-value)
- Period locking prevents edits to closed periods
- Double-entry: every journal must balance (total debits = total credits)
- Multi-currency: FX gain/loss on settlement
- UK: Making Tax Digital (MTD) for VAT — digital record-keeping + quarterly submission
- Role segregation: a clerk who creates invoices but cannot approve them
- Aged receivables must show 5 buckets: current, 1-30, 31-60, 61-90, 90+

REFERENCE PRODUCTS: Akaunting (open-source QBO clone), ERPNext (enterprise ERP), Xero (modern SMB gold standard), Sage Business Cloud (UK incumbent), QuickBooks Online (US incumbent).

DESIGN LANGUAGE for finance:
- Muted cool palette (trust, seriousness) — avoid vibrant consumer colors
- Dense tables with tabular-nums everywhere — accounting is number-heavy
- Conservative motion scale — financial data changes should feel deliberate
- Formal voice register — "Enter a valid amount" not "Oops! Try again"
- Thin borders, soft radius (6px) — professional without being cold
- High-contrast text for legibility of financial figures

When generating pages, include proper entity-backed tables with realistic columns. Do not generate empty placeholder pages. Every page should have a composition with real sections, real entities bound to tables, and realistic KPI values.`;

export const financePack: DomainPack = {
  id: 'finance',
  name: 'Finance & Accounting',
  entities,
  workflows,
  promptContext,
  defaultPages,
  defaultNav,
  referenceProducts: ['Akaunting', 'ERPNext', 'Xero', 'Sage Business Cloud', 'QuickBooks Online'],
};
