import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Stack } from '@aspect/react';

const meta = {
  title: 'Components/Atoms/Input',
  component: Input,
  parameters: { layout: 'centered' },
  args: { placeholder: 'Type something…' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Disabled: Story = { args: { disabled: true, value: 'Read-only' } };

export const AllSizes: Story = {
  render: () => (
    <Stack gap="0.75rem">
      <Input size="sm" placeholder="Small" aria-label="Small input" />
      <Input size="md" placeholder="Medium (default)" aria-label="Medium input" />
      <Input size="lg" placeholder="Large" aria-label="Large input" />
    </Stack>
  ),
};
