import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

// Every top-level JS chunk gets the directive, not only the index bundles: once
// the build is split (per-component subpaths), a shared chunk can be imported by
// a client component on its own.
const directive = '"use client";\n';
const targets = readdirSync('dist')
  .filter((f) => /\.c?js$/.test(f))
  .map((f) => `dist/${f}`);

for (const file of targets) {
  const content = readFileSync(file, 'utf8');
  if (content.startsWith('"use client"') || content.startsWith("'use client'")) continue;
  writeFileSync(file, directive + content);
}
