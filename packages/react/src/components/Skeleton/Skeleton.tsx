import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const skeletonVariants = cva('mizu-skeleton', {
  variants: {
    variant: {
      text: 'mizu-skeleton--text',
      heading: 'mizu-skeleton--heading',
      circle: 'mizu-skeleton--circle',
      button: 'mizu-skeleton--button',
      rect: '',
    },
  },
  defaultVariants: { variant: 'rect' },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => (
    <div
      ref={ref}
      data-component="mizu-skeleton"
      className={cn(skeletonVariants({ variant, className }))}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  ),
);
Skeleton.displayName = 'Skeleton';
