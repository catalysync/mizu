import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders with a placeholder', () => {
    render(<Input placeholder="Enter text" aria-label="Text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('fires onChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input aria-label="Name" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('respects disabled', () => {
    render(<Input disabled aria-label="Disabled" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Input aria-label="Accessible input" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
