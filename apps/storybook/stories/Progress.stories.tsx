import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress, Stack } from '@aspect/react';

const meta = {
  title: 'Components/Feedback/Progress',
  component: Progress,
  parameters: { layout: 'padded' },
  args: { value: 60, max: 100 },
  argTypes: {
    tone: { control: 'select', options: ['default', 'success', 'warning', 'danger'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { value: 75, label: 'Uploading', showValue: true },
};

export const Success: Story = {
  args: { value: 100, tone: 'success', label: 'Complete', showValue: true },
};

export const Warning: Story = {
  args: { value: 85, tone: 'warning', label: 'Storage', showValue: true },
};

export const Danger: Story = {
  args: { value: 95, tone: 'danger', label: 'CPU Usage', showValue: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Loading...' },
};

export const AllTones: Story = {
  render: () => (
    <Stack gap="1rem" style={{ maxWidth: 400 }}>
      <Progress value={40} label="Default" showValue />
      <Progress value={70} tone="success" label="Success" showValue />
      <Progress value={85} tone="warning" label="Warning" showValue />
      <Progress value={95} tone="danger" label="Danger" showValue />
      <Progress indeterminate label="Indeterminate" />
    </Stack>
  ),
};
