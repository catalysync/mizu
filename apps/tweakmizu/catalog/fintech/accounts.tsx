import type { OutputFile, RenderContext } from '@/lib/patterns/types';
import { definePattern } from '@/lib/patterns/types';
import { AccountSummary, DeltaIndicator, TransactionRow, formatCurrency } from '@aspect/finance';
import { Card, CardBody, CardHeader, Grid, Stack } from '@aspect/react';

interface Account {
  id: string;
  name: string;
  balance: number;
  deltaPct: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

const accounts: Account[] = [
  { id: '1', name: 'Primary Checking', balance: 12450.32, deltaPct: 2.4 },
  { id: '2', name: 'High-Yield Savings', balance: 48900.0, deltaPct: 4.8 },
  { id: '3', name: 'Investment Portfolio', balance: 124300.77, deltaPct: -1.2 },
  { id: '4', name: 'Credit Line', balance: -2340.12, deltaPct: -12.5 },
];

const transactions: Transaction[] = [
  { id: 't1', date: 'Apr 10', description: 'Stripe payout', amount: 4850, category: 'Revenue' },
  { id: 't2', date: 'Apr 9', description: 'AWS', amount: -1240, category: 'Infrastructure' },
  { id: 't3', date: 'Apr 9', description: 'Vercel Pro', amount: -20, category: 'Tools' },
  { id: 't4', date: 'Apr 8', description: 'Anthropic API', amount: -87, category: 'AI' },
  { id: 't5', date: 'Apr 7', description: 'Refund — Jane Doe', amount: -49, category: 'Refund' },
];

function Preview() {
  return (
    <Grid gap="1rem" min="20rem">
      <Card>
        <CardHeader title="Accounts" description="Your balances across all linked accounts" />
        <CardBody>
          <Stack gap="0">
            {accounts.map((a) => (
              <AccountSummary
                key={a.id}
                name={a.name}
                balance={formatCurrency(a.balance)}
                delta={<DeltaIndicator value={a.deltaPct} />}
              />
            ))}
          </Stack>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Recent transactions" description="Last 5 movements" />
        <CardBody>
          <Stack gap="0">
            {transactions.map((t) => (
              <TransactionRow
                key={t.id}
                date={t.date}
                description={t.description}
                amount={t.amount}
                category={t.category}
              />
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Grid>
  );
}

const TEMPLATE = `import { Card, CardBody, CardHeader, Grid, Stack } from '@aspect/react';
import {
  AccountSummary,
  DeltaIndicator,
  TransactionRow,
  formatCurrency,
} from '@aspect/finance';

interface Account {
  id: string;
  name: string;
  balance: number;
  deltaPct: number;
}

const accounts: Account[] = [
  { id: '1', name: 'Primary Checking', balance: 12450.32, deltaPct: 2.4 },
  { id: '2', name: 'High-Yield Savings', balance: 48900.0, deltaPct: 4.8 },
  { id: '3', name: 'Investment Portfolio', balance: 124300.77, deltaPct: -1.2 },
  { id: '4', name: 'Credit Line', balance: -2340.12, deltaPct: -12.5 },
];

const transactions = [
  { id: 't1', date: 'Apr 10', description: 'Stripe payout', amount: 4850, category: 'Revenue' },
  { id: 't2', date: 'Apr 9', description: 'AWS', amount: -1240, category: 'Infrastructure' },
  { id: 't3', date: 'Apr 9', description: 'Vercel Pro', amount: -20, category: 'Tools' },
];

export default function AccountsPage() {
  return (
    <Grid gap="1rem" min="20rem">
      <Card>
        <CardHeader title="Accounts" description="Your balances across all linked accounts" />
        <CardBody>
          <Stack gap="0">
            {accounts.map((a) => (
              <AccountSummary
                key={a.id}
                name={a.name}
                balance={formatCurrency(a.balance)}
                delta={<DeltaIndicator value={a.deltaPct} />}
              />
            ))}
          </Stack>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Recent transactions" description="Last 5 movements" />
        <CardBody>
          <Stack gap="0">
            {transactions.map((t) => (
              <TransactionRow
                key={t.id}
                date={t.date}
                description={t.description}
                amount={t.amount}
                category={t.category}
              />
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Grid>
  );
}
`;

export const fintechAccounts = definePattern({
  meta: {
    id: 'fintech.accounts',
    name: 'Fintech Accounts Overview',
    description:
      'Two-column fintech dashboard showing account summaries with deltas and a recent-transactions stream. Uses @aspect/finance AccountSummary + TransactionRow.',
    kind: 'page',
    industries: ['fintech', 'saas-admin'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Grid',
      '@aspect/react#Stack',
      '@aspect/finance#AccountSummary',
      '@aspect/finance#TransactionRow',
      '@aspect/finance#DeltaIndicator',
      '@aspect/finance#formatCurrency',
    ],
    sources: [
      {
        system: 'mercury',
        relationship: 'ia-borrowed',
        notes: 'Account list + transaction stream pattern mirrors Mercury dashboard.',
      },
      {
        system: 'stripe',
        relationship: 'visual-rhythm',
        notes: 'Delta indicators and tabular numbers from Stripe financial reports.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/accounts/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});
