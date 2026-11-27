import * as RadixTabs from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../utils/cn';

const tabsVariants = cva('mizu-tabs', {
  variants: {
    variant: {
      underline: 'mizu-tabs--underline',
      segmented: 'mizu-tabs--segmented',
    },
    size: {
      sm: 'mizu-tabs--sm',
      md: 'mizu-tabs--md',
      lg: 'mizu-tabs--lg',
    },
  },
  defaultVariants: {
    variant: 'underline',
    size: 'md',
  },
});

export type TabsProps = React.ComponentPropsWithoutRef<typeof RadixTabs.Root> &
  VariantProps<typeof tabsVariants>;

// `orientation` ("horizontal" | "vertical") is Radix's own prop: it switches the arrow keys
// and sets aria-orientation. The CSS keys off the data-orientation attribute it writes.
export const Tabs = React.forwardRef<React.ElementRef<typeof RadixTabs.Root>, TabsProps>(
  ({ className, variant, size, ...props }, ref) => (
    <RadixTabs.Root
      ref={ref}
      data-component="mizu-tabs"
      className={cn(tabsVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
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
