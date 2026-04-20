import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../Field';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('renders a spinbutton', () => {
    render(<NumberInput aria-label="Quantity" defaultValue={3} />);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveValue('3');
  });

  it('increments on arrow up and decrements on arrow down', () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Qty" defaultValue={5} onValueChange={onValueChange} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it('clamps to min/max on input', () => {
    const onValueChange = vi.fn();
    render(
      <NumberInput
        aria-label="Qty"
        defaultValue={5}
        min={0}
        max={10}
        onValueChange={onValueChange}
      />,
    );
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '999' } });
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    fireEvent.change(input, { target: { value: '-5' } });
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it('respects step on the stepper buttons', () => {
    const onValueChange = vi.fn();
    render(
      <NumberInput
        aria-label="Price"
        defaultValue={0}
        step={0.5}
        precision={2}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onValueChange).toHaveBeenLastCalledWith(0.5);
    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it('hides steppers when hideSteppers is true', () => {
    render(<NumberInput aria-label="Qty" hideSteppers defaultValue={1} />);
    expect(screen.queryByRole('button', { name: 'Increment' })).not.toBeInTheDocument();
  });

  it('supports controlled mode', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <NumberInput aria-label="Qty" value={5} onValueChange={onValueChange} />,
    );
    expect(screen.getByRole('spinbutton')).toHaveValue('5');
    rerender(<NumberInput aria-label="Qty" value={8} onValueChange={onValueChange} />);
    expect(screen.getByRole('spinbutton')).toHaveValue('8');
  });

  it('reads required and disabled from Field context', () => {
    render(
      <Field label="Line total" required disabled>
        <NumberInput />
      </Field>,
    );
    const input = screen.getByRole('spinbutton', { name: /Line total/ });
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field label="Line total" description="Excluding tax">
        <NumberInput defaultValue={1200} min={0} prefix="$" />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
