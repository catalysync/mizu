import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider, Stack } from '@aspect/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Atoms/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Value',
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    className: 'story-md',
  },
  argTypes: {
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number', min: 0.1, step: 0.1 } },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Stepped: Story = {
  args: { defaultValue: [25], step: 25 },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Range: Story = {
  args: { defaultValue: [20, 80] },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<number[]>([40]);
    return (
      <Stack gap="0.75rem">
        <Slider {...args} value={value} onValueChange={setValue} />
        <div className="mizu-body--sm">Current: {value[0]}</div>
      </Stack>
    );
  },
};

/**
 * A11y: always provide `aria-label` or wrap in a labelled form group.
 * Without a label, screen readers announce only the value.
 */
export const Inaccessible: Story = {
  args: {
    // intentionally omit aria-label to trigger a11y addon warning
    'aria-label': undefined,
  },
};

export const Accessible: Story = {
  args: { 'aria-label': 'Brightness' },
};
