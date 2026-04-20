import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../Field';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea aria-label="Notes" />);
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('renders with a placeholder', () => {
    render(<Textarea placeholder="Enter notes" aria-label="Notes" />);
    expect(screen.getByPlaceholderText('Enter notes')).toBeInTheDocument();
  });

  it('renders a controlled value', () => {
    render(<Textarea value="Hello" onChange={() => {}} aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
  });

  it('renders a defaultValue', () => {
    render(<Textarea defaultValue="Default" aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveValue('Default');
  });

  it('applies the mizu-textarea class', () => {
    render(<Textarea aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveClass('mizu-textarea');
  });

  it('sets rows attribute', () => {
    render(<Textarea rows={5} aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('sets disabled', () => {
    render(<Textarea disabled aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets required', () => {
    render(<Textarea required aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('fires onChange', async () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} aria-label="Notes" />);
    await userEvent.setup().type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('fires onBlur', () => {
    const onBlur = vi.fn();
    render(<Textarea onBlur={onBlur} aria-label="Notes" />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it('merges custom className', () => {
    render(<Textarea className="custom" aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Notes" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('reads required + disabled from Field context', () => {
    render(
      <Field label="Notes" required disabled>
        <Textarea />
      </Field>,
    );
    const ta = screen.getByLabelText(/Notes/);
    expect(ta).toBeRequired();
    expect(ta).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (disabled)', async () => {
    const { container } = render(<Textarea aria-label="Notes" disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
