import * as React from 'react';
import { cn } from '../utils/cn';
import type { LayoutAs } from './as';

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: string;
  padding?: string;
  column?: boolean;
  as?: LayoutAs;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, max, padding, column, style, as: Tag = 'div', ...props }, ref) => {
    const Comp = Tag as 'div';
    return (
      <Comp
        ref={ref}
        data-component="mizu-center"
        className={cn('mizu-center', column && 'mizu-center--column', className)}
        style={{
          ...(max && { ['--mizu-center-max' as never]: max }),
          ...(padding && { ['--mizu-center-padding' as never]: padding }),
          ...style,
        }}
        {...props}
      />
    );
  },
);
Center.displayName = 'Center';
