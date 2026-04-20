import { RadioGroup, RadioItem } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Form Controls/Radio',
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup aria-label="Plan" defaultValue="pro">
      <RadioItem value="free" label="Free" />
      <RadioItem value="pro" label="Pro — $9/mo" />
      <RadioItem value="team" label="Team — $29/mo" />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup
      aria-label="Size"
      defaultValue="md"
      style={{ flexDirection: 'row', gap: 'var(--mizu-spacing-4)' }}
    >
      <RadioItem value="sm" label="Small" />
      <RadioItem value="md" label="Medium" />
      <RadioItem value="lg" label="Large" />
    </RadioGroup>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup aria-label="Region" defaultValue="us">
      <RadioItem value="us" label="US East" />
      <RadioItem value="eu" label="EU West" />
      <RadioItem value="ap" label="AP South" disabled />
    </RadioGroup>
  ),
};
