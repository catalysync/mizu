import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  size?: 'sm' | 'md' | 'lg';
  showToggle?: boolean;
  showToggleLabel?: string;
  hideToggleLabel?: string;
  strength?: PasswordStrength;
  strengthLabel?: (level: PasswordStrength) => string;
  inputClassName?: string;
}

const DEFAULT_STRENGTH_LABELS: Record<PasswordStrength, string> = {
  0: 'No password',
  1: 'Weak',
  2: 'Fair',
  3: 'Strong',
  4: 'Very strong',
};

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      inputClassName,
      size = 'md',
      showToggle = true,
      showToggleLabel = 'Show password',
      hideToggleLabel = 'Hide password',
      strength,
      strengthLabel,
      disabled,
      required,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const ctx = useFieldContext();
    const [visible, setVisible] = React.useState(false);

    const resolvedId = idProp ?? ctx?.controlId;
    const resolvedDisabled = disabled ?? ctx?.disabled ?? false;
    const resolvedRequired = required ?? ctx?.required ?? false;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    const sizeClass = size === 'sm' ? 'mizu-input--sm' : size === 'lg' ? 'mizu-input--lg' : '';

    const strengthText =
      strength != null
        ? (strengthLabel?.(strength) ?? DEFAULT_STRENGTH_LABELS[strength])
        : undefined;

    return (
      <div
        className={cn('mizu-password-input', className)}
        data-component="mizu-password-input"
        data-visible={visible || undefined}
      >
        <input
          {...rest}
          ref={ref}
          id={resolvedId}
          type={visible ? 'text' : 'password'}
          autoComplete={rest.autoComplete ?? 'current-password'}
          required={resolvedRequired}
          disabled={resolvedDisabled}
          aria-invalid={resolvedInvalid}
          aria-describedby={resolvedDescribedBy}
          className={cn('mizu-input', 'mizu-password-input__input', sizeClass, inputClassName)}
        />
        {showToggle ? (
          <button
            type="button"
            className="mizu-password-input__toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? hideToggleLabel : showToggleLabel}
            aria-pressed={visible}
            disabled={resolvedDisabled}
            tabIndex={-1}
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        ) : null}
        {strength != null ? (
          <div
            className="mizu-password-input__strength"
            data-level={strength}
            role="meter"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={strength}
            aria-valuetext={strengthText}
          >
            <span className="mizu-password-input__strength-bar" aria-hidden="true" />
            <span className="mizu-password-input__strength-bar" aria-hidden="true" />
            <span className="mizu-password-input__strength-bar" aria-hidden="true" />
            <span className="mizu-password-input__strength-bar" aria-hidden="true" />
          </div>
        ) : null}
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

export function estimatePasswordStrength(password: string): PasswordStrength {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(4, Math.max(0, score)) as PasswordStrength;
}
