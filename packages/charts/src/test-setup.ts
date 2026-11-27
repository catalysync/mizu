import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vitest' {
  interface Assertion<T = any> extends AxeMatchers, TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining
    extends AxeMatchers, TestingLibraryMatchers<unknown, void> {}
}
