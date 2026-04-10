const defaultFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  if (currency === 'USD' && locale === 'en-US') return defaultFormatter.format(amount);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAccounting(amount: number, currency = 'USD', locale = 'en-US'): string {
  const formatted = formatCurrency(Math.abs(amount), currency, locale);
  return amount < 0 ? `(${formatted})` : formatted;
}
