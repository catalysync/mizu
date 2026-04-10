import { readFileSync, existsSync } from 'node:fs';

const files = ['dist/index.js', 'dist/index.cjs', 'dist/index.d.ts', 'dist/index.d.cts'];
let ok = true;

for (const f of files) {
  if (!existsSync(f)) {
    console.error(`missing: ${f}`);
    ok = false;
  }
}

for (const f of ['dist/index.js', 'dist/index.cjs']) {
  if (!existsSync(f)) continue;
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
