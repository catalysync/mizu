export interface MizuLocale {
  locale: string;

  number: {
    decimal: string;
    thousands: string;
    format: (value: number, decimals?: number) => string;
  };

  currency: {
    code: string;
    symbol: string;
    format: (value: number, decimals?: number) => string;
  };

  date: {
    format: (date: Date) => string;
    formatRelative: (date: Date) => string;
    months: string[];
    monthsShort: string[];
    weekdays: string[];
    weekdaysShort: string[];
  };

  actions: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    close: string;
    confirm: string;
    search: string;
    clear: string;
    retry: string;
  };

  feedback: {
    loading: string;
    empty: string;
    error: string;
    noResults: string;
    selected: (count: number) => string;
  };

  pagination: {
    previous: string;
    next: string;
    page: string;
    of: string;
    showing: (start: number, end: number, total: number) => string;
  };

  table: {
    sortAscending: string;
    sortDescending: string;
    noData: string;
  };

  form: {
    required: string;
    optional: string;
    charactersRemaining: (count: number) => string;
  };
}
