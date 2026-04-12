import * as React from 'react';
import { cn } from '../utils/cn';

interface LayoutContextValue {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const LayoutContext = React.createContext<LayoutContextValue | null>(null);

export function useAppLayout() {
  const ctx = React.useContext(LayoutContext);
  if (!ctx) throw new Error('useAppLayout must be used inside <AppLayout>');
  return ctx;
}

export interface AppLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSidebarCollapsed?: boolean;
  sidebarHidden?: boolean;
}

export const AppLayout = React.forwardRef<HTMLDivElement, AppLayoutProps>(
  (
    { className, defaultSidebarCollapsed = false, sidebarHidden = false, children, ...props },
    ref,
  ) => {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(defaultSidebarCollapsed);
    const value = React.useMemo(
      () => ({ sidebarCollapsed, setSidebarCollapsed }),
      [sidebarCollapsed],
    );
    return (
      <LayoutContext.Provider value={value}>
        <div
          ref={ref}
          data-component="mizu-app-layout"
          className={cn('mizu-app-layout', className)}
          data-sidebar-collapsed={sidebarCollapsed || undefined}
          data-sidebar-hidden={sidebarHidden || undefined}
          {...props}
        >
          {children}
        </div>
      </LayoutContext.Provider>
    );
  },
);
AppLayout.displayName = 'AppLayout';
