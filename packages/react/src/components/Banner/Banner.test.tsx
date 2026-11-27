import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders title and children', () => {
    render(<Banner title="Notice">Body text</Banner>);
    expect(screen.getByText('Notice')).toBeInTheDocument();
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('uses role status for info, success and warning', () => {
    const { rerender } = render(<Banner tone="info">Info</Banner>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(<Banner tone="success">OK</Banner>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(<Banner tone="warning">Careful</Banner>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses role alert for critical', () => {
    render(<Banner tone="critical">Payment failed</Banner>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('lets role override the tone default', () => {
    render(
      <Banner tone="critical" role="status">
        Live
      </Banner>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies the tone class and merges className', () => {
    const { container } = render(
      <Banner tone="warning" className="custom">
        X
      </Banner>,
    );
    expect(container.firstChild).toHaveClass('mizu-banner', 'mizu-banner--warning', 'custom');
  });

  it('calls onDismiss from the dismiss button', () => {
    const onDismiss = vi.fn();
    render(<Banner onDismiss={onDismiss}>X</Banner>);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('labels the dismiss button with dismissLabel', () => {
    render(
      <Banner onDismiss={() => {}} dismissLabel="Close banner">
        X
      </Banner>,
    );
    expect(screen.getByRole('button', { name: 'Close banner' })).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Banner ref={ref}>X</Banner>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations (dismissible critical)', async () => {
    const { container } = render(
      <Banner tone="critical" title="Payment failed" onDismiss={() => {}}>
        The payment was declined.
      </Banner>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
