import { cn } from '@aspect/react';
import * as React from 'react';

export interface ChartEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  message?: React.ReactNode;
}

export const ChartEmpty = React.forwardRef<HTMLDivElement, ChartEmptyProps>(
  ({ height = 320, message = 'No data to display.', className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mizu-chart', 'mizu-chart--empty', className)}
      style={{ height, ...style }}
      {...props}
    >
      <span className="mizu-chart__empty-message">{message}</span>
    </div>
  ),
);
ChartEmpty.displayName = 'ChartEmpty';
