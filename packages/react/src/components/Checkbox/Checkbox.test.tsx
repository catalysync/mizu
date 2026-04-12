import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';
import { Field } from '../Field';

describe('Checkbox', () => {
  it('renders a checkbox', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders an associated label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders without a label', () => {
    render(<Checkbox aria-label="Toggle" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Checkbox label="Accept" />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('can be defaultChecked', () => {
    render(<Checkbox label="Accept" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('fires onCheckedChange when clicked', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept" onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles off when already checked', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept" defaultChecked onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('respects the disabled prop', () => {
    render(<Checkbox label="Accept" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('does not fire when disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.setup().click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('applies the mizu-checkbox class', () => {
    render(<Checkbox aria-label="X" />);
    expect(screen.getByRole('checkbox')).toHaveClass('mizu-checkbox');
  });

  it('merges custom className', () => {
    render(<Checkbox className="custom" aria-label="X" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom');
  });

  it('renders a check indicator', () => {
    const { container } = render(<Checkbox label="Accept" defaultChecked />);
    expect(container.querySelector('.mizu-checkbox__indicator')).toBeInTheDocument();
  });

  it('generates an id from the label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'cb-accept-terms');
  });

  it('uses custom id when provided', () => {
    render(<Checkbox id="my-cb" label="Accept" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'my-cb');
  });

  it('reads disabled from Field context', () => {
    render(
      <Field label="Terms" disabled>
        <Checkbox />
      </Field>,
    );
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('reads required from Field context', () => {
    render(
      <Field label="Terms" required>
        <Checkbox />
      </Field>,
    );
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true');
  });

  it('can be toggled via keyboard Space', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox label="Accept" onCheckedChange={onCheckedChange} />);
    screen.getByRole('checkbox').focus();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('has no axe violations (unchecked)', async () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (checked)', async () => {
    const { container } = render(<Checkbox label="Accept terms" defaultChecked />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (disabled)', async () => {
    const { container } = render(<Checkbox label="Accept terms" disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (aria-label only)', async () => {
    const { container } = render(<Checkbox aria-label="Toggle notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
