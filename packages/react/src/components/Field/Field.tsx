import * as React from 'react';
import { cn } from '../../utils/cn';
import { FieldContext, type FieldContextValue } from './field-context';

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  info?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  optionalLabel?: string;
  requiredLabel?: string;
  showOptionalHint?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      className,
      label,
      description,
      errorMessage,
      info,
      required = false,
      disabled = false,
      optionalLabel = 'optional',
      requiredLabel = 'required',
      showOptionalHint = false,
      htmlFor,
      children,
      ...props
    },
    ref,
  ) => {
    const autoId = React.useId();
    const controlId = htmlFor ?? `${autoId}-control`;
    const descriptionId = description ? `${autoId}-description` : undefined;
    const errorId = errorMessage ? `${autoId}-error` : undefined;
    const invalid = errorMessage != null && errorMessage !== false;

    const contextValue = React.useMemo<FieldContextValue>(
      () => ({
        controlId,
        descriptionId,
        errorId,
        required,
        disabled,
        invalid,
      }),
      [controlId, descriptionId, errorId, required, disabled, invalid],
    );

    return (
      <FieldContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('mizu-field', className)}
          data-component="mizu-field"
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
          {...props}
        >
          {label != null ? (
            <div className="mizu-field__label-row">
              <label htmlFor={controlId} className="mizu-field__label">
                {label}
                {required ? (
                  <>
                    <span className="mizu-field__required" aria-hidden="true">
                      *
                    </span>
                    <span className="mizu-field__sr-only">({requiredLabel})</span>
                  </>
                ) : showOptionalHint ? (
                  <span className="mizu-field__optional">({optionalLabel})</span>
                ) : null}
              </label>
              {info != null ? <span className="mizu-field__info">{info}</span> : null}
            </div>
          ) : null}
          {description != null ? (
            <p id={descriptionId} className="mizu-field__info mizu-field__description">
              {description}
            </p>
          ) : null}
          {children}
          {errorMessage != null && errorMessage !== false ? (
            <p id={errorId} className="mizu-field__info mizu-field__error" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </FieldContext.Provider>
    );
  },
);
Field.displayName = 'Field';
