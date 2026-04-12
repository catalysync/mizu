import * as React from 'react';
import { cn } from '../utils/cn';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  min?: string;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, gap, min, style, ...props }, ref) => (
    <div
      ref={ref}
      data-component="mizu-grid"
      className={cn('mizu-grid', className)}
      style={{
        ...(gap && { ['--mizu-grid-gap' as never]: gap }),
        ...(min && { ['--mizu-grid-min' as never]: min }),
        ...style,
      }}
      {...props}
    />
  ),
);
Grid.displayName = 'Grid';
