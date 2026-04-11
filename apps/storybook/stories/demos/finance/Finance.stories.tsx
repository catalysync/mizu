import type { Meta, StoryObj } from '@storybook/react-vite';
import '@aspect/finance/css';
import { FinanceShell } from './FinanceShell';
import { OverviewPage } from './OverviewPage';
import { SettingsPage } from './SettingsPage';
import { InvoicesPage } from './InvoicesPage';
import { CustomersPage } from './CustomersPage';

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
