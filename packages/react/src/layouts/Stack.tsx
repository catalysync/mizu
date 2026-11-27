import * as React from 'react';
import { cn } from '../utils/cn';
import type { LayoutAs } from './as';

// Steps of the `--mizu-spacing-*` scale. `none` maps to spacing-0.
export type StackGap =
  | 'none'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '8'
  | '10'
  | '12'
  | '16'
  | '20'
  | '24';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: StackGap;
  align?: 'start' | 'center' | 'end' | 'stretch';
  as?: LayoutAs;
}

const gapValue = (gap: StackGap) => `var(--mizu-spacing-${gap === 'none' ? '0' : gap})`;

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap, align, style, as: Tag = 'div', ...props }, ref) => {
    const Comp = Tag as 'div';
    return (
      <Comp
        ref={ref}
        data-component="mizu-stack"
        className={cn('mizu-stack', align && `mizu-stack--align-${align}`, className)}
        style={{ ...(gap && { ['--mizu-stack-gap' as never]: gapValue(gap) }), ...style }}
        {...props}
      />
    );
  },
);
Stack.displayName = 'Stack';
