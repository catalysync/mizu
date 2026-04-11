import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const headingVariants = cva('mizu-heading', {
  variants: {
    size: {
      xs: 'mizu-heading--size-xs',
      sm: 'mizu-heading--size-sm',
      md: 'mizu-heading--size-md',
      lg: 'mizu-heading--size-lg',
      xl: 'mizu-heading--size-xl',
      '2xl': 'mizu-heading--size-2xl',
      '3xl': 'mizu-heading--size-3xl',
      '4xl': 'mizu-heading--size-4xl',
    },
  },
});

const DEFAULT_SIZE_BY_LEVEL: Record<HeadingLevel, HeadingSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'md',
};

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = NonNullable<VariantProps<typeof headingVariants>['size']>;

export interface HeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'size'> {
  /** Semantic heading level 1-6. Drives the element tag unless `as` is set. */
  level: HeadingLevel;
  /** Visual size override. Defaults to the size for the given level. */
  size?: HeadingSize;
  /** Override the rendered element. Defaults to `h${level}`. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, size, as, children, ...props }, ref) => {
    const Tag = (as ?? `h${level}`) as 'h1';
    const resolvedSize = size ?? DEFAULT_SIZE_BY_LEVEL[level];
    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ size: resolvedSize, className }))}
        data-component="mizu-heading"
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
Heading.displayName = 'Heading';
