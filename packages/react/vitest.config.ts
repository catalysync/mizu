import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/test-setup.ts',
        'src/index.ts',
        'src/**/index.ts',
      ],
      // Baselines captured 2026-04-11: 75.21 / 79.32 / 58.55 / 75.21.
      // Thresholds set ~5 points below baseline to prevent regression.
      // Raise as coverage improves; don't lower without a deliberate decision.
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 50,
        lines: 70,
      },
    },
  },
});
