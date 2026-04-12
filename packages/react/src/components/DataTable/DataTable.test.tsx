import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
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
