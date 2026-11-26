import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './Toast';

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
});
