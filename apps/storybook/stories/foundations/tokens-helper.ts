import tokens from '@aspect/tokens/json';

export type TokenValue = string | number;
export type TokenEntry = {
  /** PascalCase token name as exported from @aspect/tokens. */
  name: string;
  /** CSS custom-property name with the mizu-* prefix. */
  cssVar: string;
  /** Resolved value for the default theme. */
  value: string;
};

/**
 * Convert a PascalCase token export name to its CSS custom-property name.
 *   Spacing1            → --mizu-spacing-1
 *   Radius2xl           → --mizu-radius-2xl
 *   ActionPrimaryHover  → --mizu-action-primary-hover
 *   FontLineHeightTight → --mizu-font-line-height-tight
 */
export function toCssVar(name: string): string {
  return (
    '--mizu-' +
    name
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([a-zA-Z])(\d)/g, '$1-$2')
      .toLowerCase()
  );
}

/**
 * Strip a known prefix off a token name and lowercase the remainder.
 *   labelFromPrefix('Spacing1', 'Spacing')              → '1'
 *   labelFromPrefix('RadiusSm', 'Radius')               → 'sm'
 *   labelFromPrefix('FontLineHeightTight', 'FontLineHeight') → 'tight'
 *   labelFromPrefix('FontSize2xl', 'FontSize')          → '2xl'
 */
export function labelFromPrefix(name: string, prefix: string): string {
  const stripped = name.slice(prefix.length);
  return stripped ? stripped.toLowerCase() : name.toLowerCase();
}

/**
 * Filter the full tokens export down to entries whose name matches a
 * string prefix or regex pattern. Preserves the definition order from
 * `@aspect/tokens/json`, so ordered scales (Spacing0, Spacing1, ...) stay
 * in source order.
 */
export function tokensByPrefix(pattern: string | RegExp): TokenEntry[] {
  const matches =
    typeof pattern === 'string'
      ? (k: string) => k.startsWith(pattern)
      : (k: string) => pattern.test(k);
  return Object.entries(tokens as Record<string, TokenValue>)
    .filter(([k]) => matches(k))
    .map(([k, v]) => ({
      name: k,
      cssVar: toCssVar(k),
      value: String(v),
    }));
}
