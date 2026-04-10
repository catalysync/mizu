import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DeltaIndicator } from './DeltaIndicator';

describe('DeltaIndicator', () => {
  it('renders positive delta', () => {
    render(<DeltaIndicator value={0.024} />);
    expect(screen.getByText('+2.4%')).toBeInTheDocument();
  });

  it('renders negative delta', () => {
    render(<DeltaIndicator value={-0.018} />);
    expect(screen.getByText('-1.8%')).toBeInTheDocument();
  });

  it('applies the correct intent class', () => {
    const { container } = render(<DeltaIndicator value={0.05} />);
    expect(container.firstChild).toHaveClass('mizu-delta--positive');
  });
});
