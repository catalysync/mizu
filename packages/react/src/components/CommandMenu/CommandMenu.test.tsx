import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  CommandMenu,
  CommandMenuEmpty,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from './CommandMenu';
import { useCommandMenuShortcut } from './useCommandMenuShortcut';

describe('CommandMenu', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <CommandMenu>
        <CommandMenuInput placeholder="Search..." />
        <CommandMenuList>
          <CommandMenuEmpty>No results</CommandMenuEmpty>
          <CommandMenuGroup>
            <CommandMenuItem>New file</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>,
    );
    expect(container).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <CommandMenu>
        <CommandMenuInput placeholder="Search..." />
        <CommandMenuList>
          <CommandMenuItem>New file</CommandMenuItem>
        </CommandMenuList>
      </CommandMenu>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('useCommandMenuShortcut', () => {
  function Harness({ enabled }: { enabled?: boolean }) {
    const [open, setOpen] = React.useState(false);
    useCommandMenuShortcut({ open, onOpenChange: setOpen, enabled });
    return (
      <CommandMenu open={open} onOpenChange={setOpen}>
        <CommandMenuInput placeholder="Search..." />
        <CommandMenuList>
          <CommandMenuItem>New file</CommandMenuItem>
        </CommandMenuList>
      </CommandMenu>
    );
  }

  it('opens on Cmd+K (meta) and toggles closed on a second press', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog', { name: 'Command menu' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on Ctrl+K', () => {
    render(<Harness />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('ignores Alt or Shift combinations and other keys', () => {
    render(<Harness />);
    fireEvent.keyDown(window, { key: 'k', metaKey: true, shiftKey: true });
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true, altKey: true });
    fireEvent.keyDown(window, { key: 'j', metaKey: true });
    fireEvent.keyDown(window, { key: 'k' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('is a no-op when enabled={false}', () => {
    render(<Harness enabled={false} />);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no axe violations when open via the shortcut', async () => {
    render(<Harness />);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
