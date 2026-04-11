import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

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
  (
    {
      className,
      size,
      appearance,
      type = 'text',
      error,
      helpText,
      label,
      id,
      required,
      disabled,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref,
  ) => {
    const ctx = useFieldContext();

    const localInputId =
      id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const inputId = localInputId ?? ctx?.controlId;
    const errorId = error && typeof error === 'string' ? `${inputId}-error` : undefined;
    const helpId = helpText ? `${inputId}-help` : undefined;

    const resolvedRequired = required ?? ctx?.required;
    const resolvedDisabled = disabled ?? ctx?.disabled;
    const resolvedInvalid = ariaInvalidProp ?? (!!error || ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [errorId, helpId, ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp]
        .filter(Boolean)
        .join(' ') || undefined;

    const input = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        required={resolvedRequired}
        disabled={resolvedDisabled}
        className={cn(inputVariants({ size, appearance, className }), error && 'mizu-input--error')}
        aria-invalid={resolvedInvalid}
        aria-describedby={resolvedDescribedBy}
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
