import { Inline, Spinner } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/Spinner',
  component: Spinner,
  parameters: { layout: 'padded' },
  args: { size: 'sm' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <Inline gap="1rem" align="center">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Inline>
  ),
};

export const CustomLabel: Story = {
  args: { size: 'md', label: 'Fetching accounts' },
};
