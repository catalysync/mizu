import * as React from 'react';
import { cn } from '../../utils/cn';
import {
  addMonths,
  buildMonthGrid,
  formatISO,
  isSameDay,
  isWithin,
  monthYearLabel,
  startOfDay,
  startOfMonth,
  weekdayLabels,
  type Weekday,
} from './calendar-utils';

export interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  min?: Date | null;
  max?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  weekStartsOn?: Weekday;
  locale?: string;
  className?: string;
  footer?: React.ReactNode;
  dayDisabled?: (date: Date) => boolean;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      rangeStart,
      rangeEnd,
      month: monthProp,
      onMonthChange,
      weekStartsOn = 0,
      locale = 'en-US',
      className,
      footer,
      dayDisabled,
    },
    ref,
  ) => {
    const [internalMonth, setInternalMonth] = React.useState(() =>
      startOfMonth(monthProp ?? value ?? new Date()),
    );
    const month = monthProp ? startOfMonth(monthProp) : internalMonth;

    React.useEffect(() => {
      if (monthProp) setInternalMonth(startOfMonth(monthProp));
    }, [monthProp]);

    const setMonth = (next: Date) => {
      const normalized = startOfMonth(next);
      if (!monthProp) setInternalMonth(normalized);
      onMonthChange?.(normalized);
    };

    const grid = React.useMemo(() => buildMonthGrid(month, weekStartsOn), [month, weekStartsOn]);
    const weekdays = React.useMemo(
      () => weekdayLabels(weekStartsOn, locale),
      [weekStartsOn, locale],
    );

    const today = React.useMemo(() => startOfDay(new Date()), []);

    const isDayDisabled = (date: Date): boolean => {
      if (!isWithin(date, min, max)) return true;
      return !!dayDisabled?.(date);
    };

    const inRange = (date: Date): boolean => {
      if (!rangeStart || !rangeEnd) return false;
      const t = date.getTime();
      return t >= rangeStart.getTime() && t <= rangeEnd.getTime();
    };

    return (
      <div ref={ref} className={cn('mizu-calendar', className)} data-component="mizu-calendar">
        <div className="mizu-calendar__header">
          <button
            type="button"
            className="mizu-calendar__nav"
            aria-label="Previous month"
            onClick={() => setMonth(addMonths(month, -1))}
          >
            ‹
          </button>
          <span className="mizu-calendar__title" aria-live="polite">
            {monthYearLabel(month, locale)}
          </span>
          <button
            type="button"
            className="mizu-calendar__nav"
            aria-label="Next month"
            onClick={() => setMonth(addMonths(month, 1))}
          >
            ›
          </button>
        </div>
        <div className="mizu-calendar__grid" role="grid" aria-label={monthYearLabel(month, locale)}>
          {weekdays.map((w, i) => (
            <span key={`wd-${i}`} className="mizu-calendar__weekday" role="columnheader">
              {w}
            </span>
          ))}
          {grid.flat().map((day) => {
            const outside = day.getMonth() !== month.getMonth();
            const disabled = isDayDisabled(day);
            const selected = isSameDay(day, value ?? null);
            const isToday = isSameDay(day, today);
            const isRangeStart = isSameDay(day, rangeStart ?? null);
            const isRangeEnd = isSameDay(day, rangeEnd ?? null);
            const isInRange = inRange(day) && !isRangeStart && !isRangeEnd;
            return (
              <button
                key={formatISO(day)}
                type="button"
                role="gridcell"
                className="mizu-calendar__day"
                data-outside={outside || undefined}
                data-disabled={disabled || undefined}
                data-selected={selected || isRangeStart || isRangeEnd || undefined}
                data-today={isToday || undefined}
                data-in-range={isInRange || undefined}
                data-range-start={isRangeStart || undefined}
                data-range-end={isRangeEnd || undefined}
                aria-label={day.toLocaleDateString(locale, {
                  dateStyle: 'full',
                })}
                aria-pressed={selected || undefined}
                disabled={disabled}
                onClick={() => onChange?.(day)}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
        {footer ? <div className="mizu-calendar__footer">{footer}</div> : null}
      </div>
    );
  },
);
Calendar.displayName = 'Calendar';
