import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Input, Stack } from '@aspect/react';

const meta = {
  title: 'Components/Atoms/Label',
  component: Label,
  parameters: { layout: 'padded' },
  args: { children: 'Email address' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true, children: 'Email address' },
};

export const CustomRequiredLabel: Story = {
  args: {
    required: true,
    requiredLabel: 'must be filled in',
    children: 'Email address',
  },
};

export const WithInput: Story = {
  render: () => (
    <Stack gap="0.25rem">
      <Label htmlFor="email" required>
        Email address
      </Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </Stack>
  ),
};
