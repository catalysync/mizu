import { defineConfig } from 'vitest/config';

// Browser tests launch Chromium, which can take several seconds on a loaded machine.
export default defineConfig({
  test: {
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
