import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Alert, AlertTitle } from './Alert';

describe('Alert', () => {
  it('renders with text content', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('renders the alert role', () => {
    render(<Alert>Info</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
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
