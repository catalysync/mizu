import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, Stack, Inline } from '@aspect/react';

const meta = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['rect', 'text', 'heading', 'circle', 'button'] },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { width: 200, height: 20 },
};

export const Text: Story = {
  args: { variant: 'text', width: '100%' },
};

export const Heading: Story = {
  args: { variant: 'heading' },
};

export const Circle: Story = {
  args: { variant: 'circle', width: 48, height: 48 },
};

export const ButtonShape: Story = {
  args: { variant: 'button' },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div
      style={{
        maxWidth: 320,
        padding: 'var(--mizu-spacing-4)',
        border: '1px solid var(--mizu-border-default)',
        borderRadius: 'var(--mizu-radius-md)',
      }}
    >
      <Stack gap="0.75rem">
        <Inline gap="0.75rem" align="center">
          <Skeleton variant="circle" width={40} height={40} />
          <Stack gap="0.25rem" style={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Stack>
        </Inline>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="75%" />
        <Skeleton variant="button" />
      </Stack>
    </div>
  ),
};
