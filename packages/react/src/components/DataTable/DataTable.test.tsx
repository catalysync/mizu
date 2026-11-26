import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DataTable, type DataTableColumn } from './DataTable';

interface Row {
  id: string;
  name: string;
  amount: number;
  status: string;
}

const DATA: Row[] = [
  { id: '1', name: 'Acme', amount: 1200, status: 'active' },
  { id: '2', name: 'Harbor', amount: 4300, status: 'active' },
  { id: '3', name: 'Fleet', amount: 800, status: 'dormant' },
];

const COLUMNS: DataTableColumn<Row>[] = [
  { id: 'name', header: 'Name', cell: (r) => r.name, sortable: true },
  { id: 'amount', header: 'Amount', cell: (r) => `$${r.amount}`, align: 'end', sortable: true },
  { id: 'status', header: 'Status', cell: (r) => r.status },
];

describe('DataTable', () => {
  it('renders all rows and columns', () => {
    render(<DataTable columns={COLUMNS} data={DATA} getRowId={(r) => r.id} />);
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('$4300')).toBeInTheDocument();
    expect(screen.getByText('dormant')).toBeInTheDocument();
  });

  it('shows empty message when data is empty', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={[]}
        getRowId={(r: Row) => r.id}
        emptyMessage="Nothing here."
      />,
    );
    expect(screen.getByText('Nothing here.')).toBeInTheDocument();
  });

  it('shows loading skeletons', () => {
    const { container } = render(
      <DataTable columns={COLUMNS} data={[]} getRowId={(r: Row) => r.id} loading loadingRows={3} />,
    );
    expect(container.querySelectorAll('.mizu-data-table__loading-bar').length).toBe(9);
  });

  it('supports sorting by clicking a header', () => {
    const onSort = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        sortColumn={null}
        sortDirection={null}
        onSort={onSort}
      />,
    );
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('cycles sort direction on repeated clicks', () => {
    const onSort = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        sortColumn="name"
        sortDirection="asc"
        onSort={onSort}
      />,
    );
    fireEvent.click(screen.getByText('Name'));
    expect(onSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('supports row selection with checkboxes', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        selectable
        selectedIds={new Set()}
        onSelectionChange={onSelectionChange}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(4);
    fireEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['1']));
  });

  it('supports select all', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        selectable
        selectedIds={new Set()}
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(screen.getByLabelText('Select all rows'));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['1', '2', '3']));
  });

  it('supports expandable rows', () => {
    const onExpandChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        expandable
        expandedIds={new Set(['1'])}
        onExpandChange={onExpandChange}
        renderExpanded={(r) => <p>Details for {r.name}</p>}
      />,
    );
    expect(screen.getByText('Details for Acme')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Collapse row'));
    expect(onExpandChange).toHaveBeenCalledWith(new Set());
  });

  it('sorts from the keyboard with Enter and Space on sortable headers', () => {
    const onSort = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        sortColumn={null}
        sortDirection={null}
        onSort={onSort}
      />,
    );
    const nameHeader = screen.getByText('Name').closest('th')!;
    expect(nameHeader).toHaveAttribute('tabindex', '0');
    expect(fireEvent.keyDown(nameHeader, { key: 'Enter' })).toBe(false);
    expect(onSort).toHaveBeenLastCalledWith('name', 'asc');
    expect(fireEvent.keyDown(nameHeader, { key: ' ' })).toBe(false);
    expect(onSort).toHaveBeenLastCalledWith('name', 'asc');
    expect(onSort).toHaveBeenCalledTimes(2);
  });

  it('reaches sortable headers with Tab and cycles the sort with Enter', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        sortColumn={null}
        sortDirection={null}
        onSort={onSort}
      />,
    );
    await user.tab();
    expect(screen.getByText('Name').closest('th')).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSort).toHaveBeenLastCalledWith('name', 'asc');
    await user.tab();
    expect(screen.getByText('Amount').closest('th')).toHaveFocus();
    await user.keyboard(' ');
    expect(onSort).toHaveBeenLastCalledWith('amount', 'asc');
    expect(onSort).toHaveBeenCalledTimes(2);
  });

  it('ignores Enter and Space pressed inside a control in a sortable header', () => {
    const onSort = vi.fn();
    render(
      <DataTable
        columns={[
          {
            id: 'name',
            header: <input aria-label="Filter names" />,
            cell: (r: Row) => r.name,
            sortable: true,
          },
        ]}
        data={DATA}
        getRowId={(r) => r.id}
        onSort={onSort}
      />,
    );
    fireEvent.keyDown(screen.getByLabelText('Filter names'), { key: 'Enter' });
    fireEvent.keyDown(screen.getByLabelText('Filter names'), { key: ' ' });
    expect(onSort).not.toHaveBeenCalled();
  });

  it('exposes a sorted header as a column header with its sort state', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        sortColumn="name"
        sortDirection="desc"
        onSort={vi.fn()}
      />,
    );
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
  });

  it('does not make non-sortable headers focusable', () => {
    render(<DataTable columns={COLUMNS} data={DATA} getRowId={(r) => r.id} onSort={vi.fn()} />);
    expect(screen.getByText('Status').closest('th')).not.toHaveAttribute('tabindex');
  });

  it('select all with a filtered data slice only selects visible rows', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA.slice(0, 2)}
        getRowId={(r) => r.id}
        selectable
        selectedIds={new Set()}
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(screen.getByLabelText('Select all rows'));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['1', '2']));
  });

  it('select all keeps selections on rows that are currently hidden', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA.slice(0, 2)}
        getRowId={(r) => r.id}
        selectable
        selectedIds={new Set(['3'])}
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(screen.getByLabelText('Select all rows'));
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['1', '2', '3']));
  });

  it('deselect all removes only visible rows and keeps hidden selections', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA.slice(0, 2)}
        getRowId={(r) => r.id}
        selectable
        selectedIds={new Set(['1', '2', '3'])}
        onSelectionChange={onSelectionChange}
      />,
    );
    const selectAll = screen.getByLabelText<HTMLInputElement>('Select all rows');
    expect(selectAll).toBeChecked();
    fireEvent.click(selectAll);
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['3']));
  });

  it('reports select-all as indeterminate when only some visible rows are selected', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA.slice(0, 2)}
        getRowId={(r) => r.id}
        selectable
        selectedIds={new Set(['1', '3'])}
        onSelectionChange={() => {}}
      />,
    );
    const selectAll = screen.getByLabelText<HTMLInputElement>('Select all rows');
    expect(selectAll).not.toBeChecked();
    expect(selectAll.indeterminate).toBe(true);
  });

  it('uses labels for select-all, row, expand and empty text', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        selectable
        expandable
        selectedIds={new Set()}
        onSelectionChange={() => {}}
        onExpandChange={() => {}}
        labels={{
          selectAll: 'Select every customer',
          selectRow: (r) => `Select ${r.name}`,
          expandRow: 'Show details',
          collapseRow: 'Hide details',
        }}
      />,
    );
    expect(screen.getByLabelText('Select every customer')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Acme')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Show details')).toHaveLength(3);
  });

  it('uses the labels.empty text when no emptyMessage is given', () => {
    render(
      <DataTable
        columns={COLUMNS}
        data={[]}
        getRowId={(r: Row) => r.id}
        labels={{ empty: 'Nope' }}
      />,
    );
    expect(screen.getByText('Nope')).toBeInTheDocument();
  });

  it('row checkbox label does not expose the raw row id by default', () => {
    const rows = [{ id: 'cust-7f3a9', name: 'Acme', amount: 1, status: 'active' }];
    render(
      <DataTable
        columns={COLUMNS}
        data={rows}
        getRowId={(r) => r.id}
        selectable
        selectedIds={new Set()}
        onSelectionChange={() => {}}
      />,
    );
    const label = screen.getByRole('checkbox', { name: /select row/i }).getAttribute('aria-label');
    expect(label).toBe('Select row 1');
    expect(label).not.toContain('cust-7f3a9');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DataTable
        columns={COLUMNS}
        data={DATA}
        getRowId={(r) => r.id}
        caption="Customer list"
        selectable
        selectedIds={new Set(['1'])}
        onSelectionChange={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
