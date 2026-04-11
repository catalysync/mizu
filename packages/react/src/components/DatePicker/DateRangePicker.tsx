import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';
import { Calendar } from './Calendar';
import {
  formatDisplay,
  formatISO,
  parseISO,
  isBefore,
  startOfDay,
  type Weekday,
} from './calendar-utils';

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface DateRangePickerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange'
> {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange) => void;
  min?: string | null;
  max?: string | null;
  placeholder?: string;
  locale?: string;
  weekStartsOn?: Weekday;
  clearLabel?: string;
  required?: boolean;
}

const EMPTY: DateRange = { start: null, end: null };

export const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = EMPTY,
      onValueChange,
      min,
      max,
      placeholder = 'Select a date range',
      locale = 'en-US',
      weekStartsOn = 0,
      clearLabel = 'Clear',
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
    const [uncontrolled, setUncontrolled] = React.useState<DateRange>(defaultValue ?? EMPTY);
    const range = controlled ? (valueProp ?? EMPTY) : uncontrolled;

    const [open, setOpen] = React.useState(false);
    const [pickingEnd, setPickingEnd] = React.useState(false);

    const start = React.useMemo(() => parseISO(range.start), [range.start]);
    const end = React.useMemo(() => parseISO(range.end), [range.end]);

    const resolvedId = idProp ?? ctx?.controlId;
    const resolvedDisabled = disabled ?? ctx?.disabled ?? false;
    const resolvedRequired = required ?? ctx?.required ?? false;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    const commit = (next: DateRange) => {
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
    };

    const handlePick = (date: Date) => {
      const iso = formatISO(date);
      if (!start || pickingEnd === false) {
        commit({ start: iso, end: null });
        setPickingEnd(true);
        return;
      }
      if (isBefore(startOfDay(date), start)) {
        commit({ start: iso, end: null });
        setPickingEnd(true);
        return;
      }
      commit({ start: range.start, end: iso });
      setPickingEnd(false);
      setOpen(false);
    };

    const display = (() => {
      if (!start) return placeholder;
      if (!end) return `${formatDisplay(start, locale)} — …`;
      return `${formatDisplay(start, locale)} — ${formatDisplay(end, locale)}`;
    })();

    return (
      <div
        className={cn('mizu-date-picker', className)}
        data-component="mizu-date-range-picker"
        data-invalid={resolvedInvalid || undefined}
      >
        <Popover.Root
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setPickingEnd(false);
          }}
        >
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
              <span className="mizu-date-picker__trigger-value" data-empty={!start || undefined}>
                {display}
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
                value={pickingEnd ? end : start}
                rangeStart={start}
                rangeEnd={end}
                onChange={handlePick}
                min={parseISO(min)}
                max={parseISO(max)}
                locale={locale}
                weekStartsOn={weekStartsOn}
                footer={
                  <button
                    type="button"
                    className="mizu-calendar__nav"
                    onClick={() => {
                      commit(EMPTY);
                      setPickingEnd(false);
                      setOpen(false);
                    }}
                  >
                    {clearLabel}
                  </button>
                }
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    );
  },
);
DateRangePicker.displayName = 'DateRangePicker';
