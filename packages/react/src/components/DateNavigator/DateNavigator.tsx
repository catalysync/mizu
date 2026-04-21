import * as React from 'react';
import { ChevronRight } from '../../icons';
import { cn } from '../../utils/cn';

export type DateNavigatorPresetKey =
  | 'today'
  | 'yesterday'
  | 'this-week'
  | 'last-7'
  | 'this-month'
  | 'last-30'
  | 'this-quarter'
  | 'last-90'
  | 'this-year'
  | 'year-to-date';

export interface DateNavigatorPreset {
  key: DateNavigatorPresetKey | string;
  label: React.ReactNode;
  /** Compute the range when this preset fires. `now` is "today at 00:00:00". */
  compute: (now: Date) => { start: Date; end: Date };
}

export interface DateNavigatorValue {
  start: Date;
  end: Date;
  /** Preset key when the current range matches a preset; `undefined` when custom. */
  preset?: string;
}

export interface DateNavigatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: DateNavigatorValue;
  onChange: (next: DateNavigatorValue) => void;
  /** Preset chips rendered before the prev/next arrows. Defaults to the built-in list. */
  presets?: DateNavigatorPreset[];
  /** Hide the prev/next arrows. Useful when the preset drives the range on its own. */
  hideArrows?: boolean;
  /** Render a custom summary between the arrows. Defaults to a localized range string. */
  renderLabel?: (value: DateNavigatorValue) => React.ReactNode;
  /** Locale for the default label formatter. Defaults to `'en-US'`. */
  locale?: string;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const diff = d.getDay() === 0 ? 6 : d.getDay() - 1; // Monday as week start
  d.setDate(d.getDate() - diff);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfQuarter(date: Date): Date {
  const q = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), q * 3, 1);
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export const DEFAULT_PRESETS: DateNavigatorPreset[] = [
  {
    key: 'today',
    label: 'Today',
    compute: (now) => ({ start: startOfDay(now), end: startOfDay(now) }),
  },
  {
    key: 'yesterday',
    label: 'Yesterday',
    compute: (now) => {
      const d = addDays(startOfDay(now), -1);
      return { start: d, end: d };
    },
  },
  {
    key: 'last-7',
    label: 'Last 7 days',
    compute: (now) => ({ start: addDays(startOfDay(now), -6), end: startOfDay(now) }),
  },
  {
    key: 'last-30',
    label: 'Last 30 days',
    compute: (now) => ({ start: addDays(startOfDay(now), -29), end: startOfDay(now) }),
  },
  {
    key: 'this-week',
    label: 'This week',
    compute: (now) => ({ start: startOfWeek(now), end: startOfDay(now) }),
  },
  {
    key: 'this-month',
    label: 'This month',
    compute: (now) => ({ start: startOfMonth(now), end: startOfDay(now) }),
  },
  {
    key: 'this-quarter',
    label: 'This quarter',
    compute: (now) => ({ start: startOfQuarter(now), end: startOfDay(now) }),
  },
  {
    key: 'year-to-date',
    label: 'Year to date',
    compute: (now) => ({ start: startOfYear(now), end: startOfDay(now) }),
  },
];

function defaultLabel(value: DateNavigatorValue, locale: string): string {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  if (value.start.getTime() === value.end.getTime()) return fmt.format(value.start);
  return `${fmt.format(value.start)} – ${fmt.format(value.end)}`;
}

function stepRange(value: DateNavigatorValue, direction: -1 | 1): DateNavigatorValue {
  const days = Math.max(
    1,
    Math.round((value.end.getTime() - value.start.getTime()) / 86400000) + 1,
  );
  return {
    start: addDays(value.start, days * direction),
    end: addDays(value.end, days * direction),
    preset: undefined,
  };
}

/**
 * DateNavigator — preset chips + prev/next arrows + current-range label.
 *
 * Typical placement: dashboard header. Consumers own the filter state (start/end
 * + preset key) and re-fetch data when `onChange` fires.
 */
export const DateNavigator = React.forwardRef<HTMLDivElement, DateNavigatorProps>(
  (
    {
      value,
      onChange,
      presets = DEFAULT_PRESETS,
      hideArrows,
      renderLabel,
      locale = 'en-US',
      className,
      ...props
    },
    ref,
  ) => {
    const selectPreset = (preset: DateNavigatorPreset) => {
      const { start, end } = preset.compute(new Date());
      onChange({ start, end, preset: preset.key });
    };

    const label =
      typeof renderLabel === 'function' ? renderLabel(value) : defaultLabel(value, locale);

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Date range"
        className={cn('mizu-date-navigator', className)}
        data-component="mizu-date-navigator"
        {...props}
      >
        <div className="mizu-date-navigator__presets" role="radiogroup" aria-label="Range presets">
          {presets.map((preset) => {
            const selected = value.preset === preset.key;
            return (
              <button
                key={preset.key}
                type="button"
                role="radio"
                aria-checked={selected}
                data-selected={selected || undefined}
                className="mizu-date-navigator__preset"
                onClick={() => selectPreset(preset)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        {!hideArrows ? (
          <div className="mizu-date-navigator__stepper">
            <button
              type="button"
              className="mizu-date-navigator__arrow"
              aria-label="Previous range"
              onClick={() => onChange(stepRange(value, -1))}
            >
              <ChevronRight aria-hidden="true" style={{ transform: 'rotate(180deg)' }} />
            </button>
            <span className="mizu-date-navigator__label" aria-live="polite">
              {label}
            </span>
            <button
              type="button"
              className="mizu-date-navigator__arrow"
              aria-label="Next range"
              onClick={() => onChange(stepRange(value, 1))}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    );
  },
);
DateNavigator.displayName = 'DateNavigator';
