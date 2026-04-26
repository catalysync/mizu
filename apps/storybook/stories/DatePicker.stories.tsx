import { DatePicker, DateRangePicker, Field, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Components/Atoms/DatePicker',
  tags: ['autodocs', 'experimental'],
  component: DatePicker,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field label="Invoice date">
      <DatePicker />
    </Field>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Field label="Due date">
      <DatePicker defaultValue="2026-05-01" />
    </Field>
  ),
};

export const WithMinMax: Story = {
  render: () => (
    <Field label="Payment date" description="Must be within the current fiscal year">
      <DatePicker min="2026-04-01" max="2027-03-31" />
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field label="Due date" errorMessage="Due date must be after today" required>
      <DatePicker defaultValue="2025-01-01" />
    </Field>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<string | null>('2026-04-11');
    return (
      <Stack gap="0.5rem" style={{ maxWidth: 360 }}>
        <Field label="Invoice date">
          <DatePicker value={date} onValueChange={setDate} />
        </Field>
        <p>Selected: {date ?? '(empty)'}</p>
      </Stack>
    );
  },
};

export const RangePicker: StoryObj<typeof DateRangePicker> = {
  render: () => (
    <Field label="Report period" description="Select start and end dates">
      <DateRangePicker defaultValue={{ start: '2026-04-01', end: '2026-04-30' }} />
    </Field>
  ),
};

export const Examples: Story = {
  render: () => (
    <Stack gap="1.5rem" style={{ maxWidth: 480 }}>
      <Field label="Invoice date" required>
        <DatePicker defaultValue="2026-04-11" />
      </Field>
      <Field label="Due date" description="Net 30 by default">
        <DatePicker defaultValue="2026-05-11" />
      </Field>
      <Field label="Fiscal period">
        <DateRangePicker defaultValue={{ start: '2026-04-01', end: '2027-03-31' }} />
      </Field>
    </Stack>
  ),
};
