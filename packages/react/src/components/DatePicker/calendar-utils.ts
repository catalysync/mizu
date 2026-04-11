export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

export function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime();
}

export function isWithin(date: Date, min?: Date | null, max?: Date | null): boolean {
  if (min && isBefore(date, startOfDay(min))) return false;
  if (max && isAfter(date, startOfDay(max))) return false;
  return true;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Returns a 6-row × 7-col grid of dates for the month containing `date`.
 * The first row includes trailing days from the previous month so the grid
 * always starts on `weekStartsOn`. Every cell is a Date.
 */
export function buildMonthGrid(date: Date, weekStartsOn: Weekday = 0): Date[][] {
  const monthStart = startOfMonth(date);
  const monthStartWeekday = monthStart.getDay();
  const offset = (monthStartWeekday - weekStartsOn + 7) % 7;
  const gridStart = addDays(monthStart, -offset);

  const rows: Date[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: Date[] = [];
    for (let c = 0; c < 7; c++) {
      row.push(addDays(gridStart, r * 7 + c));
    }
    rows.push(row);
  }
  return rows;
}

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseISO(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = ISO_RE.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(m) - 1 ||
    date.getDate() !== Number(d)
  ) {
    return null;
  }
  return date;
}

export function formatISO(date: Date | null | undefined): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplay(date: Date | null | undefined, locale = 'en-US'): string {
  if (!date) return '';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function weekdayLabels(weekStartsOn: Weekday = 0, locale = 'en-US'): string[] {
  const base = new Date(2024, 5, 2); // Sunday
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(base, i);
    labels.push(d.toLocaleDateString(locale, { weekday: 'narrow' }));
  }
  if (weekStartsOn === 0) return labels;
  return [...labels.slice(weekStartsOn), ...labels.slice(0, weekStartsOn)];
}

export function monthYearLabel(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}
