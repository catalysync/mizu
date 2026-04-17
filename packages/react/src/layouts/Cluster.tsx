import * as React from 'react';
import { cn } from '../utils/cn';
import type { LayoutAs } from './as';

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  justify?: React.CSSProperties['justifyContent'];
  as?: LayoutAs;
}

export const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
  ({ className, gap, justify, style, as: Tag = 'div', ...props }, ref) => {
    const Comp = Tag as 'div';
    return (
      <Comp
        ref={ref}
        data-component="mizu-cluster"
        className={cn('mizu-cluster', className)}
        style={{
          ...(gap && { ['--mizu-cluster-gap' as never]: gap }),
          ...(justify && { ['--mizu-cluster-justify' as never]: justify }),
          ...style,
        }}
        {...props}
      />
    );
  },
);
Cluster.displayName = 'Cluster';
