import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import { expect, vi } from 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

// vitest 3 + @testing-library/react auto-cleanup between tests.
// Manual afterEach(cleanup) is flagged by testing-library/no-manual-cleanup.

// --- Centralized jsdom mocks ---
// Radix primitives use ResizeObserver which jsdom lacks
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

// cmdk and other libs call scrollIntoView which jsdom doesn't implement
Element.prototype.scrollIntoView ??= () => {};

// matchMedia is used by useMediaQuery hooks and prefers-reduced-motion checks
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

// scrollTo is used by some overlay positioning logic
window.scrollTo ??= () => {};

// Radix Menu/Select/Slider call pointer-capture APIs that jsdom doesn't
// implement. Without these stubs, interaction tests throw
// "hasPointerCapture is not a function".
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.hasPointerCapture ??= () => false;
  window.HTMLElement.prototype.setPointerCapture ??= () => {};
  window.HTMLElement.prototype.releasePointerCapture ??= () => {};
}

// Radix feature-detects via CSS.supports; jsdom returns undefined which
// some code paths read as "unsupported" and fall back to broken layouts.
vi.stubGlobal('CSS', { supports: () => true });

// jsdom's getComputedStyle returns empty strings for most computed props,
// which breaks Radix collision-detection for Popover/Tooltip (reads line-height).
// Provide a thin passthrough with a sensible line-height default.
const realGetComputedStyle = typeof window !== 'undefined' ? window.getComputedStyle : undefined;
vi.stubGlobal('getComputedStyle', (elt: Element, pseudo?: string | null) => {
  const computed = realGetComputedStyle?.(elt, pseudo ?? null);
  const style = (elt as HTMLElement)?.style;
  return {
    ...(computed as unknown as Record<string, unknown>),
    ...(style as unknown as Record<string, unknown>),
    lineHeight: computed?.lineHeight || '20px',
    getPropertyValue: (prop: string) => {
      if (computed) {
        const value = computed.getPropertyValue(prop);
        if (value) return value;
      }
      if (style && prop in style) {
        return (style as unknown as Record<string, string>)[prop] ?? '';
      }
      return '';
    },
  };
});

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vitest' {
  interface Assertion<T = any> extends AxeMatchers, TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining
    extends AxeMatchers, TestingLibraryMatchers<unknown, void> {}
}
