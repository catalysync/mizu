import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from './Drawer';

function TestDrawer({
  side = 'right' as const,
  onOpenChange,
}: {
  side?: 'left' | 'right' | 'top' | 'bottom';
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Drawer onOpenChange={onOpenChange}>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent side={side}>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <DrawerClose>Close</DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDrawer />);
    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders with dialog role', async () => {
    const user = userEvent.setup();
    render(<TestDrawer />);
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on escape', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<TestDrawer onOpenChange={onOpenChange} />);
    await user.click(screen.getByText('Open'));
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes via close button', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<TestDrawer onOpenChange={onOpenChange} />);
    await user.click(screen.getByText('Open'));
    await user.click(screen.getByText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('sets data-side attribute', async () => {
    const user = userEvent.setup();
    render(<TestDrawer side="left" />);
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'left');
  });

  it('has no a11y violations', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestDrawer />);
    await user.click(screen.getByText('Open'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
