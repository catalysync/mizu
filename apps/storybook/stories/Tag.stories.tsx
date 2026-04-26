import { Inline, Tag } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/Tag',
  tags: ['autodocs', 'experimental'],
  component: Tag,
  parameters: { layout: 'centered' },
  args: { children: 'React', tone: 'neutral' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'success', 'warning', 'danger', 'info'] },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Success: Story = { args: { tone: 'success', children: 'Deployed' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Review' } };
export const Danger: Story = { args: { tone: 'danger', children: 'Blocked' } };
export const Info: Story = { args: { tone: 'info', children: 'Beta' } };

export const Dismissible: Story = {
  args: { children: 'Removable', onDismiss: () => {} },
};

export const AllTones: Story = {
  render: () => (
    <Inline gap="0.5rem">
      <Tag tone="neutral">Neutral</Tag>
      <Tag tone="success">Success</Tag>
      <Tag tone="warning">Warning</Tag>
      <Tag tone="danger">Danger</Tag>
      <Tag tone="info" onDismiss={() => {}}>
        Dismissible
      </Tag>
    </Inline>
  ),
};
