import * as React from 'react';
import { cn } from '../utils/cn';

export interface InlineProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'baseline';
}

export const Inline = React.forwardRef<HTMLDivElement, InlineProps>(
  ({ className, gap, align, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mizu-inline', align && `mizu-inline--align-${align}`, className)}
      style={{ ...(gap && { ['--mizu-inline-gap' as never]: gap }), ...style }}
      {...props}
    />
  ),
);
Inline.displayName = 'Inline';
