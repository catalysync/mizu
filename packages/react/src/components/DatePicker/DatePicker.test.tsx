import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../Field';
import { Calendar } from './Calendar';
import { addMonths, buildMonthGrid, formatISO, parseISO, startOfMonth } from './calendar-utils';
import { DatePicker } from './DatePicker';
import { DateRangePicker } from './DateRangePicker';

describe('calendar utils', () => {
  it('parses and formats ISO dates', () => {
    const d = parseISO('2026-04-11');
    expect(d).not.toBeNull();
    expect(formatISO(d!)).toBe('2026-04-11');
  });

  it('rejects invalid ISO strings', () => {
    expect(parseISO('not-a-date')).toBeNull();
    expect(parseISO('2026-13-40')).toBeNull();
    expect(parseISO(null)).toBeNull();
  });

  it('startOfMonth resets to the first day', () => {
    const d = new Date(2026, 3, 15);
    expect(startOfMonth(d).getDate()).toBe(1);
  });

  it('addMonths handles year rollover', () => {
    const d = new Date(2026, 11, 1);
    const next = addMonths(d, 1);
    expect(next.getMonth()).toBe(0);
    expect(next.getFullYear()).toBe(2027);
  });

  it('buildMonthGrid returns 6 rows of 7 days', () => {
    const grid = buildMonthGrid(new Date(2026, 3, 1));
    expect(grid.length).toBe(6);
    expect(grid.every((row) => row.length === 7)).toBe(true);
  });
});

describe('Calendar', () => {
  it('renders month title and weekday headers', () => {
    render(<Calendar value={new Date(2026, 3, 11)} />);
    expect(screen.getByText(/April 2026/)).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').length).toBe(7);
  });

  it('calls onChange when a day is clicked', () => {
    const onChange = vi.fn();
    render(<Calendar value={new Date(2026, 3, 1)} onChange={onChange} />);
    fireEvent.click(screen.getByRole('gridcell', { name: /April 15, 2026/ }));
    expect(onChange).toHaveBeenCalled();
    const picked: Date = onChange.mock.calls[0][0];
    expect(picked.getDate()).toBe(15);
  });

  it('navigates to next and previous month', () => {
    render(<Calendar value={new Date(2026, 3, 1)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText(/May 2026/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText(/April 2026/)).toBeInTheDocument();
  });

  it('disables days outside min/max', () => {
    render(
      <Calendar
        value={new Date(2026, 3, 15)}
        min={new Date(2026, 3, 10)}
        max={new Date(2026, 3, 20)}
      />,
    );
    const day1 = screen.getByRole('gridcell', { name: /April 1, 2026/ });
    expect(day1).toBeDisabled();
    const day15 = screen.getByRole('gridcell', { name: /April 15, 2026/ });
    expect(day15).toBeEnabled();
  });
});

describe('DatePicker', () => {
  it('renders a trigger showing the placeholder when empty', () => {
    render(<DatePicker aria-label="Invoice date" placeholder="Pick a date" />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('reads required/disabled from Field context', () => {
    const { container } = render(
      <Field label="Due date" required disabled>
        <DatePicker />
      </Field>,
    );
    const trigger = container.querySelector('.mizu-date-picker__trigger') as HTMLButtonElement;
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('data-required', 'true');
  });

  it('has no axe violations on the closed trigger', async () => {
    const { container } = render(
      <Field label="Due date">
        <DatePicker />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('DateRangePicker', () => {
  it('renders a trigger showing the placeholder when empty', () => {
    render(<DateRangePicker aria-label="Report range" placeholder="Pick a range" />);
    expect(screen.getByText('Pick a range')).toBeInTheDocument();
  });
});
