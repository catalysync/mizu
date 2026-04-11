import * as React from 'react';
import { cn } from '../../utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Marks the associated field as required by rendering a visible asterisk. */
  required?: boolean;
  /** Custom text for the screen-reader-only "required" suffix. Defaults to "(required)". */
  requiredLabel?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, requiredLabel = '(required)', children, ...props }, ref) => (
    <label ref={ref} className={cn('mizu-label', className)} data-component="mizu-label" {...props}>
      {children}
      {required ? (
        <>
          <span className="mizu-label__required" aria-hidden="true">
            *
          </span>
          <span className="mizu-label__sr-only">{requiredLabel}</span>
        </>
      ) : null}
    </label>
  ),
);
Label.displayName = 'Label';
