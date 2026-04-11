import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'value' | 'defaultValue' | 'onChange' | 'prefix'
> {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  hideSteppers?: boolean;
  align?: 'start' | 'end';
  size?: 'sm' | 'md' | 'lg';
  inputClassName?: string;
  incrementLabel?: string;
  decrementLabel?: string;
}

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (typeof min === 'number' && next < min) next = min;
  if (typeof max === 'number' && next > max) next = max;
  return next;
}

function round(value: number, precision?: number) {
  if (precision == null) return value;
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      inputClassName,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      min,
      max,
      step = 1,
      precision,
      prefix,
      suffix,
      hideSteppers = false,
      align = 'start',
      size = 'md',
      disabled,
      required,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      incrementLabel = 'Increment',
      decrementLabel = 'Decrement',
      id: idProp,
      onChange,
      onBlur,
      ...rest
    },
    forwardedRef,
  ) => {
    const ctx = useFieldContext();
    const controlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<number | null>(defaultValue);
    const value = controlled ? (valueProp ?? null) : uncontrolled;

    const [text, setText] = React.useState<string>(() => (value == null ? '' : String(value)));

    React.useEffect(() => {
      if (!controlled) return;
      setText(value == null ? '' : String(value));
    }, [controlled, value]);

    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLInputElement);

    const resolvedId = idProp ?? ctx?.controlId;
    const resolvedDisabled = disabled ?? ctx?.disabled ?? false;
    const resolvedRequired = required ?? ctx?.required ?? false;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    const commit = (next: number | null) => {
      const clamped = next == null ? null : round(clamp(next, min, max), precision);
      if (!controlled) setUncontrolled(clamped);
      onValueChange?.(clamped);
      return clamped;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setText(raw);
      onChange?.(e);

      if (raw === '' || raw === '-') {
        commit(null);
        return;
      }
      const parsed = Number(raw);
      if (Number.isNaN(parsed)) return;
      commit(parsed);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      if (text === '' || text === '-') {
        setText('');
        return;
      }
      const parsed = Number(text);
      if (Number.isNaN(parsed)) {
        setText(value == null ? '' : String(value));
        return;
      }
      const committed = commit(parsed);
      setText(committed == null ? '' : String(committed));
    };

    const adjust = (delta: number) => {
      const base = value ?? 0;
      const next = commit(base + delta);
      setText(next == null ? '' : String(next));
      innerRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      rest.onKeyDown?.(e);
      if (resolvedDisabled) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        adjust(e.shiftKey ? step * 10 : step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        adjust(e.shiftKey ? -step * 10 : -step);
      }
    };

    const atMin = typeof min === 'number' && value != null && value <= min;
    const atMax = typeof max === 'number' && value != null && value >= max;

    const sizeClass = size === 'sm' ? 'mizu-input--sm' : size === 'lg' ? 'mizu-input--lg' : '';

    return (
      <div
        className={cn('mizu-number-input', className)}
        data-component="mizu-number-input"
        data-align={align}
        data-has-prefix={prefix != null || undefined}
        data-has-suffix={suffix != null || undefined}
        data-hide-steppers={hideSteppers || undefined}
      >
        {prefix != null ? (
          <span className="mizu-number-input__prefix" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          {...rest}
          ref={innerRef}
          id={resolvedId}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={value ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={resolvedInvalid}
          aria-describedby={resolvedDescribedBy}
          required={resolvedRequired}
          disabled={resolvedDisabled}
          value={text}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn('mizu-input', 'mizu-number-input__input', sizeClass, inputClassName)}
        />
        {suffix != null ? (
          <span className="mizu-number-input__suffix" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
        {!hideSteppers ? (
          <span className="mizu-number-input__steppers">
            <button
              type="button"
              className="mizu-number-input__stepper"
              aria-label={incrementLabel}
              tabIndex={-1}
              disabled={resolvedDisabled || atMax}
              onClick={() => adjust(step)}
            >
              ▲
            </button>
            <button
              type="button"
              className="mizu-number-input__stepper"
              aria-label={decrementLabel}
              tabIndex={-1}
              disabled={resolvedDisabled || atMin}
              onClick={() => adjust(-step)}
            >
              ▼
            </button>
          </span>
        ) : null}
      </div>
    );
  },
);
NumberInput.displayName = 'NumberInput';
