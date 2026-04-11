import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

export type TimeFormat = '24h' | '12h';

export interface TimeInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'size'
> {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  format?: TimeFormat;
  withSeconds?: boolean;
  min?: string;
  max?: string;
  step?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  inputClassName?: string;
}

const TIME_RE_24 = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

function normalize(raw: string): string | null {
  const match = TIME_RE_24.exec(raw.trim());
  if (!match) return null;
  const [, hh, mm, ss] = match;
  return ss ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
}

function to12h(time: string | null): { text: string; period: 'AM' | 'PM' } {
  if (!time) return { text: '', period: 'AM' };
  const [hh, mm, ss] = time.split(':');
  const hour = Number(hh);
  const period: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const text = ss
    ? `${String(displayHour).padStart(2, '0')}:${mm}:${ss}`
    : `${String(displayHour).padStart(2, '0')}:${mm}`;
  return { text, period };
}

export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      className,
      inputClassName,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      format = '24h',
      withSeconds = false,
      size = 'md',
      showIcon = true,
      disabled,
      required,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      id: idProp,
      onBlur,
      onChange,
      placeholder,
      ...rest
    },
    ref,
  ) => {
    const ctx = useFieldContext();
    const controlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<string | null>(defaultValue);
    const value = controlled ? (valueProp ?? null) : uncontrolled;

    const resolvedId = idProp ?? ctx?.controlId;
    const resolvedDisabled = disabled ?? ctx?.disabled ?? false;
    const resolvedRequired = required ?? ctx?.required ?? false;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    const display = React.useMemo(() => {
      if (format === '12h') return to12h(value).text;
      return value ?? '';
    }, [value, format]);

    const [text, setText] = React.useState(display);
    React.useEffect(() => {
      setText(display);
    }, [display]);

    const commit = (raw: string) => {
      const normalized = normalize(raw);
      if (!controlled) setUncontrolled(normalized);
      onValueChange?.(normalized);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      commit(text);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
      onChange?.(e);
    };

    const sizeClass = size === 'sm' ? 'mizu-input--sm' : size === 'lg' ? 'mizu-input--lg' : '';

    const period = format === '12h' ? to12h(value).period : null;

    return (
      <div
        className={cn('mizu-time-input', className)}
        data-component="mizu-time-input"
        data-has-icon={showIcon || undefined}
      >
        {showIcon ? (
          <span className="mizu-time-input__icon" aria-hidden="true">
            ⏱
          </span>
        ) : null}
        <input
          {...rest}
          ref={ref}
          id={resolvedId}
          type="text"
          inputMode="numeric"
          placeholder={placeholder ?? (withSeconds ? 'HH:MM:SS' : 'HH:MM')}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          required={resolvedRequired}
          disabled={resolvedDisabled}
          aria-invalid={resolvedInvalid}
          aria-describedby={resolvedDescribedBy}
          className={cn('mizu-input', 'mizu-time-input__input', sizeClass, inputClassName)}
        />
        {period ? (
          <span className="mizu-time-input__suffix" aria-hidden="true">
            {period}
          </span>
        ) : null}
      </div>
    );
  },
);
TimeInput.displayName = 'TimeInput';
