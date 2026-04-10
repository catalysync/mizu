import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '../../utils/cn';

export const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>
>(({ className, ...props }, ref) => (
  <RadixSwitch.Root ref={ref} className={cn('mizu-switch', className)} {...props}>
    <RadixSwitch.Thumb className="mizu-switch__thumb" />
  </RadixSwitch.Root>
));
Switch.displayName = 'Switch';
