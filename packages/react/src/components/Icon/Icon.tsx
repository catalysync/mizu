import type { LucideIcon, LucideProps } from 'lucide-react';
import * as React from 'react';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  /** The lucide-react icon component to render. */
  icon: LucideIcon;
}

/**
 * Thin wrapper around a lucide-react icon. Three policies:
 *
 * 1. **Color follows currentColor** — icons inherit the surrounding text color
 *    by default. Override with `color` only when you genuinely want a fixed hue.
 * 2. **Default size 16** — matches our text-base line-height; larger sizes are
 *    explicit.
 * 3. **Decorative by default** — when no `aria-label` / `aria-labelledby` is
 *    given, the icon gets `aria-hidden="true"` and no role. Pass an
 *    `aria-label` (or wrap the icon in a labelled element) to make it
 *    meaningful and announce-able.
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    {
      icon: IconComponent,
      size = 16,
      color,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    const decorative = !ariaLabel && !ariaLabelledBy;
    return (
      <IconComponent
        ref={ref}
        size={size}
        color={color ?? 'currentColor'}
        className={className}
        data-component="mizu-icon"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-hidden={decorative || undefined}
        role={decorative ? undefined : 'img'}
        focusable={false}
        {...rest}
      />
    );
  },
);
Icon.displayName = 'Icon';

/**
 * Factory that pre-binds a specific lucide glyph so consumers can write
 * `<HomeIcon />` instead of `<Icon icon={House} />`.
 */
export type WrappedIconProps = Omit<IconProps, 'icon'>;

export function wrapIcon(displayName: string, glyph: LucideIcon) {
  const Wrapped = React.forwardRef<SVGSVGElement, WrappedIconProps>((props, ref) => (
    <Icon ref={ref} icon={glyph} {...props} />
  ));
  Wrapped.displayName = displayName;
  return Wrapped;
}
