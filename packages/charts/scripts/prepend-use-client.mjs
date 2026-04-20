import { readFileSync, writeFileSync } from 'node:fs';

const directive = '"use client";\n';
const targets = ['dist/index.js', 'dist/index.cjs'];

for (const file of targets) {
  const content = readFileSync(file, 'utf8');
  if (content.startsWith('"use client"') || content.startsWith("'use client'")) continue;
  writeFileSync(file, directive + content);
}
