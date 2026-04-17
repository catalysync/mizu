import * as React from 'react';
import { cn } from '../utils/cn';
import type { LayoutAs } from './as';

export interface SplitProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  fraction?: string;
  as?: LayoutAs;
}

export const Split = React.forwardRef<HTMLDivElement, SplitProps>(
  ({ className, gap, fraction, style, as: Tag = 'div', ...props }, ref) => {
    const Comp = Tag as 'div';
    return (
      <Comp
        ref={ref}
        data-component="mizu-split"
        className={cn('mizu-split', className)}
        style={{
          ...(gap && { ['--mizu-split-gap' as never]: gap }),
          ...(fraction && { ['--mizu-split-fraction' as never]: fraction }),
          ...style,
        }}
        {...props}
      />
    );
  },
);
Split.displayName = 'Split';
