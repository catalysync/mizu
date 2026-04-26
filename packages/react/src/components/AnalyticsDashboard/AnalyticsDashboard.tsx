import * as React from 'react';
import { cn } from '../../utils/cn';

export interface AnalyticsDashboardTileProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'title'
> {
  /** Tile title, rendered as an h3. */
  title: React.ReactNode;
  /** Optional description rendered below the title. */
  description?: React.ReactNode;
  /** Optional tile-level actions (e.g. a menu trigger, an expand button). */
  actions?: React.ReactNode;
  /** How many grid columns this tile spans. Defaults to 1. */
  colSpan?: 1 | 2 | 3 | 4;
  /** How many grid rows this tile spans. Defaults to 1. */
  rowSpan?: 1 | 2 | 3;
  /** Loading state — consumers can hide or swap their chart. Tile-level skeleton is the consumer's responsibility. */
  loading?: boolean;
}

/**
 * A single tile in an `<AnalyticsDashboard>` grid. Renders a titled card with
 * an actions slot and a body slot. The body is whatever chart / KPI / table
 * the consumer drops in — mizu doesn't pick the chart library per tile.
 */
export const AnalyticsDashboardTile = React.forwardRef<HTMLElement, AnalyticsDashboardTileProps>(
  (
    {
      title,
      description,
      actions,
      colSpan = 1,
      rowSpan = 1,
      loading,
      className,
      children,
      style,
      ...props
    },
    ref,
  ) => (
    <section
      ref={ref}
      className={cn('mizu-analytics-dashboard__tile', className)}
      data-component="mizu-analytics-dashboard-tile"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        ...style,
      }}
      {...props}
    >
      <header className="mizu-analytics-dashboard__tile-header">
        <div className="mizu-analytics-dashboard__tile-text">
          <h3 className="mizu-analytics-dashboard__tile-title">{title}</h3>
          {description ? (
            <p className="mizu-analytics-dashboard__tile-description">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="mizu-analytics-dashboard__tile-actions">{actions}</div> : null}
      </header>
      <div className="mizu-analytics-dashboard__tile-body">{children}</div>
    </section>
  ),
);
AnalyticsDashboardTile.displayName = 'AnalyticsDashboardTile';

export interface AnalyticsDashboardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /** Base number of columns at desktop widths. Defaults to 4. */
  columns?: 2 | 3 | 4 | 6;
  /** Optional filter bar rendered above the grid — typically a `DateNavigator` + search. */
  filters?: React.ReactNode;
  /** Optional header actions rendered at the top-right. */
  actions?: React.ReactNode;
  /** Title + description rendered above the grid. Pass `null` to omit. */
  title?: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * A responsive grid of chart / KPI tiles for dashboards. Doesn't ship with any
 * charts itself — consumers drop `@aspect/charts` components (or anything) into
 * `<AnalyticsDashboardTile>` children. The grid handles spacing and responsive
 * reflow; the tiles handle title + actions. Below `md` (768px), tiles stack
 * one per row regardless of `colSpan`.
 */
export const AnalyticsDashboard = React.forwardRef<HTMLDivElement, AnalyticsDashboardProps>(
  ({ columns = 4, filters, actions, title, description, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mizu-analytics-dashboard', className)}
      data-component="mizu-analytics-dashboard"
      data-columns={columns}
      {...props}
    >
      {(title || filters || actions) && (
        <header className="mizu-analytics-dashboard__header">
          {(title || description) && (
            <div className="mizu-analytics-dashboard__title-group">
              {title ? <h2 className="mizu-analytics-dashboard__title">{title}</h2> : null}
              {description ? (
                <p className="mizu-analytics-dashboard__description">{description}</p>
              ) : null}
            </div>
          )}
          {filters ? <div className="mizu-analytics-dashboard__filters">{filters}</div> : null}
          {actions ? <div className="mizu-analytics-dashboard__actions">{actions}</div> : null}
        </header>
      )}
      <div className="mizu-analytics-dashboard__grid">{children}</div>
    </div>
  ),
);
AnalyticsDashboard.displayName = 'AnalyticsDashboard';
