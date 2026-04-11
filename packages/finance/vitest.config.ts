import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['../react/src/test-setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/index.ts',
        'src/**/index.ts',
      ],
      // Baselines captured 2026-04-11: 87.78 / 86.25 / 63.15 / 87.78.
      // Thresholds set ~5 points below baseline to prevent regression.
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 55,
        lines: 80,
      },
    },
  },
});
