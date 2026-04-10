import type { MizuLocale } from '../locale';

const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

function relativeTime(date: Date): string {
  const diff = date.getTime() - Date.now();
  const days = Math.round(diff / 86_400_000);
  if (Math.abs(days) >= 30) {
    return rtf.format(Math.round(days / 30), 'month');
  }
  if (Math.abs(days) >= 1) {
    return rtf.format(days, 'day');
  }
  const hours = Math.round(diff / 3_600_000);
  if (Math.abs(hours) >= 1) {
    return rtf.format(hours, 'hour');
  }
  return rtf.format(Math.round(diff / 60_000), 'minute');
}

export const enUS: MizuLocale = {
  locale: 'en-US',

  number: {
    decimal: '.',
    thousands: ',',
    format: (value, decimals = 2) =>
      new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value),
  },

  currency: {
    code: 'USD',
    symbol: '$',
    format: (value, decimals = 2) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value),
  },

  date: {
    format: (date) => new Intl.DateTimeFormat('en-US').format(date),
    formatRelative: relativeTime,
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthsShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },

  actions: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    close: 'Close',
    confirm: 'Confirm',
    search: 'Search',
    clear: 'Clear',
    retry: 'Retry',
  },

  feedback: {
    loading: 'Loading…',
    empty: 'No items',
    error: 'Something went wrong',
    noResults: 'No results found',
    selected: (count) => (count === 1 ? '1 item selected' : `${count} items selected`),
  },

  pagination: {
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    showing: (start, end, total) => `Showing ${start}–${end} of ${total}`,
  },

  table: {
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    noData: 'No data available',
  },

  form: {
    required: 'Required',
    optional: 'Optional',
    charactersRemaining: (count) =>
      count === 1 ? '1 character remaining' : `${count} characters remaining`,
  },
};
