import * as React from 'react';
import { cn } from '../utils/cn';

export interface AppSidebarProps extends React.HTMLAttributes<HTMLElement> {
  ariaLabel?: string;
}

export const AppSidebar = React.forwardRef<HTMLElement, AppSidebarProps>(
  ({ className, ariaLabel = 'Primary', children, ...props }, ref) => (
    <aside
      ref={ref}
      data-component="mizu-app-sidebar"
      className={cn('mizu-app-sidebar', className)}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </aside>
  ),
);
AppSidebar.displayName = 'AppSidebar';

export interface AppSidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const AppSidebarSection = React.forwardRef<HTMLDivElement, AppSidebarSectionProps>(
  ({ className, label, children, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-app-sidebar__section', className)} {...props}>
      {label && <div className="mizu-app-sidebar__section-label">{label}</div>}
      {children}
    </div>
  ),
);
AppSidebarSection.displayName = 'AppSidebarSection';

export interface AppSidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
}

export const AppSidebarItem = React.forwardRef<HTMLAnchorElement, AppSidebarItemProps>(
  ({ className, icon, active, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn('mizu-app-sidebar__item', className)}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {icon && <span className="mizu-app-sidebar__item-icon">{icon}</span>}
      <span className="mizu-app-sidebar__item-label">{children}</span>
    </a>
  ),
);
AppSidebarItem.displayName = 'AppSidebarItem';
