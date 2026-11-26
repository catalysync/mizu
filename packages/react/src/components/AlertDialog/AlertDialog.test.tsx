import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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

  it('applies the md size by default', () => {
    render(<TestAlertDialog />);
    expect(document.querySelector('.mizu-alert-dialog__content')).toHaveAttribute(
      'data-size',
      'md',
    );
  });

  it('applies the requested size', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent size="lg">
          <AlertDialogTitle>Wide</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>,
    );
    expect(document.querySelector('.mizu-alert-dialog__content')).toHaveAttribute(
      'data-size',
      'lg',
    );
  });

  it('renders a body region between header and footer', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Long</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <p>Body text</p>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    const body = document.querySelector('.mizu-alert-dialog__body');
    expect(body).toContainElement(screen.getByText('Body text'));
    expect(body?.nextElementSibling).toHaveClass('mizu-alert-dialog__footer');
  });

  it('has no axe violations', async () => {
    render(<TestAlertDialog />);
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('has no axe violations with a body region', async () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <p>Body text</p>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
