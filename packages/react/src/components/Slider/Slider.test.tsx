import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders a slider with the default value', () => {
    render(<Slider aria-label="Volume" defaultValue={[50]} max={100} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50');
  });

  it('respects min and max bounds', () => {
    render(<Slider aria-label="Volume" defaultValue={[25]} min={0} max={100} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });

  it('calls onValueChange when navigated by keyboard', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Slider aria-label="Volume" defaultValue={[50]} max={100} onValueChange={onValueChange} />,
    );
    screen.getByRole('slider').focus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalled();
  });

  it('respects the disabled state', () => {
    render(<Slider aria-label="Volume" defaultValue={[50]} disabled />);
    expect(screen.getByRole('slider')).toHaveAttribute('data-disabled');
  });

  it('has no a11y violations with an aria-label', async () => {
    const { container } = render(<Slider aria-label="Volume" defaultValue={[50]} max={100} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
