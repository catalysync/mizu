import { DateNavigator, type DateNavigatorValue } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Patterns/DateNavigator',
  component: DateNavigator,
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DateNavigator>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ initial }: { initial: DateNavigatorValue }) {
  const [value, setValue] = useState<DateNavigatorValue>(initial);
  return <DateNavigator value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: () => (
    <Controlled
      initial={{
        start: new Date(2026, 3, 15),
        end: new Date(2026, 3, 21),
        preset: 'last-7',
      }}
    />
  ),
};

export const CustomRange: Story = {
  render: () => (
    <Controlled
      initial={{
        start: new Date(2026, 2, 1),
        end: new Date(2026, 2, 31),
      }}
    />
  ),
};

export const HiddenArrows: Story = {
  render: () => {
    const [value, setValue] = useState<DateNavigatorValue>({
      start: new Date(2026, 3, 15),
      end: new Date(2026, 3, 15),
      preset: 'today',
    });
    return <DateNavigator value={value} onChange={setValue} hideArrows />;
  },
};
