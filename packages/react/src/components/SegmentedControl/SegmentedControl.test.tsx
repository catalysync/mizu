import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { SegmentedControl, SegmentedControlItem } from './SegmentedControl';

function Example(props: { onValueChange?: (value: string) => void; defaultValue?: string }) {
  return (
    <SegmentedControl aria-label="View" {...props}>
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
    </SegmentedControl>
  );
}

describe('SegmentedControl', () => {
  it('applies root and item classes', () => {
    const { container } = render(<Example defaultValue="day" />);
    expect(container.querySelector('.mizu-segmented-control')).toBeInTheDocument();
    expect(container.querySelectorAll('.mizu-segmented-control__item')).toHaveLength(3);
  });

  it('renders as a radiogroup with radio segments', () => {
    render(<Example defaultValue="day" />);
    expect(screen.getByRole('radiogroup', { name: 'View' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
  });

  it('is a single tab stop that lands on the checked segment', async () => {
    const user = userEvent.setup();
    render(<Example defaultValue="week" />);

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('tabindex', '-1');

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Week' })).not.toHaveFocus();
  });

  it('arrow keys move focus and change the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example defaultValue="day" onValueChange={onValueChange} />);

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();

    // Radix selects on focus only while an arrow key is held, so hold the key until focus moves.
    await user.keyboard('{ArrowRight>}');
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Week' })).toHaveFocus());
    await user.keyboard('{/ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('week');

    await user.keyboard('{ArrowLeft>}');
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus());
    await user.keyboard('{/ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('day');
  });

  it('marks the checked segment with data-state', () => {
    render(<Example defaultValue="month" />);
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('data-state', 'checked');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('data-state', 'unchecked');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Example defaultValue="day" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
