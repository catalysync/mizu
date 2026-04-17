import * as React from 'react';
import { cn } from '../utils/cn';
import type { LayoutAs } from './as';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  min?: string;
  as?: LayoutAs;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, gap, min, style, as: Tag = 'div', ...props }, ref) => {
    const Comp = Tag as 'div';
    return (
      <Comp
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
    );
  },
);
Grid.displayName = 'Grid';
