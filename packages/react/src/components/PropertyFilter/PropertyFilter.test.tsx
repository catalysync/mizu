import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { PropertyFilter } from './PropertyFilter';
import type { PropertyFilterQuery, PropertyFilterProperty } from './PropertyFilter';

const properties: PropertyFilterProperty[] = [
  { key: 'status', label: 'Status', operators: ['=', '!='], options: ['running', 'idle'] },
  { key: 'region', label: 'Region', operators: ['='] },
];

const emptyQuery: PropertyFilterQuery = { operation: 'and', tokens: [] };

const queryWithToken: PropertyFilterQuery = {
  operation: 'and',
  tokens: [{ propertyKey: 'status', operator: '=', value: 'running' }],
};

describe('PropertyFilter', () => {
  it('renders the input with placeholder', () => {
    render(
      <PropertyFilter
        query={emptyQuery}
        onQueryChange={() => {}}
        properties={properties}
        placeholder="Filter…"
      />,
    );
    expect(screen.getByPlaceholderText('Filter…')).toBeInTheDocument();
  });

  it('shows suggestions on focus', async () => {
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={() => {}} properties={properties} />);
    await user.click(screen.getByRole('textbox'));
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Region')).toBeInTheDocument();
  });

  it('filters suggestions based on input', async () => {
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={() => {}} properties={properties} />);
    await user.type(screen.getByRole('textbox'), 'Sta');
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.queryByText('Region')).not.toBeInTheDocument();
  });

  it('renders token pills for active filters', () => {
    render(
      <PropertyFilter query={queryWithToken} onQueryChange={() => {}} properties={properties} />,
    );
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText(/running/)).toBeInTheDocument();
  });

  it('calls onQueryChange when removing a token', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <PropertyFilter query={queryWithToken} onQueryChange={onChange} properties={properties} />,
    );
    await user.click(screen.getByLabelText('Remove Status filter'));
    expect(onChange).toHaveBeenCalledWith({ operation: 'and', tokens: [] });
  });

  it('adds a token when typing "Property: value" and pressing Enter', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={onChange} properties={properties} />);
    await user.type(screen.getByRole('textbox'), 'Status: running{Enter}');
    expect(onChange).toHaveBeenCalledWith({
      operation: 'and',
      tokens: [{ propertyKey: 'status', operator: '=', value: 'running' }],
    });
  });

  it('shows countText when provided', () => {
    render(
      <PropertyFilter
        query={queryWithToken}
        onQueryChange={() => {}}
        properties={properties}
        countText="3 matches"
      />,
    );
    expect(screen.getByText('3 matches')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <PropertyFilter query={emptyQuery} onQueryChange={() => {}} properties={properties} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
