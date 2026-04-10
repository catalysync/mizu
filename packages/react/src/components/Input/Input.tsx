import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const inputVariants = cva('mizu-input', {
  variants: {
    size: {
      sm: 'mizu-input--sm',
      md: '',
      lg: 'mizu-input--lg',
    },
    appearance: {
      outline: '',
      filled: 'mizu-input--filled',
      underline: 'mizu-input--underline',
    },
  },
  defaultVariants: { size: 'md', appearance: 'outline' },
});

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string | boolean;
  helpText?: React.ReactNode;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, appearance, type = 'text', error, helpText, label, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const errorId = error && typeof error === 'string' ? `${inputId}-error` : undefined;
    const helpId = helpText ? `${inputId}-help` : undefined;

    const input = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn(inputVariants({ size, appearance, className }), error && 'mizu-input--error')}
        aria-invalid={!!error || undefined}
        aria-describedby={errorId || helpId || undefined}
        {...props}
      />
    );

    if (!label && !error && !helpText) return input;

    return (
      <div className="mizu-form-group">
        {label && (
          <label htmlFor={inputId} className="mizu-label">
            {label}
          </label>
        )}
        {input}
        {error && typeof error === 'string' && (
          <span id={errorId} className="mizu-form-group__error">
            {error}
          </span>
        )}
        {helpText && !error && (
          <span id={helpId} className="mizu-form-group__help">
            {helpText}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
