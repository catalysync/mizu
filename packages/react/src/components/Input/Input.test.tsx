import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../Field';
import { Input } from './Input';

describe('Input', () => {
  // -- Rendering --
  it('renders a text input by default', () => {
    render(<Input aria-label="Name" />);
    const input = screen.getByRole('textbox');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('accepts a custom type', () => {
    render(<Input type="email" aria-label="Email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('renders with a placeholder', () => {
    render(<Input placeholder="Enter name" aria-label="Name" />);
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('renders a controlled value', () => {
    render(<Input value="Ada" onChange={() => {}} aria-label="Name" />);
    expect(screen.getByRole('textbox')).toHaveValue('Ada');
  });

  it('renders an uncontrolled defaultValue', () => {
    render(<Input defaultValue="Ada" aria-label="Name" />);
    expect(screen.getByRole('textbox')).toHaveValue('Ada');
  });

  // -- Variants & sizes --
  it('applies the outline appearance by default', () => {
    render(<Input aria-label="X" />);
    expect(screen.getByRole('textbox')).toHaveClass('mizu-input');
  });

  it('applies the filled appearance', () => {
    render(<Input appearance="filled" aria-label="X" />);
    expect(screen.getByRole('textbox')).toHaveClass('mizu-input--filled');
  });

  it('applies the underline appearance', () => {
    render(<Input appearance="underline" aria-label="X" />);
    expect(screen.getByRole('textbox')).toHaveClass('mizu-input--underline');
  });

  it('applies the sm size', () => {
    render(<Input size="sm" aria-label="X" />);
    expect(screen.getByRole('textbox')).toHaveClass('mizu-input--sm');
  });

  it('applies the lg size', () => {
    render(<Input size="lg" aria-label="X" />);
    expect(screen.getByRole('textbox')).toHaveClass('mizu-input--lg');
  });

  // -- Disabled --
  it('sets the disabled attribute', () => {
    render(<Input disabled aria-label="X" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('does not allow typing when disabled', async () => {
    const onChange = vi.fn();
    render(<Input disabled onChange={onChange} aria-label="X" />);
    await userEvent.setup().type(screen.getByRole('textbox'), 'hello');
    expect(onChange).not.toHaveBeenCalled();
  });

  // -- Required --
  it('sets the required attribute', () => {
    render(<Input required aria-label="X" />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  // -- Error state --
  it('applies error class when error is truthy', () => {
    render(<Input error aria-label="X" />);
    expect(screen.getByRole('textbox')).toHaveClass('mizu-input--error');
  });

  it('sets aria-invalid when error is set', () => {
    render(<Input error="Required" aria-label="X" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders error message text', () => {
    render(<Input error="Required field" label="Name" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  // -- Help text --
  it('renders help text', () => {
    render(<Input helpText="Enter your full name" label="Name" />);
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('hides help text when error is shown', () => {
    render(<Input helpText="Help" error="Error" label="Name" />);
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  // -- Label --
  it('renders an associated label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  // -- Prefix / suffix --
  it('renders a prefix adornment', () => {
    render(<Input prefix="$" aria-label="Amount" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders a suffix adornment', () => {
    render(<Input suffix="kg" aria-label="Weight" />);
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('applies prefix padding class', () => {
    render(<Input prefix="$" aria-label="Amount" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('mizu-input--has-prefix');
  });

  // -- Character count --
  it('renders a character counter when maxCharacters is set', () => {
    render(<Input maxCharacters={50} label="Bio" />);
    expect(screen.getByText('0/50')).toBeInTheDocument();
  });

  it('updates the counter as user types', async () => {
    render(<Input maxCharacters={50} label="Bio" />);
    await userEvent.setup().type(screen.getByLabelText('Bio'), 'Hello');
    expect(screen.getByText('5/50')).toBeInTheDocument();
  });

  it('enforces maxLength from maxCharacters', () => {
    render(<Input maxCharacters={3} aria-label="X" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '3');
  });

  // -- className --
  it('merges custom className', () => {
    render(<Input className="custom" aria-label="X" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom');
  });

  // -- Ref --
  it('forwards ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="X" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // -- Field context --
  it('inherits id/required/disabled from Field', () => {
    render(
      <Field label="Email" required disabled>
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByLabelText(/Email/) as HTMLInputElement;
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  // -- Events --
  it('fires onChange on input', async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} aria-label="X" />);
    await userEvent.setup().type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('fires onBlur', async () => {
    const onBlur = vi.fn();
    render(<Input onBlur={onBlur} aria-label="X" />);
    const input = screen.getByRole('textbox');
    input.focus();
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it('fires onFocus', () => {
    const onFocus = vi.fn();
    render(<Input onFocus={onFocus} aria-label="X" />);
    fireEvent.focus(screen.getByRole('textbox'));
    expect(onFocus).toHaveBeenCalledOnce();
  });

  // -- a11y --
  it('has no axe violations (plain)', async () => {
    const { container } = render(<Input aria-label="Name" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (with label)', async () => {
    const { container } = render(<Input label="Email" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (with error)', async () => {
    const { container } = render(<Input label="Email" error="Required" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (disabled)', async () => {
    const { container } = render(<Input aria-label="X" disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (with prefix)', async () => {
    const { container } = render(
      <Field label="Amount">
        <Input prefix="$" />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
