import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', '@aspect/css', '@aspect/tokens'],
  // 'use client' is added by ./scripts/prepend-use-client.mjs as a postbuild step,
  // because esbuild strips directive-style banners.
});
