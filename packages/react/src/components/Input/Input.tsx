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
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>,
    VariantProps<typeof inputVariants> {
  error?: string | boolean;
  helpText?: React.ReactNode;
  label?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  maxCharacters?: number;
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
      prefix,
      suffix,
      maxCharacters,
      id,
      required,
      disabled,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [charCount, setCharCount] = React.useState(0);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (maxCharacters != null) setCharCount(e.target.value.length);
      onChange?.(e);
    };
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

    const hasAdornments = prefix != null || suffix != null;
    const inputEl = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        required={resolvedRequired}
        disabled={resolvedDisabled}
        className={cn(
          inputVariants({ size, appearance }),
          error && 'mizu-input--error',
          hasAdornments && 'mizu-input--adorned',
          prefix && 'mizu-input--has-prefix',
          suffix && 'mizu-input--has-suffix',
          className,
        )}
        aria-invalid={resolvedInvalid}
        aria-describedby={resolvedDescribedBy}
        maxLength={maxCharacters}
        onChange={handleChange}
        {...props}
      />
    );

    const input = hasAdornments ? (
      <div className="mizu-input-group">
        {prefix ? (
          <span className="mizu-input-group__prefix" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        {inputEl}
        {suffix ? (
          <span className="mizu-input-group__suffix" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
      </div>
    ) : (
      inputEl
    );

    if (!label && !error && !helpText && maxCharacters == null) return input;

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
        {maxCharacters != null ? (
          <span className="mizu-form-group__char-count" aria-live="polite">
            {charCount}/{maxCharacters}
          </span>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';
