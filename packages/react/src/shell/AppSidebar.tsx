import { Slot } from '@radix-ui/react-slot';
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
  ({ className, label, children, ...props }, ref) => {
    // The label stays in the DOM when the sidebar is collapsed (visually hidden),
    // so aria-labelledby keeps naming the group in both states.
    const labelId = React.useId();
    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={label ? labelId : undefined}
        className={cn('mizu-app-sidebar__section', className)}
        {...props}
      >
        {label && (
          <div id={labelId} className="mizu-app-sidebar__section-label">
            {label}
          </div>
        )}
        {children}
      </div>
    );
  },
);
AppSidebarSection.displayName = 'AppSidebarSection';

export interface AppSidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: React.ReactNode;
  active?: boolean;
  /**
   * Render the item as the single child element (for example a router link).
   * The child receives the item's classes and icon, and its own children become the label.
   */
  asChild?: boolean;
}

export const AppSidebarItem = React.forwardRef<HTMLAnchorElement, AppSidebarItemProps>(
  ({ className, icon, active, asChild, children, ...props }, ref) => {
    const iconNode = icon && <span className="mizu-app-sidebar__item-icon">{icon}</span>;
    const itemClassName = cn('mizu-app-sidebar__item', className);
    const ariaCurrent = active ? 'page' : undefined;

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={itemClassName}
          aria-current={ariaCurrent}
          {...props}
        >
          {React.cloneElement(
            child,
            undefined,
            iconNode,
            <span className="mizu-app-sidebar__item-label">{child.props.children}</span>,
          )}
        </Slot>
      );
    }

    return (
      <a ref={ref} className={itemClassName} aria-current={ariaCurrent} {...props}>
        {iconNode}
        <span className="mizu-app-sidebar__item-label">{children}</span>
      </a>
    );
  },
);
AppSidebarItem.displayName = 'AppSidebarItem';
