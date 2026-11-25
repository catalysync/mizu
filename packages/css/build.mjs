import { bundle } from 'lightningcss';
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/components', { recursive: true });
mkdirSync('dist/layouts', { recursive: true });
mkdirSync('dist/shell', { recursive: true });
mkdirSync('dist/themes', { recursive: true });

function build(input, output) {
  const { code } = bundle({ filename: input, minify: false });
  writeFileSync(output, code);
}

// Bundled barrel — single import for the whole library
build('src/index.css', 'dist/mizu.css');

// Standalone typography sheet — opt-in via "@mizunagara/css/typography"
build('src/typography.css', 'dist/typography.css');

// Per-file outputs so cherry-pick imports survive future @import chains
for (const subdir of ['components', 'layouts', 'shell', 'themes']) {
  for (const file of readdirSync(join('src', subdir))) {
    if (!file.endsWith('.css')) continue;
    build(join('src', subdir, file), join('dist', subdir, file));
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
