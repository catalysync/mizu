import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { DateNavigator, DEFAULT_PRESETS } from './DateNavigator';

const baseValue = {
  start: new Date(2026, 0, 1),
  end: new Date(2026, 0, 7),
};

describe('DateNavigator', () => {
  it('renders every preset as a radio chip', () => {
    render(<DateNavigator value={baseValue} onChange={() => {}} />);
    DEFAULT_PRESETS.forEach((preset) => {
      expect(screen.getByRole('radio', { name: String(preset.label) })).toBeInTheDocument();
    });
  });

  it('fires onChange with a preset key when a chip is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DateNavigator value={baseValue} onChange={handleChange} />);
    await user.click(screen.getByRole('radio', { name: 'Today' }));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].preset).toBe('today');
  });

  it('marks the selected preset with aria-checked', () => {
    render(<DateNavigator value={{ ...baseValue, preset: 'last-7' }} onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: 'Last 7 days' })).toBeChecked();
  });

  it('steps the range forward and backward by its own width', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DateNavigator value={baseValue} onChange={handleChange} />);
    await user.click(screen.getByRole('button', { name: 'Previous range' }));
    await user.click(screen.getByRole('button', { name: 'Next range' }));
    expect(handleChange).toHaveBeenCalledTimes(2);
    // Range is 7 days, so prev should subtract 7
    const firstCall = handleChange.mock.calls[0][0];
    expect(firstCall.start.getTime()).toBeLessThan(baseValue.start.getTime());
    expect(firstCall.preset).toBeUndefined();
  });

  it('hides arrows when hideArrows is set', () => {
    render(<DateNavigator value={baseValue} onChange={() => {}} hideArrows />);
    expect(screen.queryByRole('button', { name: 'Previous range' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next range' })).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DateNavigator value={{ ...baseValue, preset: 'last-7' }} onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
