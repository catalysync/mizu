export interface Metric {
  id: string;
  label: string;
  value: string;
  delta: number;
  period: string;
}

export const metrics: Metric[] = [
  { id: 'revenue', label: 'Revenue', value: '$482.1K', delta: 0.124, period: 'vs last month' },
  { id: 'expenses', label: 'Expenses', value: '$318.7K', delta: 0.068, period: 'vs last month' },
  {
    id: 'net-income',
    label: 'Net Income',
    value: '$163.4K',
    delta: 0.247,
    period: 'vs last month',
  },
  { id: 'cash', label: 'Cash Balance', value: '$1.2M', delta: -0.031, period: 'vs last month' },
  {
    id: 'ar',
    label: 'Accounts Receivable',
    value: '$94.2K',
    delta: -0.082,
    period: 'vs last month',
  },
  { id: 'burn', label: 'Burn Rate', value: '$52.3K/mo', delta: 0.015, period: 'trailing 3mo avg' },
];

export interface Insight {
  id: string;
  title: string;
  body: string;
  severity: 'info' | 'positive' | 'warning';
}

export const insights: Insight[] = [
  {
    id: '1',
    title: 'Revenue trend accelerating',
    body: 'Monthly revenue growth rate increased from 8.2% to 12.4% over the past quarter. Product revenue is the primary driver, growing 18% QoQ while service revenue remained flat.',
    severity: 'positive',
  },
  {
    id: '2',
    title: 'Marketing spend efficiency improving',
    body: 'Customer acquisition cost dropped from $142 to $118 this month despite a 22% increase in ad spend. The new referral program accounts for 34% of new signups.',
    severity: 'info',
  },
  {
    id: '3',
    title: 'Accounts receivable aging',
    body: '3 invoices totaling $28.4K are now 60+ days overdue. This represents 30% of total AR. Consider following up with Acme Corp ($18.2K) and Globex Inc ($7.1K).',
    severity: 'warning',
  },
  {
    id: '4',
    title: 'Runway estimate updated',
    body: 'At the current burn rate of $52.3K/month and a cash balance of $1.2M, estimated runway is 23 months. This is 4 months longer than the prior estimate due to improved unit economics.',
    severity: 'info',
  },
];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export const recentTransactions: Transaction[] = [
  { id: '1', date: 'Mar 28', description: 'Stripe payout', amount: 34250, category: 'Revenue' },
  {
    id: '2',
    date: 'Mar 27',
    description: 'AWS invoice',
    amount: -4821,
    category: 'Infrastructure',
  },
  { id: '3', date: 'Mar 26', description: 'Payroll — March', amount: -48500, category: 'Payroll' },
  { id: '4', date: 'Mar 25', description: 'Google Ads', amount: -3200, category: 'Marketing' },
  {
    id: '5',
    date: 'Mar 24',
    description: 'Client payment — Acme',
    amount: 12800,
    category: 'Revenue',
  },
  {
    id: '6',
    date: 'Mar 22',
    description: 'Vercel subscription',
    amount: -320,
    category: 'Infrastructure',
  },
];
