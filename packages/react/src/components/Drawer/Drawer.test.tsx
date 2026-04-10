import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from './Drawer';

function TestDrawer() {
  return (
    <Drawer>
      <DrawerTrigger>Open drawer</DrawerTrigger>
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDrawer />);
    await user.click(screen.getByText('Open drawer'));
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('has no a11y violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestDrawer />);
    await user.click(screen.getByText('Open drawer'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
