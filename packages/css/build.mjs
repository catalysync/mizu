import { bundleAsync } from 'lightningcss';
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const require = createRequire(import.meta.url);

// Cascade layers. Sources stay unlayered; the build wraps them so any unlayered consumer CSS
// outranks mizu. The order statement is the first rule in dist/mizu.css so it is defined even
// when a consumer loads a single per-file sheet.
const LAYER_ORDER = 'mizu.tokens, mizu.base, mizu.components, mizu.shell, mizu.identity';
const LAYER_BY_FILE = {
  'z-index.css': 'tokens',
  'density.css': 'tokens',
  'utilities.css': 'base',
  'animation.css': 'base',
  'reduced-motion.css': 'base',
  'typography.css': 'base',
};
const LAYER_BY_DIR = { components: 'components', layouts: 'components', shell: 'shell', themes: 'identity' };

function layerForImport(rel) {
  const parts = rel.replace(/^\.\//, '').split('/');
  if (parts.length === 1) return LAYER_BY_FILE[parts[0]] ?? 'base';
  return LAYER_BY_DIR[parts[0]];
}

function wrapLayer(code, layer) {
  // @charset must stay the first thing in the file, so it is hoisted above the layer block.
  const charset = code.match(/^@charset[^;]*;\s*/)?.[0] ?? '';
  // Every per-file sheet restates the order, so loading sheets one by one (in any order) cannot
  // reorder the layers by first appearance.
  return `${charset}@layer ${LAYER_ORDER};\n@layer mizu.${layer} {\n${code.slice(charset.length)}\n}\n`;
}

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/components', { recursive: true });
mkdirSync('dist/layouts', { recursive: true });
mkdirSync('dist/shell', { recursive: true });
mkdirSync('dist/themes', { recursive: true });

async function build(input, output, layer) {
  const code = (await bundleAsync({ filename: input, minify: false })).code.toString();
  writeFileSync(output, layer ? wrapLayer(code, layer) : code);
}

// Barrel: each @import gets a layer() condition, so bundling emits one @layer block per file.
// The layered text is served from memory; the source index.css is not modified.
const barrelSource = readFileSync('src/index.css', 'utf8');
const barrelEntry = resolve('src/index.css');
const barrelLayered =
  barrelSource.replace(
    /@import url\("(\.\/[^"]+)"\);/g,
    (_, rel) => `@import url("${rel}") layer(mizu.${layerForImport(rel)});`,
  );
{
  // bundleAsync is required for a custom resolver; the sync bundle() ignores it.
  const { code } = await bundleAsync({
    filename: barrelEntry,
    minify: false,
    resolver: {
      read: (file) => (file === barrelEntry ? barrelLayered : readFileSync(file, 'utf8')),
    },
  });
  // The native binding returns a Buffer. lightningcss does not keep the order statement from
  // the entry, so it is written back explicitly; the bundle's own layer blocks follow it.
  const bundled = code.toString();
  const css = bundled.includes('@layer mizu.tokens,') ? bundled : `@layer ${LAYER_ORDER};\n${bundled}`;
  if (css.includes('@import')) throw new Error('build-css: dist/mizu.css still has an @import');
  writeFileSync('dist/mizu.css', css);
}

// Standalone typography sheet — opt-in via "@mizunagara/css/typography"
await build('src/typography.css', 'dist/typography.css', 'base');

// Per-file outputs so cherry-pick imports survive future @import chains
for (const subdir of ['components', 'layouts', 'shell', 'themes']) {
  for (const file of readdirSync(join('src', subdir))) {
    if (!file.endsWith('.css')) continue;
    await build(join('src', subdir, file), join('dist', subdir, file), LAYER_BY_DIR[subdir]);
  }
}

// Unresolved-token gate. A var(--mizu-*) with no definition in the built CSS or the
// tokens output renders as nothing, so it must carry an explicit fallback in var().
// The references that have a fallback today (layout gaps, app-layout width) are the
// documented fallback set and pass; a bare reference to a removed token fails the build.
function cssFiles(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return cssFiles(p);
    return p.endsWith('.css') ? [p] : [];
  });
}

function checkTokens() {
  const sources = [...cssFiles('dist'), require.resolve('@mizunagara/tokens/css')];
  const defined = new Set();
  const bare = [];
  const refPattern = /var\(\s*(--mizu-[\w-]+)\s*([,)])/g;
  for (const file of sources) {
    const css = readFileSync(file, 'utf8');
    for (const m of css.matchAll(/(--mizu-[\w-]+)\s*:/g)) defined.add(m[1]);
    for (const m of css.matchAll(refPattern)) {
      if (m[2] === ',') continue;
      if (!bare.some((r) => r.name === m[1] && r.file === file)) bare.push({ name: m[1], file });
    }
  }
  const missing = bare.filter((r) => !defined.has(r.name));
  if (missing.length) {
    for (const r of missing) console.error(`unresolved token ${r.name} (no definition, no fallback) in ${r.file}`);
    throw new Error(`build-css: ${missing.length} unresolved token reference(s)`);
  }
}

checkTokens();
console.log('built @mizunagara/css');
