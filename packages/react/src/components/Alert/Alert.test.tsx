import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Alert, AlertTitle } from './Alert';

describe('Alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it.each(['info', 'success', 'warning', 'danger'] as const)(
    'applies the %s tone class',
    (tone) => {
      const { container } = render(<Alert tone={tone}>Message</Alert>);
      expect(container.firstChild).toHaveClass(`mizu-alert--${tone}`);
    },
  );

  it('renders AlertTitle', () => {
    render(
      <Alert>
        <AlertTitle>Error</AlertTitle>
        Something went wrong
      </Alert>,
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders dismiss button and calls onDismiss', async () => {
    const onDismiss = vi.fn();
    render(<Alert onDismiss={onDismiss}>Dismissable</Alert>);
    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Alert tone="danger">
        <AlertTitle>Error</AlertTitle>
        Something went wrong
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
