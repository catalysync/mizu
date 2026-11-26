import * as React from 'react';
import { cn } from '../utils/cn';

export type AppContentType = 'default' | 'form' | 'table' | 'dashboard';

export interface AppContentProps extends React.HTMLAttributes<HTMLElement> {
  contentType?: AppContentType;
  /** Element to render. Default `main`; use `div` when the host app already provides a main landmark. */
  as?: 'main' | 'div' | 'section' | 'article';
}

export const AppContent = React.forwardRef<HTMLElement, AppContentProps>(
  ({ className, contentType = 'default', as: Tag = 'main', children, ...props }, ref) => {
    const Comp = Tag as 'main';
    return (
      <Comp
        ref={ref}
        data-component="mizu-app-content"
        className={cn('mizu-app-content', className)}
        data-content-type={contentType}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
AppContent.displayName = 'AppContent';

export interface AppContentHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Heading level for the title. Default 1 (page title); use 2 or 3 for sections within a page. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const AppContentHeader = React.forwardRef<HTMLDivElement, AppContentHeaderProps>(
  ({ className, title, description, actions, level = 1, children, ...props }, ref) => {
    const Heading = `h${level}` as 'h1';
    return (
      <div ref={ref} className={cn('mizu-app-content__header', className)} {...props}>
        <div className="mizu-app-content__header-row">
          <div className="mizu-app-content__header-text">
            <Heading className="mizu-app-content__title">{title}</Heading>
            {description && <p className="mizu-app-content__description">{description}</p>}
          </div>
          {actions}
        </div>
        {children}
      </div>
    );
  },
);
AppContentHeader.displayName = 'AppContentHeader';
