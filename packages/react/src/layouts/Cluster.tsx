import * as React from 'react';
import { cn } from '../utils/cn';

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  justify?: React.CSSProperties['justifyContent'];
}

export const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
  ({ className, gap, justify, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mizu-cluster', className)}
      style={{
        ...(gap && { ['--mizu-cluster-gap' as never]: gap }),
        ...(justify && { ['--mizu-cluster-justify' as never]: justify }),
        ...style,
      }}
      {...props}
    />
  ),
);
Cluster.displayName = 'Cluster';
