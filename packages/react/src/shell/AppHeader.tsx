import * as React from 'react';
import { cn } from '../utils/cn';

export interface AppHeaderProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  nav?: React.ReactNode;
  actions?: React.ReactNode;
}

export const AppHeader = React.forwardRef<HTMLElement, AppHeaderProps>(
  ({ className, brand, nav, actions, children, ...props }, ref) => (
    <header
      ref={ref}
      data-component="mizu-app-header"
      className={cn('mizu-app-header', className)}
      {...props}
    >
      {brand && <div className="mizu-app-header__brand">{brand}</div>}
      {nav && <nav className="mizu-app-header__nav">{nav}</nav>}
      <div className="mizu-app-header__spacer" />
      {actions && <div className="mizu-app-header__actions">{actions}</div>}
      {children}
    </header>
  ),
);
AppHeader.displayName = 'AppHeader';
