import '@aspect/finance/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartOfAccountsPage } from './ChartOfAccountsPage';
import { CustomersPage } from './CustomersPage';
import './finance-demo.css';
import { FinanceShell } from './FinanceShell';
import { InvoicesPage } from './InvoicesPage';
import { OnboardingFlow } from './OnboardingFlow';
import { OverviewPage } from './OverviewPage';
import { ReconciliationPage } from './ReconciliationPage';
import { ReportsPage } from './ReportsPage';
import { SettingsPage } from './SettingsPage';
import { TransactionsPage } from './TransactionsPage';

const meta = {
  title: 'Demos/Finance',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <FinanceShell
      active="overview"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Overview' }]}
    >
      <OverviewPage />
    </FinanceShell>
  ),
};

export const Invoices: Story = {
  render: () => (
    <FinanceShell
      active="invoices"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Invoices' }]}
    >
      <InvoicesPage />
    </FinanceShell>
  ),
};

export const Customers: Story = {
  render: () => (
    <FinanceShell
      active="customers"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Customers' }]}
    >
      <CustomersPage />
    </FinanceShell>
  ),
};

export const Transactions: Story = {
  render: () => (
    <FinanceShell
      active="transactions"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Transactions' }]}
    >
      <TransactionsPage />
    </FinanceShell>
  ),
};

export const Reconciliation: Story = {
  render: () => (
    <FinanceShell
      active="reconciliation"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Reconciliation' }]}
    >
      <ReconciliationPage />
    </FinanceShell>
  ),
};

export const ChartOfAccounts: Story = {
  render: () => (
    <FinanceShell
      active="accounts"
      breadcrumbs={[
        { label: 'Home', href: '#' },
        { label: 'Setup', href: '#' },
        { label: 'Chart of accounts' },
      ]}
    >
      <ChartOfAccountsPage />
    </FinanceShell>
  ),
};

export const Reports: Story = {
  render: () => (
    <FinanceShell
      active="reports"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Reports' }]}
    >
      <ReportsPage />
    </FinanceShell>
  ),
};

export const Onboarding: Story = {
  render: () => <OnboardingFlow />,
};

export const Settings: Story = {
  render: () => (
    <FinanceShell
      active="settings"
      breadcrumbs={[
        { label: 'Home', href: '#' },
        { label: 'Setup', href: '#' },
        { label: 'Settings' },
      ]}
    >
      <SettingsPage />
    </FinanceShell>
  ),
};
