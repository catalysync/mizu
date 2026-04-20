import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';
import { Calendar } from './Calendar';
import { formatDisplay, formatISO, parseISO, type Weekday } from './calendar-utils';

export interface DatePickerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  min?: string | null;
  max?: string | null;
  placeholder?: string;
  locale?: string;
  weekStartsOn?: Weekday;
  clearable?: boolean;
  clearLabel?: string;
  todayLabel?: string;
  required?: boolean;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      min,
      max,
      placeholder = 'Select a date',
      locale = 'en-US',
      weekStartsOn = 0,
      clearable = true,
      clearLabel = 'Clear',
      todayLabel = 'Today',
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
    const controlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState<string | null>(defaultValue);
    const value = controlled ? (valueProp ?? null) : uncontrolled;
    const parsed = React.useMemo(() => parseISO(value), [value]);

    const [open, setOpen] = React.useState(false);

    const resolvedId = idProp ?? ctx?.controlId;
    const resolvedDisabled = disabled ?? ctx?.disabled ?? false;
    const resolvedRequired = required ?? ctx?.required ?? false;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    const commit = (next: Date | null) => {
      const iso = next ? formatISO(next) : null;
      if (!controlled) setUncontrolled(iso);
      onValueChange?.(iso);
    };

    const handlePick = (date: Date) => {
      commit(date);
      setOpen(false);
    };

    return (
      <div
        className={cn('mizu-date-picker', className)}
        data-component="mizu-date-picker"
        data-invalid={resolvedInvalid || undefined}
      >
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              {...rest}
              ref={ref}
              id={resolvedId}
              type="button"
              className="mizu-date-picker__trigger"
              disabled={resolvedDisabled}
              data-required={resolvedRequired || undefined}
              data-invalid={resolvedInvalid || undefined}
              aria-describedby={resolvedDescribedBy}
            >
              <span className="mizu-date-picker__trigger-value" data-empty={!parsed || undefined}>
                {parsed ? formatDisplay(parsed, locale) : placeholder}
              </span>
              <span className="mizu-date-picker__trigger-icon" aria-hidden="true">
                📅
              </span>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="start"
              sideOffset={6}
              className="mizu-popover-content"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Calendar
                value={parsed}
                onChange={handlePick}
                min={parseISO(min)}
                max={parseISO(max)}
                locale={locale}
                weekStartsOn={weekStartsOn}
                footer={
                  <>
                    <button
                      type="button"
                      className="mizu-calendar__nav"
                      onClick={() => handlePick(new Date())}
                    >
                      {todayLabel}
                    </button>
                    {clearable ? (
                      <button
                        type="button"
                        className="mizu-calendar__nav"
                        onClick={() => {
                          commit(null);
                          setOpen(false);
                        }}
                      >
                        {clearLabel}
                      </button>
                    ) : null}
                  </>
                }
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    );
  },
);
DatePicker.displayName = 'DatePicker';
