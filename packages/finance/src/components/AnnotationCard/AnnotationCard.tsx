import { cn, Skeleton } from '@aspect/react';
import * as React from 'react';

export interface AnnotationCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
}

export const AnnotationCard = React.forwardRef<HTMLDivElement, AnnotationCardProps>(
  ({ icon, title, children, loading, loadingLabel, className, ...props }, ref) => {
    if (loading) {
      return (
        <div
          ref={ref}
          role="status"
          className={cn('mizu-annotation-card', className)}
          aria-busy="true"
          aria-label={loadingLabel ?? `Loading ${title}`}
          {...props}
        >
          {icon !== undefined && (
            <div className="mizu-annotation-card__icon" aria-hidden="true">
              <Skeleton variant="circle" width="1.5rem" height="1.5rem" />
            </div>
          )}
          <div className="mizu-annotation-card__body">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="70%" />
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('mizu-annotation-card', className)} {...props}>
        {icon && (
          <div className="mizu-annotation-card__icon" aria-hidden="true">
            {icon}
          </div>
        )}
        <div className="mizu-annotation-card__body">
          <p className="mizu-annotation-card__title">{title}</p>
          <div className="mizu-annotation-card__text">{children}</div>
        </div>
      </div>
    );
  },
);
AnnotationCard.displayName = 'AnnotationCard';
