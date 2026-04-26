import { Field, Stack, TimeInput } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/TimeInput',
  tags: ['autodocs', 'experimental'],
  component: TimeInput,
  parameters: { layout: 'padded' },
  args: { 'aria-label': 'Time', defaultValue: '09:30' },
  argTypes: {
    format: { control: { type: 'select' }, options: ['24h', '12h'] },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwelveHour: Story = { args: { format: '12h', defaultValue: '14:05' } };
export const NoIcon: Story = { args: { showIcon: false } };

export const InsideField: Story = {
  render: () => (
    <Stack gap="1rem" style={{ maxWidth: 360 }}>
      <Field label="Start time" required>
        <TimeInput defaultValue="09:00" />
      </Field>
      <Field label="End time" description="Must be after start time">
        <TimeInput defaultValue="17:30" />
      </Field>
    </Stack>
  ),
};
