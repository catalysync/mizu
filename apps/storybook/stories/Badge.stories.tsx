import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Inline } from '@aspect/react';

const meta = {
  title: 'Components/Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  args: { children: 'Badge', tone: 'neutral' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'success', 'warning', 'danger', 'info'] },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Success: Story = { args: { tone: 'success', children: 'Active' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Pending' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Failed' } };
export const Info: Story = { args: { tone: 'info', children: 'New' } };

export const WithDot: Story = {
  args: { tone: 'success', dot: true, children: 'Running' },
};

export const AllTones: Story = {
  render: () => (
    <Inline gap="0.5rem">
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="success" dot>
        Success
      </Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
      <Badge tone="info">Info</Badge>
    </Inline>
  ),
};
