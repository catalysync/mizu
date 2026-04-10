import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('renders search input', () => {
    render(<FilterBar />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('fires onSearchChange', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<FilterBar onSearchChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders applied filters as pills', () => {
    render(
      <FilterBar
        appliedFilters={[
          { key: 'status', label: 'Status', value: 'Active' },
          { key: 'region', label: 'Region', value: 'US East' },
        ]}
      />,
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('US East')).toBeInTheDocument();
  });

  it('fires onRemoveFilter', async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <FilterBar
        appliedFilters={[{ key: 'status', label: 'Status', value: 'Active' }]}
        onRemoveFilter={onRemove}
      />,
    );
    await user.click(screen.getByLabelText('Remove Status filter'));
    expect(onRemove).toHaveBeenCalledWith('status');
  });

  it('shows clear all when multiple filters', () => {
    render(
      <FilterBar
        appliedFilters={[
          { key: 'a', label: 'A', value: '1' },
          { key: 'b', label: 'B', value: '2' },
        ]}
        onClearAll={() => {}}
      />,
    );
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <FilterBar
        appliedFilters={[{ key: 'status', label: 'Status', value: 'Active' }]}
        onRemoveFilter={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
