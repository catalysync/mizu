import * as React from 'react';
import { cn } from '../utils/cn';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  as?: keyof React.JSX.IntrinsicElements;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap, align, style, as: Tag = 'div', ...props }, ref) => {
    const Comp = Tag as 'div';
    return (
      <Comp
        ref={ref}
        className={cn('mizu-stack', align && `mizu-stack--align-${align}`, className)}
        style={{ ...(gap && { ['--mizu-stack-gap' as never]: gap }), ...style }}
        {...props}
      />
    );
  },
);
Stack.displayName = 'Stack';
