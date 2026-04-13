import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog';

function TestAlertDialog({ open = true }: { open?: boolean }) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete item</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe('AlertDialog', () => {
  it('renders title when open', () => {
    render(<TestAlertDialog />);
    expect(screen.getByText('Delete item')).toBeInTheDocument();
  });

  it('renders description when open', () => {
    render(<TestAlertDialog />);
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('renders action and cancel buttons', () => {
    render(<TestAlertDialog />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<TestAlertDialog open={false} />);
    expect(screen.queryByText('Delete item')).not.toBeInTheDocument();
  });

  it('renders overlay', () => {
    render(<TestAlertDialog />);
    expect(document.querySelector('.mizu-alert-dialog__overlay')).toBeInTheDocument();
  });

  it('renders content with class', () => {
    render(<TestAlertDialog />);
    expect(document.querySelector('.mizu-alert-dialog__content')).toBeInTheDocument();
  });

  it('renders header with class', () => {
    render(<TestAlertDialog />);
    expect(document.querySelector('.mizu-alert-dialog__header')).toBeInTheDocument();
  });

  it('renders footer with class', () => {
    render(<TestAlertDialog />);
    expect(document.querySelector('.mizu-alert-dialog__footer')).toBeInTheDocument();
  });

  it('opens via trigger', async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByText('Open'));
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('fires action on click', async () => {
    const onAction = vi.fn();
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={onAction}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await userEvent.setup().click(screen.getByText('Yes'));
    expect(onAction).toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    render(<TestAlertDialog />);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
