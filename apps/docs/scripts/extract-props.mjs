/**
 * Extracts prop interfaces from @aspect/react source files.
 * Outputs JSON files that docs pages can import.
 *
 * Usage: node scripts/extract-props.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const REACT_SRC = '../../packages/react/src/components';
const OUT_DIR = './app/_props';

mkdirSync(OUT_DIR, { recursive: true });

function extractProps(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const props = [];

  // Match JSDoc + property lines in interfaces
  const interfaceRegex = /export interface (\w+Props)[^{]*\{([^}]+)\}/gs;
  let match;

  while ((match = interfaceRegex.exec(content)) !== null) {
    const interfaceName = match[1];
    const body = match[2];

    // Match each prop line
    const propRegex = /(\w+)\??\s*:\s*([^;]+)/g;
    let propMatch;

    while ((propMatch = propRegex.exec(body)) !== null) {
      const name = propMatch[1].trim();
      const type = propMatch[2].trim();

      // Skip internal/inherited stuff
      if (['className', 'children', 'style', 'ref'].includes(name)) continue;

      props.push({ name, type, interface: interfaceName });
    }
  }

  return props;
}

const components = readdirSync(REACT_SRC, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const allProps = {};

for (const component of components) {
  const dir = join(REACT_SRC, component);
  const files = readdirSync(dir).filter(
    (f) => f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('.stories.'),
  );

  for (const file of files) {
    const props = extractProps(join(dir, file));
    if (props.length > 0) {
      const key = basename(file, '.tsx').toLowerCase();
      allProps[key] = props;
    }
  }
}

writeFileSync(join(OUT_DIR, 'props.json'), JSON.stringify(allProps, null, 2));
console.log(`extracted props for ${Object.keys(allProps).length} components`);
