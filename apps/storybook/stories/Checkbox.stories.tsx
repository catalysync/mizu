import { Checkbox, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Form Controls/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { 'aria-label': 'Accept' } };
export const WithLabel: Story = { args: { label: 'I agree to the terms' } };
export const Checked: Story = { args: { label: 'Checked by default', defaultChecked: true } };
export const Disabled: Story = { args: { label: 'Disabled', disabled: true } };
export const DisabledChecked: Story = {
  args: { label: 'Disabled checked', disabled: true, defaultChecked: true },
};

export const Group: Story = {
  render: () => (
    <Stack gap="0.5rem">
      <Checkbox label="Email notifications" defaultChecked />
      <Checkbox label="Push notifications" />
      <Checkbox label="SMS notifications" disabled />
    </Stack>
  ),
};
