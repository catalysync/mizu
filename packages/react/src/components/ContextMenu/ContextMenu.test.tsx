import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from './ContextMenu';

function TestContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div style={{ padding: '2rem', border: '1px dashed gray' }}>Right-click me</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem danger>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

describe('ContextMenu', () => {
  it('renders the trigger area', () => {
    render(<TestContextMenu />);
    expect(screen.getByText('Right-click me')).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(<TestContextMenu />);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('has no axe violations (closed)', async () => {
    const { container } = render(<TestContextMenu />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
