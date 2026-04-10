import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Notes" aria-label="Notes" />);
    expect(screen.getByPlaceholderText('Notes')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Notes" />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('respects disabled', () => {
    render(<Textarea disabled aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards className', () => {
    const { container } = render(<Textarea className="custom" aria-label="Notes" />);
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });

  it('fires onChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Textarea aria-label="Notes" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'x');
    expect(onChange).toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
