import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from './Toast';

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
});
