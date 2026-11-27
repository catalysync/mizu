import * as RadixRadio from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from '../../utils/cn';

// Radix RadioGroup supplies roving tabindex and arrow-key selection; the segments are
// radios, so the control is a single tab stop and each arrow key moves and selects.
export const SegmentedControl = React.forwardRef<
  React.ElementRef<typeof RadixRadio.Root>,
  React.ComponentPropsWithoutRef<typeof RadixRadio.Root>
>(({ className, ...props }, ref) => (
  <RadixRadio.Root
    ref={ref}
    data-component="mizu-segmented-control"
    className={cn('mizu-segmented-control', className)}
    {...props}
  />
));
SegmentedControl.displayName = 'SegmentedControl';

export const SegmentedControlItem = React.forwardRef<
  React.ElementRef<typeof RadixRadio.Item>,
  React.ComponentPropsWithoutRef<typeof RadixRadio.Item>
>(({ className, ...props }, ref) => (
  <RadixRadio.Item ref={ref} className={cn('mizu-segmented-control__item', className)} {...props} />
));
SegmentedControlItem.displayName = 'SegmentedControlItem';
