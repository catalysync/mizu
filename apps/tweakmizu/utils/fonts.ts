/**
 * Curated set of Google Fonts exposed by tweakmizu's font picker.
 *
 * These are intentionally not all of Google Fonts — the picker is a fixed
 * list of families that are known to pair well with the built-in mizu
 * themes and that can be loaded reliably via a stylesheet link.
 */

export type FontCategory = 'sans' | 'serif' | 'mono';

export interface FontOption {
  /** Google Fonts family name, e.g. "Inter" */
  family: string;
  category: FontCategory;
  /** Comma-separated weights to fetch (kept tight to control payload) */
  weights: string;
}

const SANS: FontOption[] = [
  { family: 'Inter', category: 'sans', weights: '400;500;600;700' },
  { family: 'Geist', category: 'sans', weights: '400;500;600;700' },
  { family: 'DM Sans', category: 'sans', weights: '400;500;600;700' },
  { family: 'Plus Jakarta Sans', category: 'sans', weights: '400;500;600;700' },
  { family: 'IBM Plex Sans', category: 'sans', weights: '400;500;600;700' },
  { family: 'Space Grotesk', category: 'sans', weights: '400;500;600;700' },
  { family: 'Outfit', category: 'sans', weights: '400;500;600;700' },
  { family: 'Manrope', category: 'sans', weights: '400;500;600;700' },
  { family: 'Work Sans', category: 'sans', weights: '400;500;600;700' },
  { family: 'Figtree', category: 'sans', weights: '400;500;600;700' },
  { family: 'Source Sans 3', category: 'sans', weights: '400;500;600;700' },
  { family: 'Nunito', category: 'sans', weights: '400;500;600;700' },
  { family: 'Poppins', category: 'sans', weights: '400;500;600;700' },
  { family: 'Oxanium', category: 'sans', weights: '400;500;600;700' },
];

const SERIF: FontOption[] = [
  { family: 'Source Serif 4', category: 'serif', weights: '400;500;600;700' },
  { family: 'Lora', category: 'serif', weights: '400;500;600;700' },
  { family: 'Merriweather', category: 'serif', weights: '400;700' },
  { family: 'Playfair Display', category: 'serif', weights: '400;500;600;700' },
  { family: 'IBM Plex Serif', category: 'serif', weights: '400;500;600;700' },
  { family: 'EB Garamond', category: 'serif', weights: '400;500;600;700' },
];

const MONO: FontOption[] = [
  { family: 'JetBrains Mono', category: 'mono', weights: '400;500;600;700' },
  { family: 'Fira Code', category: 'mono', weights: '400;500;600;700' },
  { family: 'IBM Plex Mono', category: 'mono', weights: '400;500;600;700' },
  { family: 'Source Code Pro', category: 'mono', weights: '400;500;600;700' },
  { family: 'Geist Mono', category: 'mono', weights: '400;500;600;700' },
  { family: 'Space Mono', category: 'mono', weights: '400;700' },
];

export const FONT_OPTIONS: FontOption[] = [...SANS, ...SERIF, ...MONO];

/** Lookup table for O(1) family → FontOption */
const BY_FAMILY = new Map(FONT_OPTIONS.map((f) => [f.family, f]));

export function findFontOption(family: string): FontOption | undefined {
  return BY_FAMILY.get(family);
}

/**
 * Filter the option list by category (sans/serif/mono).
 */
export function fontOptionsByCategory(category: FontCategory): FontOption[] {
  return FONT_OPTIONS.filter((f) => f.category === category);
}

const DEFAULT_STACK: Record<FontCategory, string> = {
  sans: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
  serif: 'ui-serif, Georgia, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
};

/**
 * Minimal shape for anything we can turn into a CSS font-family value or
 * load as a stylesheet. Lets us accept both curated FontOption entries and
 * dynamic CatalogEntry items from /api/fonts without duplicating helpers.
 */
export interface FontRef {
  family: string;
  category: FontCategory;
  weights?: string;
}

const DEFAULT_WEIGHTS = '400;500;600;700';

/**
 * Build the CSS font-family value for the given font.
 * Quotes the primary family (Google Fonts with spaces need it) and
 * appends a native fallback stack so first-paint never renders blank.
 */
export function buildFontFamily(font: FontRef): string {
  const primary = font.family.includes(' ') ? `"${font.family}"` : font.family;
  return `${primary}, ${DEFAULT_STACK[font.category]}`;
}

/**
 * Parse a theme token value back to a family name. Reads the first segment
 * of the comma-separated list and strips quotes. Returns undefined when the
 * value is empty.
 */
export function parseFontFamilyName(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const first = value
    .split(',')[0]
    ?.trim()
    .replace(/^["']|["']$/g, '');
  return first || undefined;
}

/**
 * Inject a <link rel="stylesheet"> for a Google Font family if one isn't
 * already on the page. Idempotent — safe to call on every selection.
 */
export function loadGoogleFont(font: FontRef): void {
  if (typeof document === 'undefined') return;

  const familyParam = font.family.replace(/ /g, '+');
  const weights = font.weights ?? DEFAULT_WEIGHTS;
  const href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weights}&display=swap`;

  const existing = document.querySelector(
    `link[rel="stylesheet"][data-mizu-font="${font.family}"]`,
  );
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.mizuFont = font.family;
  document.head.appendChild(link);
}

/**
 * Build the single Google Fonts stylesheet URL for all picker options.
 * Used in layout.tsx <head> to preload everything on first paint so the
 * presets render in their intended fonts immediately.
 */
export function buildPreloadFontsHref(): string {
  const families = FONT_OPTIONS.map(
    (f) => `family=${f.family.replace(/ /g, '+')}:wght@${f.weights}`,
  ).join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
