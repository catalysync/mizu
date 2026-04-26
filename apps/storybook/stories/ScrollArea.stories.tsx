import { ScrollArea, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Atoms/ScrollArea',
  tags: ['autodocs', 'experimental'],
  component: ScrollArea,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const longContent = Array.from({ length: 30 }, (_, i) => (
  <p key={i} className="mizu-body--sm">
    Line {i + 1} — the quick brown fox jumps over the lazy dog.
  </p>
));

export const Vertical: Story = {
  render: () => (
    <ScrollArea style={{ height: 240, width: 280 }}>
      <Stack gap="0.5rem">{longContent}</Stack>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea orientation="horizontal" style={{ width: 400 }}>
      <div style={{ display: 'flex', gap: 8, width: 1200, padding: 8 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              flex: '0 0 auto',
              width: 80,
              height: 80,
              background: 'var(--mizu-surface-secondary)',
              borderRadius: 'var(--mizu-radius-md)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea orientation="both" style={{ height: 240, width: 320 }}>
      <div style={{ width: 800 }}>
        <Stack gap="0.5rem">{longContent}</Stack>
      </div>
    </ScrollArea>
  ),
};
