import { Banner } from '@aspect/commerce';
import '@aspect/commerce/css';
import { Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Commerce/Banner',
  component: Banner,
  parameters: { layout: 'padded' },
  args: { title: 'Notice', children: 'This is an informational banner.' },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'Order fulfilled',
    children: 'Order #1042 has been shipped to Sarah Chen.',
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    title: 'Low stock',
    children: '3 products have fewer than 5 units remaining.',
  },
};

export const Critical: Story = {
  args: {
    tone: 'critical',
    title: 'Payment failed',
    children: 'The payment for order #1039 was declined.',
  },
};

export const Dismissible: Story = {
  args: {
    tone: 'info',
    title: 'New feature',
    children: 'Try the new bulk editing tool.',
    onDismiss: () => {},
  },
};

export const AllTones: Story = {
  render: () => (
    <Stack gap="0.75rem">
      <Banner tone="info" title="Info">
        Informational message.
      </Banner>
      <Banner tone="success" title="Success">
        Operation completed.
      </Banner>
      <Banner tone="warning" title="Warning">
        Requires attention.
      </Banner>
      <Banner tone="critical" title="Critical">
        Something went wrong.
      </Banner>
    </Stack>
  ),
};

export const WithoutTitle: Story = {
  args: { title: undefined, children: 'A simple banner without a title.' },
};
