import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders a slider role', () => {
    render(<Slider aria-label="Volume" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<Slider aria-label="Vol" min={0} max={100} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });

  it('sets default value', () => {
    render(<Slider aria-label="Vol" defaultValue={[50]} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50');
  });

  it('applies the mizu-slider class', () => {
    const { container } = render(<Slider aria-label="Vol" />);
    expect(container.querySelector('.mizu-slider')).toBeInTheDocument();
  });

  it('renders the track', () => {
    const { container } = render(<Slider aria-label="Vol" />);
    expect(container.querySelector('.mizu-slider__track')).toBeInTheDocument();
  });

  it('renders the thumb', () => {
    const { container } = render(<Slider aria-label="Vol" />);
    expect(container.querySelector('.mizu-slider__thumb')).toBeInTheDocument();
  });

  it('applies disabled via data attribute', () => {
    const { container } = render(<Slider aria-label="Vol" disabled />);
    expect(container.querySelector('.mizu-slider')).toHaveAttribute('data-disabled', '');
  });

  it('merges custom className', () => {
    const { container } = render(<Slider aria-label="Vol" className="custom" />);
    expect(container.querySelector('.mizu-slider')).toHaveClass('custom');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Slider aria-label="Volume" defaultValue={[50]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (disabled)', async () => {
    const { container } = render(<Slider aria-label="Volume" disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
