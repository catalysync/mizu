import { readFileSync, writeFileSync } from 'node:fs';

const directive = '"use client";\n';
for (const file of ['dist/index.js', 'dist/index.cjs']) {
  const content = readFileSync(file, 'utf8');
  if (content.startsWith('"use client"') || content.startsWith("'use client'")) continue;
  writeFileSync(file, directive + content);
}
