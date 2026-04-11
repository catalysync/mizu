import { defaultStyles } from '@/config/theme';
import type { ThemeStyleProps } from '@/types/theme';

/**
 * Parse a CSS blob and extract --mizu-* custom properties into a
 * Partial<ThemeStyleProps>. Silently skips keys that aren't part of the
 * tweakmizu schema. Returns a report so the UI can tell the user what
 * was applied vs. ignored.
 */
export function parseMizuCss(css: string): {
  applied: Partial<ThemeStyleProps>;
  unknownKeys: string[];
} {
  const pattern = /--mizu-([a-z0-9][a-z0-9-]*)\s*:\s*([^;]+?)\s*(?:;|$)/gi;
  const validKeys = new Set(Object.keys(defaultStyles));
  const applied: Partial<ThemeStyleProps> = {};
  const unknownKeys: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css)) !== null) {
    const rawKey = match[1];
    const value = match[2].trim();
    if (!value) continue;

    if (validKeys.has(rawKey)) {
      (applied as Record<string, string>)[rawKey] = value;
    } else {
      unknownKeys.push(rawKey);
    }
  }

  return { applied, unknownKeys };
}
