import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { invariant } from '../../utils/invariant';

const avatarVariants = cva('mizu-avatar', {
  variants: {
    size: {
      sm: 'mizu-avatar--sm',
      md: 'mizu-avatar--md',
      lg: 'mizu-avatar--lg',
      xl: 'mizu-avatar--xl',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  initials?: string;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, src, alt = '', initials, children, ...props }, ref) => {
    invariant(
      src || initials || children,
      'Avatar requires at least one of: src, initials, or children.',
    );
    return (
      <span
        ref={ref}
        data-component="mizu-avatar"
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        {src ? (
          <img className="mizu-avatar__image" src={src} alt={alt} />
        ) : initials ? (
          <span className="mizu-avatar__initials" aria-label={alt}>
            {initials}
          </span>
        ) : (
          children
        )}
      </span>
    );
  },
);
Avatar.displayName = 'Avatar';
