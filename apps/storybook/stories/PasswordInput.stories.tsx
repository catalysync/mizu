import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput, estimatePasswordStrength, Field, Stack } from '@aspect/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Atoms/PasswordInput',
  component: PasswordInput,
  parameters: { layout: 'padded' },
  args: { 'aria-label': 'Password' },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithStrengthMeter: Story = {
  args: { defaultValue: 'hunter2', strength: 2 },
};

export const NoToggle: Story = {
  args: { showToggle: false, defaultValue: 'secret' },
};

export const InsideField: Story = {
  render: () => (
    <Field
      label="Password"
      description="At least 12 characters with a mix of case and symbols"
      required
    >
      <PasswordInput autoComplete="new-password" />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field label="Password" errorMessage="Password must be at least 8 characters" required>
      <PasswordInput defaultValue="abc" />
    </Field>
  ),
};

export const LiveStrength: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Stack gap="0.5rem" style={{ maxWidth: 400 }}>
        <Field label="New password" required>
          <PasswordInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            strength={estimatePasswordStrength(value)}
            autoComplete="new-password"
          />
        </Field>
      </Stack>
    );
  },
};
