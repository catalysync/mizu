import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
