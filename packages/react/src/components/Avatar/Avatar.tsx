import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { Logger } from '../../utils/logger';

const isDev =
  typeof globalThis !== 'undefined' &&
  'process' in globalThis &&
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).process?.env?.NODE_ENV !== 'production';

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

// Generic person silhouette, shown when there is no image, initials or children.
function PlaceholderIcon() {
  return (
    <svg className="mizu-avatar__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.2 0-7.5 2.2-7.5 5v1.5h15V19c0-2.8-3.3-5-7.5-5Z"
      />
    </svg>
  );
}

// Content priority: image, then initials, then children, then the icon. A failed
// image drops through to the next option instead of leaving an empty circle.
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, src, alt, initials, children, ...props }, ref) => {
    // Remember which src failed rather than a boolean, so a new src gets a fresh attempt
    // without an effect that resets state.
    const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
    const showImage = Boolean(src) && src !== failedSrc;

    React.useEffect(() => {
      if (isDev && src && alt === undefined) {
        Logger.warn(
          'Avatar: src was passed without alt. Pass alt="" if the image is decorative, or the person name if not.',
        );
      }
    }, [src, alt]);

    let content: React.ReactNode;
    if (showImage) {
      content = (
        <img
          className="mizu-avatar__image"
          src={src}
          alt={alt ?? ''}
          onError={() => setFailedSrc(src ?? null)}
        />
      );
    } else if (initials) {
      content = (
        <span className="mizu-avatar__initials" aria-label={alt}>
          {initials}
        </span>
      );
    } else if (children) {
      content = children;
    } else {
      content = <PlaceholderIcon />;
    }

    return (
      <span
        ref={ref}
        data-component="mizu-avatar"
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        {content}
      </span>
    );
  },
);
Avatar.displayName = 'Avatar';
