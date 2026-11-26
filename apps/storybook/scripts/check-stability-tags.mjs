// Checks the Storybook status tags against the stability rule in CLAUDE.md.
//
// Every component story file must declare exactly one of 'stable' | 'experimental'
// | 'deprecated' in its meta tags. A 'stable' component must have a co-located
// React test that runs an axe check and a keyboard or interaction test.
// Whether a component has open plan items is not visible here; that is a
// review decision recorded in the change that sets the tag.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const storybookRoot = resolve(here, '..');
const storiesDir = join(storybookRoot, 'stories');
const componentsDir = resolve(storybookRoot, '../../packages/react/src/components');

const STATUS_TAGS = ['stable', 'experimental', 'deprecated'];
const KEYBOARD_EVIDENCE = /keyDown|keyUp|keyboard\(|\.tab\(|\.type\(/;
const AXE_EVIDENCE = /toHaveNoViolations/;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.name.endsWith('.stories.tsx') || entry.name.endsWith('.stories.ts') ? [path] : [];
  });
}

function metaTags(source) {
  const match = source.match(/tags:\s*\[([^\]]*)\]/);
  if (!match) return null;
  return [...match[1].matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] ?? m[2]);
}

const failures = [];
const rows = [];

for (const file of walk(storiesDir).sort()) {
  const rel = relative(storybookRoot, file);
  const source = readFileSync(file, 'utf8');
  const tags = metaTags(source);
  if (!tags) continue; // no meta tags: not a tagged story file

  const statuses = tags.filter((t) => STATUS_TAGS.includes(t));
  if (statuses.length !== 1) {
    failures.push(`${rel}: expected exactly one status tag, found [${statuses.join(', ')}]`);
    continue;
  }
  const status = statuses[0];
  rows.push(`${status.padEnd(13)} ${rel}`);

  if (status !== 'stable') continue;

  // Component stories are named <Component>.stories.tsx; the test lives beside the component.
  const name = file
    .split('/')
    .pop()
    .replace(/\.stories\.tsx?$/, '');
  const testFile = join(componentsDir, name, `${name}.test.tsx`);
  if (!existsSync(testFile)) {
    failures.push(`${rel}: stable but no component test at ${relative(storybookRoot, testFile)}`);
    continue;
  }
  const testSource = readFileSync(testFile, 'utf8');
  if (!AXE_EVIDENCE.test(testSource)) {
    failures.push(`${rel}: stable but ${name}.test.tsx has no axe check (toHaveNoViolations)`);
  }
  if (!KEYBOARD_EVIDENCE.test(testSource)) {
    failures.push(`${rel}: stable but ${name}.test.tsx has no keyboard test`);
  }
}

for (const row of rows) console.log(row);
console.log(`\n${rows.length} tagged story files checked`);

if (failures.length > 0) {
  console.error(`\nStability tag check failed:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('Stability tag check passed');
