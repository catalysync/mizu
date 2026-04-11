import '@testing-library/jest-dom/vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';
import type { AxeMatchers } from 'vitest-axe/matchers';

expect.extend(matchers);

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

/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
declare module 'vitest' {
  interface Assertion<T = any> extends AxeMatchers, TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining
    extends AxeMatchers, TestingLibraryMatchers<unknown, void> {}
}
