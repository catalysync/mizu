import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from './Toast';

const renderToast = (props: { tone?: 'success' | 'danger' | 'warning' | 'info' } = {}) =>
  render(
    <ToastProvider>
      <Toast open {...props}>
        <ToastTitle>Saved</ToastTitle>
        <ToastDescription>Your changes have been saved.</ToastDescription>
      </Toast>
      <ToastViewport />
    </ToastProvider>,
  );

describe('Toast', () => {
  it('renders title and description', () => {
    renderToast();
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
  });

  it('applies tone class', () => {
    const { container } = renderToast({ tone: 'success' });
    expect(container.querySelector('.mizu-toast--success')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = renderToast();
    expect(await axe(container)).toHaveNoViolations();
  });
});
