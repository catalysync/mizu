import * as RadixTooltip from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from '../../utils/cn';

export const TooltipProvider = RadixTooltip.Provider;
export const Tooltip = RadixTooltip.Root;
export const TooltipTrigger = RadixTooltip.Trigger;

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<
  typeof RadixTooltip.Content
> {
  showArrow?: boolean;
}

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof RadixTooltip.Content>,
  TooltipContentProps
>(({ className, sideOffset = 6, showArrow = true, children, ...props }, ref) => (
  <RadixTooltip.Portal>
    <RadixTooltip.Content
      ref={ref}
      sideOffset={sideOffset}
      data-component="mizu-tooltip"
      className={cn('mizu-tooltip', className)}
      {...props}
    >
      {children}
      {showArrow && <RadixTooltip.Arrow className="mizu-tooltip__arrow" />}
    </RadixTooltip.Content>
  </RadixTooltip.Portal>
));
TooltipContent.displayName = 'TooltipContent';
