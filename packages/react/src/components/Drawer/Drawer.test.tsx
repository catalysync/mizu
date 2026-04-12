import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from './Drawer';

function TestDrawer({ side = 'right', open = true }: { side?: string; open?: boolean }) {
  return (
    <Drawer open={open}>
      <DrawerContent side={side as any}>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>Drawer desc</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>Body here</DrawerBody>
        <DrawerFooter>
          <DrawerClose>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

describe('Drawer', () => {
  it('renders the title', () => {
    render(<TestDrawer />);
    expect(screen.getByText('Drawer title')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<TestDrawer />);
    expect(screen.getByText('Drawer desc')).toBeInTheDocument();
  });

  it('renders body content', () => {
    render(<TestDrawer />);
    expect(screen.getByText('Body here')).toBeInTheDocument();
  });

  it('renders footer with close button', () => {
    render(<TestDrawer />);
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('renders an overlay', () => {
    render(<TestDrawer />);
    expect(document.querySelector('.mizu-drawer__overlay')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<TestDrawer open={false} />);
    expect(screen.queryByText('Drawer title')).not.toBeInTheDocument();
  });

  it('applies right side by default', () => {
    render(<TestDrawer />);
    expect(document.querySelector('.mizu-drawer__content')).toHaveAttribute('data-side', 'right');
  });

  it('applies left side', () => {
    render(<TestDrawer side="left" />);
    expect(document.querySelector('.mizu-drawer__content')).toHaveAttribute('data-side', 'left');
  });

  it('applies bottom side', () => {
    render(<TestDrawer side="bottom" />);
    expect(document.querySelector('.mizu-drawer__content')).toHaveAttribute('data-side', 'bottom');
  });

  it('renders header with class', () => {
    render(<TestDrawer />);
    expect(document.querySelector('.mizu-drawer__header')).toBeInTheDocument();
  });

  it('renders body with class', () => {
    render(<TestDrawer />);
    expect(document.querySelector('.mizu-drawer__body')).toBeInTheDocument();
  });

  it('renders footer with class', () => {
    render(<TestDrawer />);
    expect(document.querySelector('.mizu-drawer__footer')).toBeInTheDocument();
  });

  it('has no axe violations (right)', async () => {
    const { container } = render(<TestDrawer />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (left)', async () => {
    const { container } = render(<TestDrawer side="left" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
