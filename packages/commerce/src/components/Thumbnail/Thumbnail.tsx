import * as React from 'react';
import { cn } from '@aspect/react';
import { cva, type VariantProps } from 'class-variance-authority';

const thumbnailVariants = cva('mizu-thumbnail', {
  variants: {
    size: {
      xs: 'mizu-thumbnail--xs',
      sm: 'mizu-thumbnail--sm',
      md: 'mizu-thumbnail--md',
      lg: 'mizu-thumbnail--lg',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface ThumbnailProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof thumbnailVariants> {
  source: string;
  alt: string;
}

export const Thumbnail = React.forwardRef<HTMLSpanElement, ThumbnailProps>(
  ({ source, alt, size, className, ...props }, ref) => (
    <span ref={ref} className={cn(thumbnailVariants({ size, className }))} {...props}>
      <img src={source} alt={alt} />
    </span>
  ),
);
Thumbnail.displayName = 'Thumbnail';
