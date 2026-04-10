import { ThemeStyleProps } from '@/types/theme';

/**
 * Apply mizu theme styles to an HTML element by setting
 * --mizu-* CSS custom properties directly on the element.
 */
export function applyThemeToElement(element: HTMLElement, styles: ThemeStyleProps) {
  for (const [key, value] of Object.entries(styles)) {
    if (value === undefined) continue;
    element.style.setProperty(`--mizu-${key}`, value);
  }
}

/**
 * Remove all --mizu-* inline styles from an element.
 */
export function clearThemeFromElement(element: HTMLElement) {
  const style = element.getAttribute('style') || '';
  const cleaned = style
    .split(';')
    .filter((s) => !s.trim().startsWith('--mizu-'))
    .join(';');
  element.setAttribute('style', cleaned);
}
