import * as React from 'react';
import { cn } from '../../utils/cn';

export type SortDirection = 'asc' | 'desc' | null;
export type DataTableDensity = 'compact' | 'default' | 'comfortable';

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: string;
}

export interface DataTableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;

  sortColumn?: string | null;
  sortDirection?: SortDirection;
  onSort?: (column: string, direction: SortDirection) => void;

  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;

  expandable?: boolean;
  expandedIds?: Set<string>;
  onExpandChange?: (ids: Set<string>) => void;
  renderExpanded?: (row: T) => React.ReactNode;

  striped?: boolean;
  stickyHeader?: boolean;
  density?: DataTableDensity;
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: React.ReactNode;
  caption?: string;
  tableClassName?: string;
}

function cycleSortDirection(current: SortDirection): SortDirection {
  if (current === null) return 'asc';
  if (current === 'asc') return 'desc';
  return null;
}

function DataTableInner<T>(
  {
    columns,
    data,
    getRowId,
    sortColumn,
    sortDirection,
    onSort,
    selectable,
    selectedIds,
    onSelectionChange,
    expandable,
    expandedIds,
    onExpandChange,
    renderExpanded,
    striped = false,
    stickyHeader = false,
    density = 'default',
    loading = false,
    loadingRows = 5,
    emptyMessage = 'No data to display.',
    caption,
    className,
    tableClassName,
    ...props
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const allIds = React.useMemo(() => new Set(data.map(getRowId)), [data, getRowId]);
  const selected = selectedIds ?? new Set<string>();
  const expanded = expandedIds ?? new Set<string>();
  const allSelected = allIds.size > 0 && allIds.size === selected.size;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? new Set() : new Set(allIds));
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const toggleExpand = (id: string) => {
    if (!onExpandChange) return;
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onExpandChange(next);
  };

  const handleSort = (colId: string) => {
    if (!onSort) return;
    const next = sortColumn === colId ? cycleSortDirection(sortDirection ?? null) : 'asc';
    onSort(colId, next);
  };

  const totalCols = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);

  return (
    <div
      ref={ref}
      className={cn('mizu-data-table__wrapper', className)}
      data-component="mizu-data-table"
      {...props}
    >
      <table
        className={cn('mizu-data-table', tableClassName)}
        data-striped={striped || undefined}
        data-sticky-header={stickyHeader || undefined}
        data-density={density === 'default' ? undefined : density}
      >
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {selectable ? (
              <th className="mizu-data-table__select-cell">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </th>
            ) : null}
            {expandable ? <th className="mizu-data-table__expand-cell" /> : null}
            {columns.map((col) => (
              <th
                key={col.id}
                data-sortable={col.sortable || undefined}
                data-sort-direction={
                  sortColumn === col.id && sortDirection ? sortDirection : undefined
                }
                data-align={col.align}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => handleSort(col.id) : undefined}
                aria-sort={
                  sortColumn === col.id && sortDirection
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {col.header}
                {col.sortable ? (
                  <span className="mizu-data-table__sort-icon" aria-hidden="true">
                    {sortColumn === col.id && sortDirection === 'asc'
                      ? '▲'
                      : sortColumn === col.id && sortDirection === 'desc'
                        ? '▼'
                        : '⇕'}
                  </span>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: loadingRows }, (_, i) => (
              <tr key={`loading-${i}`} className="mizu-data-table__loading-row">
                {selectable ? <td className="mizu-data-table__select-cell" /> : null}
                {expandable ? <td className="mizu-data-table__expand-cell" /> : null}
                {columns.map((col) => (
                  <td key={col.id}>
                    <div
                      className="mizu-data-table__loading-bar"
                      style={{ width: `${50 + ((i * 17 + columns.indexOf(col) * 23) % 40)}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={totalCols} className="mizu-data-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const id = getRowId(row);
              const isSelected = selected.has(id);
              const isExpanded = expanded.has(id);
              return (
                <React.Fragment key={id}>
                  <tr data-selected={isSelected || undefined}>
                    {selectable ? (
                      <td className="mizu-data-table__select-cell">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                          aria-label={`Select row ${id}`}
                        />
                      </td>
                    ) : null}
                    {expandable ? (
                      <td className="mizu-data-table__expand-cell">
                        <button
                          type="button"
                          className="mizu-data-table__expand-btn"
                          data-expanded={isExpanded || undefined}
                          onClick={() => toggleExpand(id)}
                          aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                          aria-expanded={isExpanded}
                        >
                          ›
                        </button>
                      </td>
                    ) : null}
                    {columns.map((col) => (
                      <td key={col.id} data-align={col.align}>
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                  {expandable && isExpanded && renderExpanded ? (
                    <tr className="mizu-data-table__expanded-row">
                      <td colSpan={totalCols}>{renderExpanded(row)}</td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export const DataTable = React.forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
(DataTable as { displayName?: string }).displayName = 'DataTable';
