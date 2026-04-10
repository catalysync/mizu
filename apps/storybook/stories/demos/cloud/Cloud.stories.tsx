import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@aspect/react';
import { CloudShell } from './CloudShell';
import { AppsPage } from './Apps';
import { TemplatesPage } from './Templates';
import { ActivityPage } from './Activity';
import { SettingsPage } from './SettingsPage';
import { BillingPage } from './BillingPage';
import { IconPlus } from './icons';

const meta = {
  title: 'Demos/Cloud',
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: false },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Apps: Story = {
  render: () => (
    <CloudShell
      active="apps"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Apps' }]}
      title="Apps"
      description="Deploy and manage your applications."
      primaryAction={
        <Button variant="primary">
          <IconPlus />
          <span>New app</span>
        </Button>
      }
    >
      <AppsPage />
    </CloudShell>
  ),
};

export const Templates: Story = {
  render: () => (
    <CloudShell
      active="templates"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Templates' }]}
      title="Templates"
      description="One-click starters for frameworks, databases, and full-stack apps."
    >
      <TemplatesPage />
    </CloudShell>
  ),
};

export const Activity: Story = {
  render: () => (
    <CloudShell
      active="activity"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Activity' }]}
      title="Activity"
      description="Deploys, builds, config changes, and add-on events across all your apps."
    >
      <ActivityPage />
    </CloudShell>
  ),
};

export const Settings: Story = {
  render: () => (
    <CloudShell
      active="settings"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Settings' }]}
      title="Settings"
      description="Manage your team, notifications, and account preferences."
    >
      <SettingsPage />
    </CloudShell>
  ),
};

export const Billing: Story = {
  render: () => (
    <CloudShell
      active="billing"
      breadcrumbs={[{ label: 'Home', href: '#' }, { label: 'Billing' }]}
      title="Billing"
      description="Your plan, usage, and invoice history."
    >
      <BillingPage />
    </CloudShell>
  ),
};
