import * as React from 'react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, actions, ...props }, ref) => (
    <div
      ref={ref}
      data-component="mizu-empty-state"
      className={cn('mizu-empty-state', className)}
      {...props}
    >
      {icon && (
        <div className="mizu-empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h2 className="mizu-empty-state__title">{title}</h2>
      {description && <p className="mizu-empty-state__description">{description}</p>}
      {actions && <div className="mizu-empty-state__actions">{actions}</div>}
    </div>
  ),
);
EmptyState.displayName = 'EmptyState';
