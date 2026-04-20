import { Input, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/Input',
  component: Input,
  parameters: { layout: 'centered' },
  args: { placeholder: 'Type something…', 'aria-label': 'Demo input' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm', placeholder: 'Small input' } };
export const Large: Story = { args: { size: 'lg', placeholder: 'Large input' } };
export const Disabled: Story = { args: { disabled: true, value: 'Read-only' } };
export const WithValue: Story = { args: { defaultValue: 'hello@example.com' } };

export const AllSizes: Story = {
  render: () => (
    <Stack gap="0.75rem" className="story-md">
      <Input size="sm" placeholder="Small" aria-label="Small" />
      <Input size="md" placeholder="Medium" aria-label="Medium" />
      <Input size="lg" placeholder="Large" aria-label="Large" />
    </Stack>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Stack gap="0.25rem" className="story-md">
      <label htmlFor="email-input" className="mizu-label">
        Email
      </label>
      <Input id="email-input" type="email" placeholder="you@example.com" />
      <span className="mizu-caption">We will never share your email.</span>
    </Stack>
  ),
};
