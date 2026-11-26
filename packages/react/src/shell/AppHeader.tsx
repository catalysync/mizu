import * as React from 'react';
import { cn } from '../utils/cn';

export interface AppHeaderProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  nav?: React.ReactNode;
  actions?: React.ReactNode;
  /** Flexible gap that pushes `actions` to the end. Set false when the header is packed. */
  spacer?: boolean;
}

export const AppHeader = React.forwardRef<HTMLElement, AppHeaderProps>(
  ({ className, brand, nav, actions, spacer = true, children, ...props }, ref) => (
    <header
      ref={ref}
      data-component="mizu-app-header"
      className={cn('mizu-app-header', className)}
      {...props}
    >
      {brand && <div className="mizu-app-header__brand">{brand}</div>}
      {nav && <nav className="mizu-app-header__nav">{nav}</nav>}
      {spacer && <div className="mizu-app-header__spacer" />}
      {actions && <div className="mizu-app-header__actions">{actions}</div>}
      {children}
    </header>
  ),
);
AppHeader.displayName = 'AppHeader';
