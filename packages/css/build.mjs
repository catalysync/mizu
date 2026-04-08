import { bundle } from 'lightningcss';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/components', { recursive: true });
mkdirSync('dist/layouts', { recursive: true });

function build(input, output) {
  const { code } = bundle({ filename: input, minify: false });
  writeFileSync(output, code);
}

// Bundled barrel — single import for the whole library
build('src/index.css', 'dist/mizu.css');

// Per-file outputs so cherry-pick imports survive future @import chains
for (const subdir of ['components', 'layouts']) {
  for (const file of readdirSync(join('src', subdir))) {
    if (!file.endsWith('.css')) continue;
    build(join('src', subdir, file), join('dist', subdir, file));
  }
}

console.log('built @aspect/css');
