import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { DataCollection, type DataCollectionProps } from './DataCollection';

interface Row {
  id: string;
  name: string;
}
const rows: Row[] = [
  { id: '1', name: 'Acme' },
  { id: '2', name: 'Globex' },
];

// Harness is typed against the concrete `Row` shape so generic inference doesn't
// degrade to `unknown` through `Parameters<typeof DataCollection>` (the
// generic isn't instantiated when you read its parameters that way).
function Harness(extra?: Partial<DataCollectionProps<Row>>) {
  return (
    <DataCollection<Row>
      data={rows}
      renderTable={(data) => (
        <ul data-testid="table-view">
          {data.map((row) => (
            <li key={row.id}>{row.name}</li>
          ))}
        </ul>
      )}
      renderGrid={(data) => (
        <ul data-testid="grid-view">
          {data.map((row) => (
            <li key={row.id}>{row.name}</li>
          ))}
        </ul>
      )}
      renderList={(data) => (
        <ul data-testid="list-view">
          {data.map((row) => (
            <li key={row.id}>{row.name}</li>
          ))}
        </ul>
      )}
      {...extra}
    />
  );
}

describe('DataCollection', () => {
  it('renders the default view (table when available)', () => {
    render(Harness());
    expect(screen.getByTestId('table-view')).toBeInTheDocument();
    expect(screen.queryByTestId('grid-view')).not.toBeInTheDocument();
  });

  it('switches view when a view-switch button is clicked', async () => {
    const user = userEvent.setup();
    render(Harness());
    await user.click(screen.getByRole('radio', { name: 'Grid view' }));
    expect(screen.getByTestId('grid-view')).toBeInTheDocument();
    expect(screen.queryByTestId('table-view')).not.toBeInTheDocument();
  });

  it('fires onViewChange in controlled mode', async () => {
    const user = userEvent.setup();
    const handleViewChange = vi.fn();
    render(Harness({ view: 'table', onViewChange: handleViewChange, data: rows }));
    await user.click(screen.getByRole('radio', { name: 'List view' }));
    expect(handleViewChange).toHaveBeenCalledWith('list');
  });

  it('renders emptyState when data is empty and not loading', () => {
    render(
      <DataCollection
        data={[]}
        renderTable={() => null}
        emptyState={<p data-testid="empty">No records.</p>}
      />,
    );
    expect(screen.getByTestId('empty')).toHaveTextContent('No records.');
  });

  it('renders loadingFallback when loading', () => {
    render(
      <DataCollection
        data={[]}
        renderTable={() => null}
        loading
        loadingFallback={<div role="progressbar">Loading…</div>}
      />,
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('gives only the selected view a tab stop (roving tabindex)', () => {
    render(Harness());
    expect(screen.getByRole('radio', { name: 'Table view' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Grid view' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'List view' })).toHaveAttribute('tabindex', '-1');
  });

  it('moves the view with arrow keys, wrapping at both ends', async () => {
    const user = userEvent.setup();
    const handleViewChange = vi.fn();
    render(Harness({ onViewChange: handleViewChange }));
    const table = screen.getByRole('radio', { name: 'Table view' });
    table.focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByTestId('grid-view')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Grid view' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Grid view' })).toHaveAttribute('tabindex', '0');
    expect(table).toHaveAttribute('tabindex', '-1');

    await user.keyboard('{ArrowDown}');
    expect(screen.getByTestId('list-view')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'List view' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByTestId('table-view')).toBeInTheDocument();
    expect(table).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByTestId('list-view')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'List view' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByTestId('table-view')).toBeInTheDocument();
    await user.keyboard('{End}');
    expect(screen.getByTestId('list-view')).toBeInTheDocument();
    expect(handleViewChange).toHaveBeenLastCalledWith('list');
  });

  it('uses labels overrides for view names and falls back to defaults', () => {
    render(Harness({ labels: { grid: 'Cards' } }));
    expect(screen.getByRole('radio', { name: 'Cards' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Table view' })).toBeInTheDocument();
  });

  it('does not forward getRowId to the DOM', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(Harness({ getRowId: (row: Row) => row.id }));
      expect(errorSpy).not.toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('has no axe violations in a populated configuration', async () => {
    const { container } = render(Harness());
    expect(await axe(container)).toHaveNoViolations();
  });
});
