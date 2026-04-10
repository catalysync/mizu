import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

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
  ({ className, size, src, alt = '', initials, children, ...props }, ref) => (
    <span ref={ref} className={cn(avatarVariants({ size, className }))} {...props}>
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
  ),
);
Avatar.displayName = 'Avatar';
