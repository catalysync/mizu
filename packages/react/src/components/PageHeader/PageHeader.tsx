import * as React from 'react';
import { cn } from '../../utils/cn';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Primary page title. Renders as h1 by default. */
  title: React.ReactNode;
  /** Optional description rendered below the title. */
  description?: React.ReactNode;
  /** Breadcrumbs slot, rendered above the title. */
  breadcrumbs?: React.ReactNode;
  /** Trailing actions — usually a cluster of Button elements. */
  actions?: React.ReactNode;
  /** Optional filters / toolbar slot, rendered in a new row below the title/actions row. */
  toolbar?: React.ReactNode;
  /** Heading level. Default 1. Set to 2 if nested. */
  level?: 1 | 2;
}

/**
 * Top-of-page preamble — breadcrumbs + title + description + actions + optional
 * toolbar row. Use for any standalone page that isn't a resource-detail page
 * (those get `ResourceHeader`). Think: "All customers", "Reports", "Settings".
 */
export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ title, description, breadcrumbs, actions, toolbar, level = 1, className, ...props }, ref) => {
    const Heading = `h${level}` as 'h1' | 'h2';
    return (
      <header
        ref={ref}
        className={cn('mizu-page-header', className)}
        data-component="mizu-page-header"
        {...props}
      >
        {breadcrumbs ? <div className="mizu-page-header__breadcrumbs">{breadcrumbs}</div> : null}
        <div className="mizu-page-header__row">
          <div className="mizu-page-header__text">
            <Heading className="mizu-page-header__title">{title}</Heading>
            {description ? <p className="mizu-page-header__description">{description}</p> : null}
          </div>
          {actions ? <div className="mizu-page-header__actions">{actions}</div> : null}
        </div>
        {toolbar ? <div className="mizu-page-header__toolbar">{toolbar}</div> : null}
      </header>
    );
  },
);
PageHeader.displayName = 'PageHeader';
