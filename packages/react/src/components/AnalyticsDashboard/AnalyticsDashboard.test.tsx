import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { AnalyticsDashboard, AnalyticsDashboardTile } from './AnalyticsDashboard';

describe('AnalyticsDashboard', () => {
  it('renders title + description + tiles', () => {
    render(
      <AnalyticsDashboard title="Revenue" description="Monthly revenue trends">
        <AnalyticsDashboardTile title="MRR">$12k</AnalyticsDashboardTile>
        <AnalyticsDashboardTile title="ARR">$144k</AnalyticsDashboardTile>
      </AnalyticsDashboard>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Revenue' })).toBeInTheDocument();
    expect(screen.getByText('Monthly revenue trends')).toBeInTheDocument();
    expect(screen.getByText('MRR')).toBeInTheDocument();
    expect(screen.getByText('ARR')).toBeInTheDocument();
  });

  it('forwards colSpan to grid-column style', () => {
    const { container } = render(
      <AnalyticsDashboard>
        <AnalyticsDashboardTile title="Wide" colSpan={2}>
          body
        </AnalyticsDashboardTile>
      </AnalyticsDashboard>,
    );
    const tile = container.querySelector('.mizu-analytics-dashboard__tile') as HTMLElement;
    expect(tile.style.gridColumn).toBe('span 2');
  });

  it('reflects loading state with aria-busy + data-loading', () => {
    const { container } = render(
      <AnalyticsDashboard>
        <AnalyticsDashboardTile title="MRR" loading>
          loading…
        </AnalyticsDashboardTile>
      </AnalyticsDashboard>,
    );
    const tile = container.querySelector('.mizu-analytics-dashboard__tile') as HTMLElement;
    expect(tile.getAttribute('aria-busy')).toBe('true');
    expect(tile.getAttribute('data-loading')).toBe('true');
  });

  it('has no axe violations in a multi-tile configuration', async () => {
    const { container } = render(
      <AnalyticsDashboard title="Sales overview" description="Last 30 days">
        <AnalyticsDashboardTile title="MRR" description="Monthly recurring revenue">
          $12k
        </AnalyticsDashboardTile>
        <AnalyticsDashboardTile title="New customers" colSpan={2}>
          128
        </AnalyticsDashboardTile>
      </AnalyticsDashboard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
