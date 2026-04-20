import { Checkbox, Fieldset, Input, Label, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/Fieldset',
  component: Fieldset,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Fieldset legend="Contact details">
      <Stack gap="0.75rem">
        <Stack gap="0.25rem">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" />
        </Stack>
        <Stack gap="0.25rem">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </Stack>
      </Stack>
    </Fieldset>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Fieldset
      legend="Notification preferences"
      description="Choose which emails you'd like to receive."
    >
      <Stack gap="0.5rem">
        <Checkbox>Product updates</Checkbox>
        <Checkbox>Billing reminders</Checkbox>
        <Checkbox>Security alerts</Checkbox>
      </Stack>
    </Fieldset>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Fieldset legend="Billing address" description="Sign in to edit your billing details." disabled>
      <Stack gap="0.75rem">
        <Stack gap="0.25rem">
          <Label htmlFor="street">Street</Label>
          <Input id="street" />
        </Stack>
        <Stack gap="0.25rem">
          <Label htmlFor="city">City</Label>
          <Input id="city" />
        </Stack>
      </Stack>
    </Fieldset>
  ),
};
