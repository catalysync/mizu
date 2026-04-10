import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="Revenue" value="$1.2M" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1.2M')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<KpiCard label="P&L" value="$500K" footer={<span>vs last month</span>} />);
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });
});
