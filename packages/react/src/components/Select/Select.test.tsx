import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

function TestSelect() {
  return (
    <Select defaultValue="us-east">
      <SelectTrigger aria-label="Region">
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
});
