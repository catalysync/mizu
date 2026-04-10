const NON_HTML_PROPS = new Set([
  'asChild',
  'loading',
  'variant',
  'size',
  'tone',
  'dot',
  'interactive',
  'density',
  'stickyHeader',
  'selected',
  'danger',
  'contentType',
  'showArrow',
  'side',
  'ariaLabel',
]);

export function removeNonHTMLProps<T extends Record<string, unknown>>(
  props: T,
  additional: string[] = [],
): Omit<T, string> {
  const result = { ...props };
  for (const key of NON_HTML_PROPS) {
    delete result[key];
  }
  for (const key of additional) {
    delete result[key];
  }
  return result;
}
