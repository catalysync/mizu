/**
 * Mapped type for "accepts any data-* attribute" pass-through.
 * Useful on component prop types that forward arbitrary data-* attrs onto
 * the rendered element (analytics, testing hooks, etc.) without widening
 * to `Record<string, unknown>`.
 */
export type DataAttributes = {
  [key: `data-${string}`]: string | undefined;
};

/**
 * Template-literal type enforcing http/https URL shape at compile time.
 * Stricter than `string` for props that must be a URL.
 */
export type UrlString = `http://${string}` | `https://${string}`;
