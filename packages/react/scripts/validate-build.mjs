import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

let ok = true;

// Export shape (publint + attw on the packed tarball) replaces the old file-exists check.
const gate = fileURLToPath(new URL('../../../scripts/check-exports.mjs', import.meta.url));
try {
  execFileSync(process.execPath, [gate, fileURLToPath(new URL('..', import.meta.url))], {
    stdio: 'inherit',
  });
} catch {
  ok = false;
}

// A button-only bundle must not contain other components' code.
const treeshake = fileURLToPath(new URL('./check-treeshake.mjs', import.meta.url));
try {
  execFileSync(process.execPath, [treeshake, 'button'], { stdio: 'inherit' });
} catch {
  ok = false;
}

for (const f of readdirSync('dist')
  .filter((n) => /\.c?js$/.test(n))
  .map((n) => `dist/${n}`)) {
  const content = readFileSync(f, 'utf8');
  if (!content.startsWith('"use client"')) {
    console.error(`missing "use client" directive: ${f}`);
    ok = false;
  }
}

const dts = existsSync('dist/index.d.ts') ? readFileSync('dist/index.d.ts', 'utf8') : '';
const required = ['Button', 'Modal', 'Card', 'Table', 'AppLayout', 'Stack'];
for (const name of required) {
  if (!dts.includes(name)) {
    console.error(`missing export in d.ts: ${name}`);
    ok = false;
  }
}

if (ok) {
  console.log('build validation passed');
} else {
  process.exit(1);
}
