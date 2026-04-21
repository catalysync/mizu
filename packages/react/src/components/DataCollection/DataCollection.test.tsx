import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { DataCollection } from './DataCollection';

const rows = [
  { id: '1', name: 'Acme' },
  { id: '2', name: 'Globex' },
];

function Harness(extra?: Parameters<typeof DataCollection>[0]) {
  return (
    <DataCollection
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

  it('has no axe violations in a populated configuration', async () => {
    const { container } = render(Harness());
    expect(await axe(container)).toHaveNoViolations();
  });
});
