import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import * as React from 'react';
import { usePortalIdentity } from '../../primitives/Portal';
import { cn } from '../../utils/cn';

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export interface HoverCardContentProps extends React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Content
> {
  showArrow?: boolean;
}

export const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(({ className, sideOffset = 6, showArrow = false, children, ...props }, forwardedRef) => {
  const identity =
    usePortalIdentity<React.ElementRef<typeof HoverCardPrimitive.Content>>(forwardedRef);
  return (
    <>
      {identity.anchor}
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          ref={identity.ref}
          sideOffset={sideOffset}
          data-component="mizu-hover-card"
          className={cn('mizu-hover-card', className)}
          {...props}
        >
          {children}
          {showArrow && <HoverCardPrimitive.Arrow className="mizu-hover-card__arrow" />}
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </>
  );
});
HoverCardContent.displayName = 'HoverCardContent';
