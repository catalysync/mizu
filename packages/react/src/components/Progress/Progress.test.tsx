import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('renders a progressbar', () => {
    render(<Progress value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders label text', () => {
    render(<Progress value={75} label="Uploading" />);
    expect(screen.getByText('Uploading')).toBeInTheDocument();
  });

  it('renders percentage when showValue is true', () => {
    render(<Progress value={42} showValue />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('applies tone class to fill', () => {
    const { container } = render(<Progress value={80} tone="success" />);
    expect(container.querySelector('.mizu-progress__fill--success')).toBeInTheDocument();
  });

  it('applies indeterminate class', () => {
    const { container } = render(<Progress indeterminate />);
    expect(container.querySelector('.mizu-progress--indeterminate')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Progress value={50} label="Loading" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
