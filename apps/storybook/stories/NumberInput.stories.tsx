import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput, Field, Stack } from '@aspect/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Atoms/NumberInput',
  component: NumberInput,
  parameters: { layout: 'padded' },
  args: { defaultValue: 1, 'aria-label': 'Quantity' },
  argTypes: {
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number', min: 0.01, step: 0.01 } },
    precision: { control: { type: 'number', min: 0, max: 6, step: 1 } },
    align: { control: 'inline-radio', options: ['start', 'end'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBounds: Story = {
  args: { defaultValue: 5, min: 0, max: 10, 'aria-label': 'Seats' },
};

export const WithStep: Story = {
  args: { defaultValue: 0, step: 0.25, precision: 2, 'aria-label': 'Hours' },
};

export const CurrencyPrefix: Story = {
  render: () => (
    <Field label="Line total" description="Excluding tax">
      <NumberInput defaultValue={1200} min={0} prefix="$" align="end" precision={2} />
    </Field>
  ),
};

export const PercentSuffix: Story = {
  render: () => (
    <Field label="Tax rate">
      <NumberInput defaultValue={20} min={0} max={100} suffix="%" />
    </Field>
  ),
};

export const HiddenSteppers: Story = {
  args: { hideSteppers: true, defaultValue: 42, 'aria-label': 'Count' },
};

export const InsideField: Story = {
  render: () => (
    <Stack gap="1rem" style={{ maxWidth: 360 }}>
      <Field label="Quantity" required>
        <NumberInput defaultValue={1} min={1} max={99} />
      </Field>
      <Field label="Unit price" description="Before discount">
        <NumberInput defaultValue={0} min={0} step={0.01} precision={2} prefix="$" />
      </Field>
      <Field label="Discount" errorMessage="Discount cannot exceed 100%">
        <NumberInput defaultValue={150} min={0} max={100} suffix="%" />
      </Field>
    </Stack>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(10);
    return (
      <Stack gap="0.5rem">
        <Field label="Quantity">
          <NumberInput value={value} onValueChange={setValue} min={0} max={100} />
        </Field>
        <p>Current value: {value ?? '(empty)'}</p>
      </Stack>
    );
  },
};
