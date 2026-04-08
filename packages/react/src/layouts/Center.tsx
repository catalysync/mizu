import * as React from 'react';
import { cn } from '../utils/cn';

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: string;
  padding?: string;
  column?: boolean;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, max, padding, column, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mizu-center', column && 'mizu-center--column', className)}
      style={{
        ...(max && { ['--mizu-center-max' as never]: max }),
        ...(padding && { ['--mizu-center-padding' as never]: padding }),
        ...style,
      }}
      {...props}
    />
  ),
);
Center.displayName = 'Center';
