import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { PasswordInput, estimatePasswordStrength } from './PasswordInput';
import { Field } from '../Field';

describe('PasswordInput', () => {
  it('renders a password input by default', () => {
    render(<PasswordInput aria-label="Password" defaultValue="hunter2" />);
    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('toggles visibility when the show button is clicked', () => {
    render(<PasswordInput aria-label="Password" defaultValue="hunter2" />);
    const input = screen.getByLabelText('Password') as HTMLInputElement;
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(input.type).toBe('password');
    fireEvent.click(toggle);
    expect(input.type).toBe('text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  });

  it('can hide the toggle', () => {
    render(<PasswordInput aria-label="Password" showToggle={false} />);
    expect(screen.queryByRole('button', { name: /Show password/ })).not.toBeInTheDocument();
  });

  it('renders a strength meter when strength is provided', () => {
    render(<PasswordInput aria-label="Password" strength={3} />);
    const meter = screen.getByRole('meter', { name: 'Password strength' });
    expect(meter).toHaveAttribute('aria-valuenow', '3');
  });

  it('reads required and disabled from Field context', () => {
    render(
      <Field label="Password" required disabled>
        <PasswordInput />
      </Field>,
    );
    const input = screen.getByLabelText(/Password/) as HTMLInputElement;
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it('estimatePasswordStrength scores weak vs strong', () => {
    expect(estimatePasswordStrength('')).toBe(0);
    expect(estimatePasswordStrength('abc')).toBe(0);
    expect(estimatePasswordStrength('abcdefgh')).toBe(1);
    expect(estimatePasswordStrength('AbcdEfgh')).toBe(2);
    expect(estimatePasswordStrength('AbcdEfghIjkl')).toBe(3);
    expect(estimatePasswordStrength('AbcdEfghIjkl1!')).toBe(4);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field label="Password" description="At least 12 characters">
        <PasswordInput defaultValue="hunter2" strength={2} />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
