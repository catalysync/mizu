import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import type { PropertyFilterProperty, PropertyFilterQuery } from './PropertyFilter';
import { PropertyFilter } from './PropertyFilter';

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
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Region')).toBeInTheDocument();
  });

  it('filters suggestions based on input', async () => {
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={() => {}} properties={properties} />);
    await user.type(screen.getByRole('combobox'), 'Sta');
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
    await user.type(screen.getByRole('combobox'), 'Status: running{Enter}');
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

  it('chooses suggestions with the arrow keys and Enter', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={onChange} properties={properties} />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'Status: ');
    expect(screen.getByRole('option', { name: 'Status = running' })).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    const idle = screen.getByRole('option', { name: 'Status = idle' });
    expect(idle).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', idle.id);
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith({
      operation: 'and',
      tokens: [{ propertyKey: 'status', operator: '=', value: 'idle' }],
    });
  });

  it('wraps the active suggestion when arrowing past the ends', async () => {
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={() => {}} properties={properties} />);
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: 'Region' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Status' })).toHaveAttribute('aria-selected', 'true');
  });

  it('closes suggestions on Escape and on blur without waiting', async () => {
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={() => {}} properties={properties} />);
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.tab();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('uses the typed operator when the property allows it', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={onChange} properties={properties} />);
    await user.type(screen.getByRole('combobox'), 'Status != idle{Enter}');
    expect(onChange).toHaveBeenLastCalledWith({
      operation: 'and',
      tokens: [{ propertyKey: 'status', operator: '!=', value: 'idle' }],
    });
  });

  it('splits on a word operator that comes before a symbol in the value', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const props: PropertyFilterProperty[] = [
      { key: 'name', label: 'Name', operators: ['contains'] },
    ];
    render(<PropertyFilter query={emptyQuery} onQueryChange={onChange} properties={props} />);
    await user.type(screen.getByRole('combobox'), 'Name contains a=b{Enter}');
    expect(onChange).toHaveBeenCalledWith({
      operation: 'and',
      tokens: [{ propertyKey: 'name', operator: 'contains', value: 'a=b' }],
    });
  });

  it('rejects operators the property does not declare', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={onChange} properties={properties} />);
    await user.type(screen.getByRole('combobox'), 'Region != us-east{Enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('adds a token when a suggestion is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<PropertyFilter query={emptyQuery} onQueryChange={onChange} properties={properties} />);
    await user.type(screen.getByRole('combobox'), 'Status: ');
    await user.click(screen.getByRole('option', { name: 'Status = running' }));
    expect(onChange).toHaveBeenCalledWith({
      operation: 'and',
      tokens: [{ propertyKey: 'status', operator: '=', value: 'running' }],
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <PropertyFilter query={emptyQuery} onQueryChange={() => {}} properties={properties} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
  it('has no accessibility violations while suggestions are open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PropertyFilter query={emptyQuery} onQueryChange={() => {}} properties={properties} />,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
