import * as React from 'react';
import { cn } from '../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AppBreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export const AppBreadcrumbs = React.forwardRef<HTMLElement, AppBreadcrumbsProps>(
  ({ className, items, ...props }, ref) => (
    <nav ref={ref} aria-label="Breadcrumb" {...props}>
      <ol className={cn('mizu-app-breadcrumbs', className)}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
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
        })}
      </ol>
    </nav>
  ),
);
AppBreadcrumbs.displayName = 'AppBreadcrumbs';
