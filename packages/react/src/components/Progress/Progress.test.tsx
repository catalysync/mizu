import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Progress } from './Progress';

describe('Progress', () => {
  it('renders a progressbar role', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow', () => {
    render(<Progress value={75} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<Progress value={50} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders a label when provided', () => {
    render(<Progress value={50} label="Uploading..." />);
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('applies the mizu-progress class', () => {
    const { container } = render(<Progress value={50} />);
    expect(container.querySelector('.mizu-progress')).toBeInTheDocument();
  });

  it('renders the indicator', () => {
    const { container } = render(<Progress value={50} />);
    expect(container.querySelector('.mizu-progress__fill')).toBeInTheDocument();
  });

  it('sets 0 value correctly', () => {
    render(<Progress value={0} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('sets 100 value correctly', () => {
    render(<Progress value={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('clamps values above max to 100%', () => {
    const { container } = render(<Progress value={150} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(bar).toHaveAttribute('data-state', 'complete');
    expect(container.querySelector('.mizu-progress__fill')).toHaveStyle({ width: '100%' });
  });

  it('clamps negative values to 0%', () => {
    const { container } = render(<Progress value={-20} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(container.querySelector('.mizu-progress__fill')).toHaveStyle({ width: '0%' });
  });

  it('marks indeterminate progress with data-state', () => {
    const { container } = render(<Progress indeterminate />);
    expect(container.querySelector('.mizu-progress')).toHaveAttribute(
      'data-state',
      'indeterminate',
    );
    expect(container.querySelector('.mizu-progress')).not.toHaveClass(
      'mizu-progress--indeterminate',
    );
  });

  it('uses the label prop as the accessible name over aria-label', () => {
    render(<Progress value={50} label="Uploading" aria-label="Other" />);
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Uploading');
  });

  it('uses aria-label when no label prop is given', () => {
    render(<Progress value={50} aria-label="Storage used" />);
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Storage used');
  });

  it('exposes valueText as aria-valuetext', () => {
    render(<Progress value={3} max={5} valueText="3 of 5 files" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 of 5 files');
  });

  it('merges custom className', () => {
    const { container } = render(<Progress value={50} className="custom" />);
    expect(container.querySelector('.mizu-progress')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={50} />);
    expect(ref.current).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Progress value={50} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (with label)', async () => {
    const { container } = render(<Progress value={75} label="75% complete" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (with valueText)', async () => {
    const { container } = render(
      <Progress value={3} max={5} label="Files" valueText="3 of 5 files" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (at 0)', async () => {
    const { container } = render(<Progress value={0} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
