import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../Field';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders a switch role', () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('is off by default', () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('can be defaultChecked', () => {
    render(<Switch aria-label="Toggle" defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('fires onCheckedChange when toggled', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Toggle" onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles off when already on', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Toggle" defaultChecked onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('respects disabled', () => {
    render(<Switch aria-label="Toggle" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('does not fire when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Toggle" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('applies mizu-switch class', () => {
    render(<Switch aria-label="Toggle" />);
    expect(screen.getByRole('switch')).toHaveClass('mizu-switch');
  });

  it('merges custom className', () => {
    render(<Switch aria-label="Toggle" className="custom" />);
    expect(screen.getByRole('switch')).toHaveClass('custom');
  });

  it('renders the thumb', () => {
    const { container } = render(<Switch aria-label="Toggle" />);
    expect(container.querySelector('.mizu-switch__thumb')).toBeInTheDocument();
  });

  it('reads disabled from Field context', () => {
    render(
      <Field label="Notifications" disabled>
        <Switch />
      </Field>,
    );
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('reads required from Field context', () => {
    render(
      <Field label="Notifications" required>
        <Switch />
      </Field>,
    );
    // eslint-disable-next-line jest-dom/prefer-required
    expect(screen.getByRole('switch')).toHaveAttribute('aria-required', 'true');
  });

  it('toggles via Space key', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch aria-label="Toggle" onCheckedChange={onCheckedChange} />);
    screen.getByRole('switch').focus();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('has no axe violations (off)', async () => {
    const { container } = render(<Switch aria-label="Toggle notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (on)', async () => {
    const { container } = render(<Switch aria-label="Toggle notifications" defaultChecked />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (disabled)', async () => {
    const { container } = render(<Switch aria-label="Toggle notifications" disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
