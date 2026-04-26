import { ResizableGroup, ResizableHandle, ResizablePanel } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Layouts/Resizable',
  tags: ['autodocs', 'experimental'],
  component: ResizableGroup,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ResizableGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const paneStyle: React.CSSProperties = {
  padding: 16,
  height: '100%',
  background: 'var(--mizu-surface-secondary)',
  display: 'grid',
  placeItems: 'center',
  color: 'var(--mizu-text-secondary)',
  fontFamily: 'var(--mizu-font-family-sans)',
};

export const Horizontal: Story = {
  render: () => (
    <div style={{ height: '100dvh' }}>
      <ResizableGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={15}>
          <div style={paneStyle}>Left — 30%</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <div style={paneStyle}>Right — 70%</div>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ height: '100dvh' }}>
      <ResizableGroup direction="vertical">
        <ResizablePanel defaultSize={50}>
          <div style={paneStyle}>Top — 50%</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div style={paneStyle}>Bottom — 50%</div>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <div style={{ height: '100dvh' }}>
      <ResizableGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={10}>
          <div style={paneStyle}>Sidebar</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={55}>
          <div style={paneStyle}>Main</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25} minSize={15}>
          <div style={paneStyle}>Inspector</div>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <div style={{ height: '100dvh' }}>
      <ResizableGroup direction="horizontal">
        <ResizablePanel defaultSize={30}>
          <div style={paneStyle}>Left</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <ResizableGroup direction="vertical">
            <ResizablePanel defaultSize={60}>
              <div style={paneStyle}>Top Right</div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40}>
              <div style={paneStyle}>Bottom Right</div>
            </ResizablePanel>
          </ResizableGroup>
        </ResizablePanel>
      </ResizableGroup>
    </div>
  ),
};
