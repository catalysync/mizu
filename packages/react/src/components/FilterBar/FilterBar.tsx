import * as React from 'react';
import { cn } from '../../utils/cn';

export interface AppliedFilter {
  key: string;
  label: string;
  value: string;
}

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  appliedFilters?: AppliedFilter[];
  onRemoveFilter?: (key: string) => void;
  onClearAll?: () => void;
  actions?: React.ReactNode;
}

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      searchValue = '',
      searchPlaceholder = 'Search…',
      onSearchChange,
      appliedFilters = [],
      onRemoveFilter,
      onClearAll,
      actions,
      className,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-component="mizu-filter-bar"
      className={cn('mizu-filter-bar', className)}
      {...props}
    >
      <div className="mizu-filter-bar__controls">
        <input
          type="text"
          className="mizu-input mizu-input--sm mizu-filter-bar__search"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search"
        />
        {actions}
      </div>
      {appliedFilters.length > 0 && (
        <div className="mizu-filter-bar__pills">
          {appliedFilters.map((f) => (
            <span key={f.key} className="mizu-filter-pill">
              <span className="mizu-filter-pill__label">{f.label}:</span>
              {f.value}
              {onRemoveFilter && (
                <button
                  type="button"
                  className="mizu-filter-pill__remove"
                  onClick={() => onRemoveFilter(f.key)}
                  aria-label={`Remove ${f.label} filter`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="10"
                    height="10"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </span>
          ))}
          {onClearAll && appliedFilters.length > 1 && (
            <button type="button" className="mizu-filter-bar__clear" onClick={onClearAll}>
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  ),
);
FilterBar.displayName = 'FilterBar';
