import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
} from './Toast';
import { dismissToast, getToastsSnapshot, toast } from './toast-queue';

describe('Toast', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>Saved.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('renders the viewport', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(document.querySelector('[role="region"]')).toBeInTheDocument();
  });

  it('has no axe violations (provider only)', async () => {
    const { container } = render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('gives the close button an accessible name without props', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Saved</ToastTitle>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('lets a prop override the close button label', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastClose aria-label="Dismiss" />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('names the viewport region by default and lets a prop override it', () => {
    const { unmount } = render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByRole('region', { name: /^Notifications \(/ })).toBeInTheDocument();
    unmount();

    render(
      <ToastProvider>
        <ToastViewport label="Alerts ({hotkey})" />
      </ToastProvider>,
    );
    expect(screen.getByRole('region', { name: /^Alerts \(/ })).toBeInTheDocument();
  });

  it('fires the onClick of an action button', () => {
    const onUndo = vi.fn();
    render(
      <ToastProvider>
        <Toast open actions={[{ children: 'Undo', onClick: onUndo }]}>
          <ToastTitle>Deleted</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations with actions', async () => {
    const { container } = render(
      <ToastProvider>
        <Toast open actions={[{ children: 'Undo' }]}>
          <ToastTitle>Deleted</ToastTitle>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('toast() queue', () => {
  afterEach(() => {
    act(() => {
      for (const item of getToastsSnapshot()) dismissToast(item.id);
    });
  });

  it('replaces an entry with the same id instead of adding a second one', () => {
    render(<Toaster />);
    act(() => {
      toast({ id: 'save', title: 'Saving' });
    });
    act(() => {
      toast({ id: 'save', title: 'Saved' });
    });
    expect(getToastsSnapshot()).toHaveLength(1);
    expect(document.querySelectorAll('[data-component="mizu-toast"]')).toHaveLength(1);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.queryByText('Saving')).not.toBeInTheDocument();
  });

  it('shows queued toasts with their action buttons and fires the action', () => {
    const onRetry = vi.fn();
    render(<Toaster />);
    act(() => {
      toast({
        title: 'Upload failed',
        description: 'Check your connection.',
        tone: 'danger',
        actions: [{ children: 'Retry', onClick: onRetry }],
      });
    });
    const item = document.querySelector<HTMLElement>('[data-component="mizu-toast"]');
    if (!item) throw new Error('queued toast was not rendered');
    expect(within(item).getByText('Upload failed')).toBeInTheDocument();
    expect(within(item).getByText('Check your connection.')).toBeInTheDocument();
    fireEvent.click(within(item).getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('removes a toast when its close button is pressed', () => {
    render(<Toaster />);
    act(() => {
      toast({ id: 'once', title: 'Copied' });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(getToastsSnapshot()).toHaveLength(0);
  });

  it('has no axe violations with queued toasts', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast({ title: 'Saved', actions: [{ children: 'Undo' }] });
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
