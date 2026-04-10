import * as React from 'react';
import { cn } from '@aspect/react';

export interface AnnotationCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const AnnotationCard = React.forwardRef<HTMLDivElement, AnnotationCardProps>(
  ({ icon, title, children, className, ...props }, ref) => (
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
  ),
);
AnnotationCard.displayName = 'AnnotationCard';
