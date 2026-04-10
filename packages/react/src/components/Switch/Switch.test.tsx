import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders as a switch role', () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch aria-label="Dark mode" onCheckedChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('respects defaultChecked', () => {
    render(<Switch aria-label="On" defaultChecked />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
  });

  it('respects disabled', () => {
    render(<Switch aria-label="Off" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('fires on enter key', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch aria-label="Toggle" onCheckedChange={onChange} />);
    screen.getByRole('switch').focus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Switch aria-label="Toggle" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
