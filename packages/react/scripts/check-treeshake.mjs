#!/usr/bin/env node
// Tree-shaking gate. Bundles one component's source entry with esbuild, keeping
// react and every other bare package external, and fails if any other component's
// source contributes bytes to the output, or if the minified bundle is over budget.
//   node scripts/check-treeshake.mjs [subpath]        (default: button)
// The subpath is the kebab-case name used by the package exports (button, alert-dialog).
import { readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgDir = fileURLToPath(new URL('../', import.meta.url));
const subpath = process.argv[2] ?? 'button';
const BUDGET_BYTES = 4096; // minified, react, radix and other packages external

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const componentDirs = readdirSync(join(pkgDir, 'src/components'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const own = componentDirs.find((d) => kebab(d) === subpath);
if (!own) {
  console.error(`check-treeshake: no component directory for subpath "${subpath}"`);
  process.exit(2);
}

const requireFromTsup = createRequire(createRequire(join(pkgDir, 'package.json')).resolve('tsup'));
const esbuild = await import(requireFromTsup.resolve('esbuild'));

const result = await esbuild.build({
  entryPoints: [join(pkgDir, 'src/components', own, 'index.ts')],
  bundle: true,
  minify: true,
  format: 'esm',
  write: false,
  metafile: true,
  logLevel: 'silent',
  plugins: [
    {
      name: 'externalize-bare',
      setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
          if (args.path.startsWith('.') || args.path.startsWith('/')) return undefined;
          return { path: args.path, external: true };
        });
      },
    },
  ],
});

// Components whose source contributes bytes to the output.
const used = new Set();
for (const [file, info] of Object.entries(result.metafile.inputs)) {
  if (info.bytesInOutput === 0) continue;
  const m = file.match(/src\/components\/([^/]+)\//);
  if (m) used.add(m[1]);
}
const foreign = [...used].filter((d) => d !== own);
const bytes = result.outputFiles?.[0]?.contents.byteLength ?? 0;

console.log(`check-treeshake: @mizunagara/react/${subpath} (source ${own})`);
console.log(`  component sources in output: ${[...used].join(', ')}`);
console.log(`  minified bundle: ${bytes} bytes (budget ${BUDGET_BYTES})`);

const problems = [];
if (foreign.length) problems.push(`foreign component code in bundle: ${foreign.join(', ')}`);
if (bytes > BUDGET_BYTES) problems.push(`over budget by ${bytes - BUDGET_BYTES} bytes`);
if (problems.length) {
  for (const p of problems) console.error(`FAIL  ${p}`);
  process.exit(1);
}
console.log('check-treeshake: ok');
