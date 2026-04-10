import * as React from 'react';
import { cn } from '../utils/cn';

export type AppContentType = 'default' | 'form' | 'table' | 'dashboard' | 'cards' | 'wizard';

export interface AppContentProps extends React.HTMLAttributes<HTMLElement> {
  contentType?: AppContentType;
}

export const AppContent = React.forwardRef<HTMLElement, AppContentProps>(
  ({ className, contentType = 'default', children, ...props }, ref) => (
    <main
      ref={ref}
      className={cn('mizu-app-content', className)}
      data-content-type={contentType}
      {...props}
    >
      {children}
    </main>
  ),
);
AppContent.displayName = 'AppContent';

export interface AppContentHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export const AppContentHeader = React.forwardRef<HTMLDivElement, AppContentHeaderProps>(
  ({ className, title, description, actions, children, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-app-content__header', className)} {...props}>
      <div className="mizu-app-content__header-row">
        <div className="mizu-app-content__header-text">
          <h1 className="mizu-app-content__title">{title}</h1>
          {description && <p className="mizu-app-content__description">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  ),
);
AppContentHeader.displayName = 'AppContentHeader';
