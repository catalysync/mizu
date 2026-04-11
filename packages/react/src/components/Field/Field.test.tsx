import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Field, useFieldContext } from './index';

const DebugControl = () => {
  const ctx = useFieldContext();
  return (
    <input
      id={ctx?.controlId}
      aria-describedby={[ctx?.descriptionId, ctx?.errorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={ctx?.invalid || undefined}
      required={ctx?.required}
      disabled={ctx?.disabled}
      data-testid="control"
    />
  );
};

describe('Field', () => {
  it('wires label htmlFor to the control id', () => {
    render(
      <Field label="Email">
        <DebugControl />
      </Field>,
    );
    const input = screen.getByTestId('control') as HTMLInputElement;
    const label = screen.getByText('Email');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('links description via aria-describedby', () => {
    render(
      <Field label="Email" description="We never share your email">
        <DebugControl />
      </Field>,
    );
    const input = screen.getByTestId('control');
    const description = screen.getByText('We never share your email');
    expect(input.getAttribute('aria-describedby')).toContain(description.id);
  });

  it('shows an error message with role="alert" and wires aria-invalid', () => {
    render(
      <Field label="Email" errorMessage="Required field">
        <DebugControl />
      </Field>,
    );
    const input = screen.getByTestId('control');
    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Required field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain(error.id);
  });

  it('renders a visible asterisk + sr-only text when required', () => {
    render(
      <Field label="Email" required>
        <DebugControl />
      </Field>,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('(required)')).toBeInTheDocument();
    expect(screen.getByTestId('control')).toBeRequired();
  });

  it('renders optional hint when enabled', () => {
    render(
      <Field label="Nickname" showOptionalHint>
        <DebugControl />
      </Field>,
    );
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('propagates disabled through context', () => {
    render(
      <Field label="Email" disabled>
        <DebugControl />
      </Field>,
    );
    expect(screen.getByTestId('control')).toBeDisabled();
  });

  it('respects a user-provided htmlFor', () => {
    render(
      <Field label="Email" htmlFor="my-email">
        <input id="my-email" data-testid="explicit" />
      </Field>,
    );
    expect(screen.getByText('Email')).toHaveAttribute('for', 'my-email');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field
        label="Email"
        description="We never share your email"
        errorMessage="This field is required"
        required
      >
        <DebugControl />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
