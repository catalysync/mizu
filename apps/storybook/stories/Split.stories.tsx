import type { Meta, StoryObj } from '@storybook/react-vite';
import { Split } from '@aspect/react';

const meta = {
  title: 'Layouts/Split',
  component: Split,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Split>;

export default meta;
type Story = StoryObj<typeof meta>;

const pane = (label: string): React.CSSProperties => ({
  padding: '1rem',
  background: 'var(--mizu-surface-secondary)',
  borderRadius: 'var(--mizu-radius-md)',
  color: 'var(--mizu-text-primary)',
  fontFamily: 'var(--mizu-font-family-sans)',
});

export const Default: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <Split gap="1rem">
        <div style={pane('left')}>Left — 1fr</div>
        <div style={pane('right')}>Right — 1fr</div>
      </Split>
    </div>
  ),
};

export const OneThird: Story = {
  render: () => (
    <div style={{ width: 600 }}>
      <Split gap="1rem" fraction="1fr 2fr">
        <div style={pane('left')}>Sidebar</div>
        <div style={pane('right')}>Main content (2x wider)</div>
      </Split>
    </div>
  ),
};
