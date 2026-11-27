import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../Button';

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  /** Required: an icon-only button has no visible text, so it must be named. */
  'aria-label': string;
  size?: 'sm' | 'md' | 'lg';
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <Button
      ref={ref}
      size="icon"
      className={cn('mizu-icon-button', `mizu-icon-button--${size}`, className)}
      {...props}
    />
  ),
);
IconButton.displayName = 'IconButton';

export { IconButton };
