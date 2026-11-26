import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Alert, AlertTitle, Callout } from './Alert';

describe('Alert', () => {
  it('renders with text content', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('uses role alert for danger', () => {
    render(<Alert tone="danger">Failed</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('uses role status for info, success and warning', () => {
    const { rerender } = render(<Alert>Info</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(<Alert tone="success">OK</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    rerender(<Alert tone="warning">Careful</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('lets an explicit role override the tone default', () => {
    render(
      <Alert tone="info" role="note">
        Note
      </Alert>,
    );
    expect(screen.getByRole('note')).toBeInTheDocument();
  });

  it('renders a default icon for each tone', () => {
    const { container } = render(<Alert tone="warning">Careful</Alert>);
    const icon = container.querySelector('.mizu-alert__icon svg');
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('hides the icon when icon is null', () => {
    const { container } = render(<Alert icon={null}>Plain</Alert>);
    expect(container.querySelector('.mizu-alert__icon')).toBeNull();
  });

  it('uses a custom icon when provided', () => {
    render(<Alert icon={<span data-testid="custom-icon" />}>X</Alert>);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('labels the dismiss button with dismissLabel', () => {
    render(
      <Alert onDismiss={() => {}} dismissLabel="Close notice">
        X
      </Alert>,
    );
    expect(screen.getByRole('button', { name: 'Close notice' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('renders AlertTitle', () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        Details here
      </Alert>,
    );
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Details here')).toBeInTheDocument();
  });

  it('applies the info tone by default', () => {
    const { container } = render(<Alert>X</Alert>);
    expect(container.firstChild).toHaveClass('mizu-alert--info');
  });

  it('applies the success tone', () => {
    const { container } = render(<Alert tone="success">OK</Alert>);
    expect(container.firstChild).toHaveClass('mizu-alert--success');
  });

  it('applies the warning tone', () => {
    const { container } = render(<Alert tone="warning">Caution</Alert>);
    expect(container.firstChild).toHaveClass('mizu-alert--warning');
  });

  it('applies the danger tone', () => {
    const { container } = render(<Alert tone="danger">Error</Alert>);
    expect(container.firstChild).toHaveClass('mizu-alert--danger');
  });

  it('renders a dismiss button when onDismiss is provided', () => {
    render(<Alert onDismiss={() => {}}>X</Alert>);
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument();
  });

  it('fires onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<Alert onDismiss={onDismiss}>X</Alert>);
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not render dismiss button without onDismiss', () => {
    render(<Alert>X</Alert>);
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<Alert className="custom">X</Alert>);
    expect(container.firstChild).toHaveClass('custom');
    expect(container.firstChild).toHaveClass('mizu-alert');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>X</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations (info)', async () => {
    const { container } = render(<Alert>Info message</Alert>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (danger + dismissible)', async () => {
    const { container } = render(
      <Alert tone="danger" onDismiss={() => {}}>
        Error
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (with title + description)', async () => {
    const { container } = render(
      <Alert tone="warning">
        <AlertTitle>Warning</AlertTitle>
        Something might go wrong
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Callout', () => {
  it('renders with role note for info', () => {
    render(<Callout tone="info">Tip</Callout>);
    expect(screen.getByRole('note')).toHaveTextContent('Tip');
  });

  it('renders with role note by default', () => {
    render(<Callout>Tip</Callout>);
    expect(screen.getByRole('note')).toBeInTheDocument();
  });

  it('uses role alert for danger', () => {
    render(<Callout tone="danger">Broken</Callout>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('keeps the alert classes and tone', () => {
    const { container } = render(<Callout tone="success">Done</Callout>);
    expect(container.firstChild).toHaveClass('mizu-alert', 'mizu-alert--success');
  });

  it('lets role override the default', () => {
    render(<Callout role="status">Live</Callout>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Callout ref={ref}>X</Callout>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Callout tone="info">
        <AlertTitle>Note</AlertTitle>
        Details
      </Callout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
