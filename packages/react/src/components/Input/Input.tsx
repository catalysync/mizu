import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
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
  /** Marks the input invalid. Show the message with `<Field errorMessage="...">`. */
  error?: boolean;
  warning?: string | boolean;
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
      warning,
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
    const [charCountLive, setCharCountLive] = React.useState<'off' | 'polite'>('off');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (maxCharacters != null) setCharCount(e.target.value.length);
      onChange?.(e);
    };
    const ctx = useFieldContext();

    const inputId = id ?? ctx?.controlId;

    const resolvedRequired = required ?? ctx?.required;
    const resolvedDisabled = disabled ?? ctx?.disabled;
    const resolvedInvalid = ariaInvalidProp ?? (!!error || ctx?.invalid || undefined);
    // Only ids of nodes Field actually renders; Input no longer renders its own error or help text.
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    const hasAdornments = prefix != null || suffix != null;
    const inputEl = (
      <input
        ref={ref}
        id={inputId}
        type={type}
        required={resolvedRequired}
        disabled={resolvedDisabled}
        data-component="mizu-input"
        className={cn(
          inputVariants({ size, appearance }),
          error && 'mizu-input--error',
          !error && warning && 'mizu-input--warning',
          hasAdornments && 'mizu-input--adorned',
          prefix && 'mizu-input--has-prefix',
          suffix && 'mizu-input--has-suffix',
          className,
        )}
        aria-invalid={resolvedInvalid}
        aria-describedby={resolvedDescribedBy}
        maxLength={maxCharacters}
        onChange={handleChange}
        onFocus={(e) => {
          if (maxCharacters != null) setCharCountLive('polite');
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          if (maxCharacters != null) setCharCountLive('off');
          props.onBlur?.(e);
        }}
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

    const showWarning = typeof warning === 'string' && warning !== '' && !error;
    if (!showWarning && maxCharacters == null) return input;

    return (
      <div className="mizu-form-group">
        {input}
        {showWarning && <span className="mizu-form-group__warning">{warning}</span>}
        {maxCharacters != null ? (
          <span className="mizu-form-group__char-count" aria-live={charCountLive}>
            {charCount}/{maxCharacters}
          </span>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';
