import * as React from 'react';
import { cn } from '../../utils/cn';

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: React.ReactNode;
  description?: React.ReactNode;
}

export const Fieldset = React.forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ className, legend, description, disabled, children, ...props }, ref) => (
    <fieldset
      ref={ref}
      className={cn('mizu-fieldset', className)}
      data-component="mizu-fieldset"
      data-disabled={disabled || undefined}
      disabled={disabled}
      {...props}
    >
      {legend != null ? <legend className="mizu-fieldset__legend">{legend}</legend> : null}
      {description != null ? <p className="mizu-fieldset__description">{description}</p> : null}
      {children}
    </fieldset>
  ),
);
Fieldset.displayName = 'Fieldset';
