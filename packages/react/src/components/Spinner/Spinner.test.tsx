import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with role="status" and a default label', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('uses a custom label when provided', () => {
    render(<Spinner label="Fetching data" />);
    expect(screen.getByText('Fetching data')).toBeInTheDocument();
  });

  it('applies size variant class', () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass('mizu-spinner--size-lg');
  });

  it('defaults to size sm', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('mizu-spinner--size-sm');
  });

  it('forwards className', () => {
    const { container } = render(<Spinner className="extra" />);
    expect(container.firstChild).toHaveClass('extra');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spinner label="Loading results" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
