import { Textarea } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/Textarea',
  tags: ['autodocs', 'experimental'],
  component: Textarea,
  parameters: { layout: 'centered' },
  args: { placeholder: 'Write something…', 'aria-label': 'Notes' },
  argTypes: { disabled: { control: 'boolean' } },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true, value: 'Read-only content' } };
