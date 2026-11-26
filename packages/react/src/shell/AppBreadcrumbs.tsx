import * as React from 'react';
import { cn } from '../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppBreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /**
   * Maximum number of crumbs shown. When there are more items, the middle ones
   * collapse into a single ellipsis, keeping the first crumb and the trailing
   * ones. Values below 2 are treated as 2.
   */
  maxVisible?: number;
}

export const AppBreadcrumbs = React.forwardRef<HTMLElement, AppBreadcrumbsProps>(
  ({ className, items, maxVisible, ...props }, ref) => {
    const limit = maxVisible === undefined ? Infinity : Math.max(2, Math.floor(maxVisible));
    const collapse = items.length > limit;
    // Keep the first crumb plus the tail; the ellipsis takes one slot.
    const tailStart = collapse ? items.length - (limit - 1) : 0;
    const hiddenCount = collapse ? tailStart - 1 : 0;

    const renderItem = (item: BreadcrumbItem, i: number, lastIndex: number) => {
      const isLast = i === lastIndex;
      return (
        <li
          key={`${item.label}-${i}`}
          className="mizu-app-breadcrumbs__item"
          aria-current={isLast ? 'page' : undefined}
        >
          {isLast || !item.href ? (
            item.label
          ) : (
            <a className="mizu-app-breadcrumbs__link" href={item.href}>
              {item.label}
            </a>
          )}
        </li>
      );
    };

    const visible = collapse
      ? [
          ...items.slice(0, 1).map((item, i) => renderItem(item, i, items.length - 1)),
          <li key="__overflow" className="mizu-app-breadcrumbs__overflow">
            <span aria-hidden="true">…</span>
            <span className="mizu-sr-only">{`${hiddenCount} more levels`}</span>
          </li>,
          ...items
            .slice(tailStart)
            .map((item, i) => renderItem(item, tailStart + i, items.length - 1)),
        ]
      : items.map((item, i) => renderItem(item, i, items.length - 1));

    return (
      <nav ref={ref} aria-label="Breadcrumb" {...props}>
        <ol data-component="mizu-app-breadcrumbs" className={cn('mizu-app-breadcrumbs', className)}>
          {visible}
        </ol>
      </nav>
    );
  },
);
AppBreadcrumbs.displayName = 'AppBreadcrumbs';
