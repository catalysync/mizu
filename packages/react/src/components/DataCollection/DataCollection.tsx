import * as React from 'react';
import { cn } from '../../utils/cn';

export type DataCollectionView = 'table' | 'grid' | 'list';

export interface DataCollectionProps<T> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Data slice to render. Consumers own filtering / sorting / pagination and hand us the final slice. */
  data: T[];
  /** Stable id extractor, used when counting / keying. */
  getRowId?: (item: T) => string;

  /** Which views to expose in the view-switch. Defaults to `['table','grid','list']` — minus the renderers you didn't provide. */
  views?: DataCollectionView[];
  /** Currently active view. Controlled. */
  view?: DataCollectionView;
  /** Default active view when uncontrolled. */
  defaultView?: DataCollectionView;
  /** Fires when the user picks a view. */
  onViewChange?: (view: DataCollectionView) => void;

  /** Renderer for the table view — typically returns a `<DataTable>`. */
  renderTable?: (data: T[]) => React.ReactNode;
  /** Renderer for the grid view — typically returns a grid of `<Card>`s. */
  renderGrid?: (data: T[]) => React.ReactNode;
  /** Renderer for the list view — typically returns stacked row cards. */
  renderList?: (data: T[]) => React.ReactNode;

  /** Left-of-search toolbar slot — filter chips / property pickers. */
  toolbar?: React.ReactNode;
  /** Search slot — typically an `<Input>` with a search icon. */
  search?: React.ReactNode;
  /** Right-side action slot — bulk actions, exports, etc. */
  actions?: React.ReactNode;
  /** Pagination slot rendered below the view. */
  pagination?: React.ReactNode;

  /** Rendered when `loading` is true. Callers typically provide a skeleton. */
  loading?: boolean;
  loadingFallback?: React.ReactNode;
  /** Rendered when `data.length === 0` and not loading. */
  emptyState?: React.ReactNode;

  /** sr-only label for the view-switch radio group. Defaults to "View". */
  viewSwitchLabel?: string;
}

const VIEW_LABEL: Record<DataCollectionView, string> = {
  table: 'Table view',
  grid: 'Grid view',
  list: 'List view',
};

const VIEW_ICON: Record<DataCollectionView, React.ReactNode> = {
  table: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
    </svg>
  ),
  grid: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  list: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  ),
};

function DataCollectionInner<T>(
  {
    data,
    views,
    view: viewProp,
    defaultView,
    onViewChange,
    renderTable,
    renderGrid,
    renderList,
    toolbar,
    search,
    actions,
    pagination,
    loading,
    loadingFallback,
    emptyState,
    viewSwitchLabel = 'View',
    className,
    ...props
  }: DataCollectionProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const availableViews = React.useMemo<DataCollectionView[]>(() => {
    const provided: DataCollectionView[] = [];
    if (renderTable) provided.push('table');
    if (renderGrid) provided.push('grid');
    if (renderList) provided.push('list');
    if (!views) return provided;
    return views.filter((v) => provided.includes(v));
  }, [views, renderTable, renderGrid, renderList]);

  const [uncontrolledView, setUncontrolledView] = React.useState<DataCollectionView>(
    defaultView ?? availableViews[0] ?? 'table',
  );
  const view = viewProp ?? uncontrolledView;
  const controlled = viewProp !== undefined;

  const selectView = (next: DataCollectionView) => {
    if (!controlled) setUncontrolledView(next);
    onViewChange?.(next);
  };

  const renderView = () => {
    if (view === 'table' && renderTable) return renderTable(data);
    if (view === 'grid' && renderGrid) return renderGrid(data);
    if (view === 'list' && renderList) return renderList(data);
    return null;
  };

  const hasHeader = Boolean(toolbar || search || actions || availableViews.length > 1);

  return (
    <div
      ref={ref}
      className={cn('mizu-data-collection', className)}
      data-component="mizu-data-collection"
      {...props}
    >
      {hasHeader ? (
        <div className="mizu-data-collection__header">
          {toolbar ? <div className="mizu-data-collection__toolbar">{toolbar}</div> : null}
          {search ? <div className="mizu-data-collection__search">{search}</div> : null}
          <div className="mizu-data-collection__header-spacer" />
          {actions ? <div className="mizu-data-collection__actions">{actions}</div> : null}
          {availableViews.length > 1 ? (
            <div
              className="mizu-data-collection__view-switch"
              role="radiogroup"
              aria-label={viewSwitchLabel}
            >
              {availableViews.map((v) => {
                const selected = v === view;
                return (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={VIEW_LABEL[v]}
                    data-selected={selected || undefined}
                    className="mizu-data-collection__view-button"
                    onClick={() => selectView(v)}
                  >
                    {VIEW_ICON[v]}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        className="mizu-data-collection__body"
        data-view={view}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
      >
        {loading && loadingFallback
          ? loadingFallback
          : data.length === 0 && !loading && emptyState
            ? emptyState
            : renderView()}
      </div>
      {pagination ? <div className="mizu-data-collection__pagination">{pagination}</div> : null}
    </div>
  );
}

export const DataCollection = React.forwardRef(DataCollectionInner) as <T>(
  props: DataCollectionProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
(DataCollection as { displayName?: string }).displayName = 'DataCollection';
