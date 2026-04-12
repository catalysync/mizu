import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './DropdownMenu';

function TestMenu({ onSelect }: { onSelect?: (v: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onSelect?.('edit')}>Edit</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect?.('copy')}>Copy</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onSelect?.('delete')}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('renders the trigger', () => {
    render(<TestMenu />);
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(<TestMenu />);
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('opens on click', async () => {
    render(<TestMenu />);
    await userEvent.setup().click(screen.getByText('Actions'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('renders label when open', async () => {
    render(<TestMenu />);
    await userEvent.setup().click(screen.getByText('Actions'));
    expect(screen.getByText('Options')).toBeInTheDocument();
  });

  it('fires onSelect', async () => {
    const onSelect = vi.fn();
    render(<TestMenu onSelect={onSelect} />);
    await userEvent.setup().click(screen.getByText('Actions'));
    await userEvent.setup().click(screen.getByText('Edit'));
    expect(onSelect).toHaveBeenCalledWith('edit');
  });

  it('has no axe violations (closed)', async () => {
    const { container } = render(<TestMenu />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
