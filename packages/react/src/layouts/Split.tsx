import * as React from 'react';
import { cn } from '../utils/cn';

export interface SplitProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  fraction?: string;
}

export const Split = React.forwardRef<HTMLDivElement, SplitProps>(
  ({ className, gap, fraction, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mizu-split', className)}
      style={{
        ...(gap && { ['--mizu-split-gap' as never]: gap }),
        ...(fraction && { ['--mizu-split-fraction' as never]: fraction }),
        ...style,
      }}
      {...props}
    />
  ),
);
Split.displayName = 'Split';
