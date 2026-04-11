import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { TimeInput } from './TimeInput';
import { Field } from '../Field';

describe('TimeInput', () => {
  it('renders with a default value', () => {
    render(<TimeInput aria-label="Start time" defaultValue="09:30" />);
    expect(screen.getByLabelText('Start time')).toHaveValue('09:30');
  });

  it('normalizes a valid time on blur', () => {
    const onValueChange = vi.fn();
    render(<TimeInput aria-label="Start" defaultValue="09:30" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Start');
    fireEvent.change(input, { target: { value: '14:05' } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenLastCalledWith('14:05');
  });

  it('rejects an invalid time', () => {
    const onValueChange = vi.fn();
    render(<TimeInput aria-label="Start" onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Start');
    fireEvent.change(input, { target: { value: 'not-a-time' } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('shows AM/PM suffix in 12h format', () => {
    render(<TimeInput aria-label="Time" format="12h" defaultValue="14:30" />);
    expect(screen.getByText('PM')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toHaveValue('02:30');
  });

  it('supports controlled mode', () => {
    const { rerender } = render(
      <TimeInput aria-label="Time" value="09:00" onValueChange={() => {}} />,
    );
    expect(screen.getByLabelText('Time')).toHaveValue('09:00');
    rerender(<TimeInput aria-label="Time" value="18:45" onValueChange={() => {}} />);
    expect(screen.getByLabelText('Time')).toHaveValue('18:45');
  });

  it('reads required + disabled from Field context', () => {
    render(
      <Field label="Departure" required disabled>
        <TimeInput />
      </Field>,
    );
    const input = screen.getByLabelText(/Departure/);
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Field label="Departure">
        <TimeInput defaultValue="08:00" />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
