import * as React from 'react';
import { cn } from '../../utils/cn';

export type LinkVariant = 'inline' | 'subtle' | 'standalone';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
  external?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'inline', external, target, rel, children, ...props }, ref) => {
    const resolvedTarget = external ? (target ?? '_blank') : target;
    const resolvedRel = external ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel;
    return (
      <a
        ref={ref}
        className={cn('mizu-link', className)}
        data-component="mizu-link"
        data-variant={variant}
        data-external={external || undefined}
        target={resolvedTarget}
        rel={resolvedRel}
        {...props}
      >
        {children}
      </a>
    );
  },
);
Link.displayName = 'Link';
