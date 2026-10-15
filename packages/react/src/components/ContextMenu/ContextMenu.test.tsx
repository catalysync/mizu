import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
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

describe('ContextMenu checkbox and radio items', () => {
  function CheckableMenu({
    onCheckedChange,
    onValueChange,
  }: {
    onCheckedChange?: (checked: boolean) => void;
    onValueChange?: (value: string) => void;
  }) {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Canvas</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked onCheckedChange={onCheckedChange}>
            Show grid
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value="fit" onValueChange={onValueChange}>
            <ContextMenuRadioItem value="fit">Fit</ContextMenuRadioItem>
            <ContextMenuRadioItem value="fill">Fill</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  it('renders checkable items with their checked state', () => {
    render(<CheckableMenu />);
    fireEvent.contextMenu(screen.getByText('Canvas'));
    const grid = screen.getByRole('menuitemcheckbox', { name: 'Show grid' });
    expect(grid).toBeChecked();
    expect(grid).toHaveClass('mizu-context-menu__item', 'mizu-context-menu__item--checkable');
    expect(screen.getByRole('menuitemradio', { name: 'Fit' })).toBeChecked();
    expect(screen.getByRole('menuitemradio', { name: 'Fill' })).not.toBeChecked();
  });

  it('reports changes through onCheckedChange and onValueChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const onValueChange = vi.fn();
    const { unmount } = render(<CheckableMenu onCheckedChange={onCheckedChange} />);
    fireEvent.contextMenu(screen.getByText('Canvas'));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Show grid' }));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    unmount();

    render(<CheckableMenu onValueChange={onValueChange} />);
    fireEvent.contextMenu(screen.getByText('Canvas'));
    await user.click(screen.getByRole('menuitemradio', { name: 'Fill' }));
    expect(onValueChange).toHaveBeenCalledWith('fill');
  });

  it('is exported from the package entry', async () => {
    const pkg = await import('../../index');
    expect(pkg.ContextMenuCheckboxItem).toBeDefined();
    expect(pkg.ContextMenuRadioItem).toBeDefined();
  });

  it('has no axe violations when open', async () => {
    render(<CheckableMenu />);
    fireEvent.contextMenu(screen.getByText('Canvas'));
    // Disable region rule — portaled content renders outside landmarks by design
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
