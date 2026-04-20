import { Alert, AlertTitle, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
  args: { tone: 'info', children: 'This is an informational alert.' },
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};
export const Success: Story = { args: { tone: 'success', children: 'Operation completed.' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Check your settings.' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Something went wrong.' } };

export const WithTitle: Story = {
  render: () => (
    <Alert tone="danger">
      <AlertTitle>Deploy failed</AlertTitle>
      Build exited with code 1. Check the logs for details.
    </Alert>
  ),
};

export const Dismissible: Story = {
  render: () => (
    <Alert tone="warning" onDismiss={() => {}}>
      <AlertTitle>Rate limit approaching</AlertTitle>
      You have used 90% of your monthly quota.
    </Alert>
  ),
};

export const AllTones: Story = {
  render: () => (
    <Stack gap="0.75rem">
      <Alert tone="info">
        <AlertTitle>Info</AlertTitle>A new version is available.
      </Alert>
      <Alert tone="success">
        <AlertTitle>Success</AlertTitle>Changes saved.
      </Alert>
      <Alert tone="warning">
        <AlertTitle>Warning</AlertTitle>This action is irreversible.
      </Alert>
      <Alert tone="danger">
        <AlertTitle>Error</AlertTitle>Failed to connect.
      </Alert>
    </Stack>
  ),
};
