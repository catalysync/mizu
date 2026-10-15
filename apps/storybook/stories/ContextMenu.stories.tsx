import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@mizunagara/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Components/Overlays/ContextMenu',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          style={{
            padding: '3rem 4rem',
            border: '2px dashed var(--mizu-border-default)',
            borderRadius: 'var(--mizu-radius-lg)',
            textAlign: 'center',
            color: 'var(--mizu-text-secondary)',
            fontFamily: 'var(--mizu-font-family-sans)',
            fontSize: 'var(--mizu-font-size-sm)',
          }}
        >
          Right-click this area
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>File</ContextMenuLabel>
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem danger>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Simple: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          style={{
            padding: '3rem 4rem',
            border: '2px dashed var(--mizu-border-default)',
            borderRadius: 'var(--mizu-radius-lg)',
            textAlign: 'center',
            color: 'var(--mizu-text-secondary)',
            fontFamily: 'var(--mizu-font-family-sans)',
            fontSize: 'var(--mizu-font-size-sm)',
          }}
        >
          Right-click this area
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Cut</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

function CheckableMenuDemo() {
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [zoom, setZoom] = useState('fit');
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          style={{
            padding: '3rem 4rem',
            border: '2px dashed var(--mizu-border-default)',
            borderRadius: 'var(--mizu-radius-lg)',
            textAlign: 'center',
            color: 'var(--mizu-text-secondary)',
            fontFamily: 'var(--mizu-font-family-sans)',
            fontSize: 'var(--mizu-font-size-sm)',
          }}
        >
          Right-click this area
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>View</ContextMenuLabel>
        <ContextMenuCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
          Show grid
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={showRulers} onCheckedChange={setShowRulers}>
          Show rulers
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Zoom</ContextMenuLabel>
        <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
          <ContextMenuRadioItem value="fit">Fit to window</ContextMenuRadioItem>
          <ContextMenuRadioItem value="100">100%</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const CheckableItems: Story = {
  render: () => <CheckableMenuDemo />,
};
