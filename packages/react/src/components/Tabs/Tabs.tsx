import * as RadixTabs from '@radix-ui/react-tabs';
import * as React from 'react';
import { cn } from '../../utils/cn';

export const Tabs = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Root>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Root>
>(({ className, ...props }, ref) => (
  <RadixTabs.Root
    ref={ref}
    data-component="mizu-tabs"
    className={cn('mizu-tabs', className)}
    {...props}
  />
));
Tabs.displayName = 'Tabs';

export const TabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.List>
>(({ className, ...props }, ref) => (
  <RadixTabs.List ref={ref} className={cn('mizu-tabs__list', className)} {...props} />
));
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(({ className, ...props }, ref) => (
  <RadixTabs.Trigger ref={ref} className={cn('mizu-tabs__trigger', className)} {...props} />
));
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
  <RadixTabs.Content ref={ref} className={cn('mizu-tabs__content', className)} {...props} />
));
TabsContent.displayName = 'TabsContent';
