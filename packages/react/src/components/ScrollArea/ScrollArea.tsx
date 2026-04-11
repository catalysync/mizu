import * as React from 'react';
import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { cn } from '../../utils/cn';

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<
  typeof RadixScrollArea.Root
> {
  /** Orientation of the scrollbar(s) to render. Default: "vertical" */
  orientation?: 'vertical' | 'horizontal' | 'both';
}

const ScrollArea = React.forwardRef<React.ElementRef<typeof RadixScrollArea.Root>, ScrollAreaProps>(
  ({ className, children, orientation = 'vertical', ...props }, ref) => (
    <RadixScrollArea.Root
      ref={ref}
      data-component="mizu-scroll-area"
      className={cn('mizu-scroll-area', className)}
      {...props}
    >
      <RadixScrollArea.Viewport className="mizu-scroll-area__viewport">
        {children}
      </RadixScrollArea.Viewport>
      {(orientation === 'vertical' || orientation === 'both') && (
        <ScrollBar orientation="vertical" />
      )}
      {(orientation === 'horizontal' || orientation === 'both') && (
        <ScrollBar orientation="horizontal" />
      )}
      <RadixScrollArea.Corner className="mizu-scroll-area__corner" />
    </RadixScrollArea.Root>
  ),
);
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof RadixScrollArea.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof RadixScrollArea.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <RadixScrollArea.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn('mizu-scroll-area__scrollbar', className)}
    {...props}
  >
    <RadixScrollArea.ScrollAreaThumb className="mizu-scroll-area__thumb" />
  </RadixScrollArea.ScrollAreaScrollbar>
));
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
