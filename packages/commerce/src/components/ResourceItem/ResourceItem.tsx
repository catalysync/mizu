import * as React from 'react';
import { cn, Skeleton } from '@aspect/react';

export interface ResourceItemProps extends React.HTMLAttributes<HTMLDivElement> {
  media?: React.ReactNode;
  name: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
}

export const ResourceItem = React.forwardRef<HTMLDivElement, ResourceItemProps>(
  ({ media, name, meta, actions, loading, loadingLabel, className, children, ...props }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          role="status"
          className={cn('mizu-resource-item', className)}
          aria-busy="true"
          aria-label={loadingLabel ?? `Loading ${name}`}
          {...props}
        >
          {media !== undefined && (
            <div className="mizu-resource-item__media">
              <Skeleton width="3rem" height="3rem" />
            </div>
          )}
          <div className="mizu-resource-item__content">
            <Skeleton variant="text" width="60%" />
            {meta !== undefined && <Skeleton variant="text" width="40%" />}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('mizu-resource-item', className)} {...props}>
        {media && <div className="mizu-resource-item__media">{media}</div>}
        <div className="mizu-resource-item__content">
          <div className="mizu-resource-item__title">{name}</div>
          {meta && <div className="mizu-resource-item__meta">{meta}</div>}
          {children}
        </div>
        {actions && <div className="mizu-resource-item__actions">{actions}</div>}
      </div>
    );
  },
);
ResourceItem.displayName = 'ResourceItem';
