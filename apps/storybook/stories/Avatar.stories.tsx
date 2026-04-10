import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Inline } from '@aspect/react';

const meta = {
  title: 'Components/Atoms/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  args: { initials: 'JD', size: 'md' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitials: Story = {};

export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/80?u=jane', alt: 'Jane Doe', initials: undefined },
};

export const AllSizes: Story = {
  render: () => (
    <Inline gap="0.75rem" align="center">
      <Avatar size="sm" initials="S" />
      <Avatar size="md" initials="M" />
      <Avatar size="lg" initials="L" />
      <Avatar size="xl" initials="XL" />
    </Inline>
  ),
};

export const Fallback: Story = {
  args: { initials: 'AB', src: undefined },
};
