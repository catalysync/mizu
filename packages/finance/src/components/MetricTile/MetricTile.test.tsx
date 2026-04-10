import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetricTile } from './MetricTile';

describe('MetricTile', () => {
  it('renders label and value', () => {
    render(<MetricTile label="MRR" value="$48.2K" />);
    expect(screen.getByText('MRR')).toBeInTheDocument();
    expect(screen.getByText('$48.2K')).toBeInTheDocument();
  });
});
