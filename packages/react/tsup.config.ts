import { readdirSync } from 'node:fs';
import { defineConfig } from 'tsup';

// One subpath per component directory, named like the CSS files (Button -> button,
// AlertDialog -> alert-dialog), so @mizunagara/react/button mirrors @mizunagara/css/components/button.
const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const components = readdirSync('src/components', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => [kebab(d.name), `src/components/${d.name}/index.ts`]);

export default defineConfig({
  entry: { index: 'src/index.ts', ...Object.fromEntries(components) },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', '@mizunagara/css', '@mizunagara/tokens'],
  // 'use client' is added by ./scripts/prepend-use-client.mjs as a postbuild step,
  // because esbuild strips directive-style banners.
});
