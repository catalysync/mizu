import * as React from 'react';
import { cn } from '../../utils/cn';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, separator = '/', children, ...props }, ref) => {
    const items = React.Children.toArray(children);

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn('mizu-breadcrumb', className)}
        {...props}
      >
        {items.map((child, i) => (
          <React.Fragment key={i}>
            <span className="mizu-breadcrumb__item">{child}</span>
            {i < items.length - 1 && (
              <span className="mizu-breadcrumb__separator" aria-hidden="true">
                {separator}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  },
);
Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <a ref={ref} className={cn('mizu-breadcrumb__link', className)} {...props}>
    {children}
  </a>
));
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbCurrent = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('mizu-breadcrumb__current', className)}
    aria-current="page"
    {...props}
  />
));
BreadcrumbCurrent.displayName = 'BreadcrumbCurrent';
