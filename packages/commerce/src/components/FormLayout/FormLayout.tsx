import { cn } from '@aspect/react';
import * as React from 'react';

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  error?: string;
  help?: string;
}

export const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ label, htmlFor, error, help, children, className, ...props }, ref) => (
    <div ref={ref} className={cn('mizu-form-group', className)} {...props}>
      {label && (
        <label htmlFor={htmlFor} className="mizu-label">
          {label}
        </label>
      )}
      {children}
      {error && <span className="mizu-form-group__error">{error}</span>}
      {help && !error && <span className="mizu-form-group__help">{help}</span>}
    </div>
  ),
);
FormGroup.displayName = 'FormGroup';
