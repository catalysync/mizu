import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItems,
  SelectTrigger,
  SelectValue,
} from './Select';

function TestSelect({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Select defaultValue="us-east">
      <SelectTrigger aria-label="Region" size={size}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us-east">US East</SelectItem>
        <SelectItem value="us-west">US West</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders the trigger with selected value', () => {
    render(<TestSelect />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('US East')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<TestSelect />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('defaults to the md size', () => {
    render(<TestSelect />);
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'md');
  });

  it.each(['sm', 'md', 'lg'] as const)('sets data-size for size %s', (size) => {
    render(<TestSelect size={size} />);
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', size);
  });

  it('marks the trigger invalid from aria-invalid', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Region" aria-invalid>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders SelectItems from an object map', () => {
    render(
      <Select defaultValue="eu">
        <SelectTrigger aria-label="Region">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItems items={{ us: 'US East', eu: 'Europe' }} />
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText('Europe')).toBeInTheDocument();
  });
});
