import * as React from 'react';
import { cn } from '../utils/cn';
import type { LayoutAs } from './as';

export interface InlineProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'baseline';
  wrap?: boolean;
  as?: LayoutAs;
}

export const Inline = React.forwardRef<HTMLDivElement, InlineProps>(
  ({ className, gap, align, wrap = true, style, as: Tag = 'div', ...props }, ref) => {
    const Comp = Tag as 'div';
    return (
      <Comp
        ref={ref}
        data-component="mizu-inline"
        className={cn(
          'mizu-inline',
          align && `mizu-inline--align-${align}`,
          !wrap && 'mizu-inline--nowrap',
          className,
        )}
        style={{ ...(gap && { ['--mizu-inline-gap' as never]: gap }), ...style }}
        {...props}
      />
    );
  },
);
Inline.displayName = 'Inline';
