import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with a label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders without a label', () => {
    render(<Checkbox aria-label="Toggle" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox aria-label="Toggle" onCheckedChange={onChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('respects defaultChecked', () => {
    render(<Checkbox aria-label="On" defaultChecked />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
  });

  it('respects disabled', () => {
    render(<Checkbox aria-label="Off" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('associates label with checkbox via htmlFor', () => {
    render(<Checkbox label="Agree" />);
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Agree');
    expect(label).toHaveAttribute('for', checkbox.id);
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Checkbox label="I agree" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
