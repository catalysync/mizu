import { Heading, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/Heading',
  tags: ['autodocs', 'experimental'],
  component: Heading,
  parameters: { layout: 'padded' },
  args: { level: 1, children: 'Heading text' },
  argTypes: {
    level: { control: { type: 'select' }, options: [1, 2, 3, 4, 5, 6] },
    size: {
      control: { type: 'select' },
      options: [undefined, 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'],
    },
    as: {
      control: { type: 'select' },
      options: [undefined, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = { args: { level: 1, children: 'Describe the product' } };
export const H2: Story = { args: { level: 2, children: 'Pick the industry' } };
export const H3: Story = { args: { level: 3, children: 'Get the design system' } };

export const SizeOverride: Story = {
  args: { level: 1, size: 'md', children: 'H1 rendered at md size' },
};

export const AsOverride: Story = {
  args: {
    level: 2,
    as: 'h6',
    children: 'Semantic h6 with visual h2 size',
  },
};

export const AllLevels: Story = {
  render: () => (
    <Stack gap="1rem">
      <Heading level={1}>H1 — Main page title</Heading>
      <Heading level={2}>H2 — Section title</Heading>
      <Heading level={3}>H3 — Sub-section title</Heading>
      <Heading level={4}>H4 — Group title</Heading>
      <Heading level={5}>H5 — Minor heading</Heading>
      <Heading level={6}>H6 — Utility heading</Heading>
    </Stack>
  ),
};
