import * as React from 'react';
import * as RadixSeparator from '@radix-ui/react-separator';
import { cn } from '../../utils/cn';

export const Separator = React.forwardRef<
  React.ElementRef<typeof RadixSeparator.Root>,
  React.ComponentPropsWithoutRef<typeof RadixSeparator.Root>
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <RadixSeparator.Root
    ref={ref}
    orientation={orientation}
    className={cn('mizu-separator', className)}
    {...props}
  />
));
Separator.displayName = 'Separator';
