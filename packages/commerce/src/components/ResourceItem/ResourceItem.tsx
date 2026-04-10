import * as React from 'react';
import { cn } from '@aspect/react';

export interface ResourceItemProps extends React.HTMLAttributes<HTMLDivElement> {
  media?: React.ReactNode;
  name: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}

export const ResourceItem = React.forwardRef<HTMLDivElement, ResourceItemProps>(
  ({ media, name, meta, actions, className, children, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-resource-item', className)} {...props}>
      {media && <div className="mizu-resource-item__media">{media}</div>}
      <div className="mizu-resource-item__content">
        <div className="mizu-resource-item__title">{name}</div>
        {meta && <div className="mizu-resource-item__meta">{meta}</div>}
        {children}
      </div>
      {actions && <div className="mizu-resource-item__actions">{actions}</div>}
    </div>
  ),
);
ResourceItem.displayName = 'ResourceItem';
