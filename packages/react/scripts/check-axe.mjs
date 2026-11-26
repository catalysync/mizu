// Fails when a component directory has no axe assertion in any of its tests.
// A directory counts as covered when one of its *.test.ts(x) files calls `axe(` and asserts
// `toHaveNoViolations()`. Run from packages/react: node scripts/check-axe.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/components/', import.meta.url));
const TEST_FILE = /\.test\.tsx?$/;
const AXE_CALL = /\baxe\(/;
const AXE_ASSERT = /toHaveNoViolations\(\)/;

const dirs = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const missing = [];
for (const name of dirs) {
  const dir = join(root, name);
  const tests = readdirSync(dir, { recursive: true })
    .filter((f) => TEST_FILE.test(f))
    .map((f) => join(dir, f));

  const covered = tests.some((file) => {
    const src = readFileSync(file, 'utf8');
    return AXE_CALL.test(src) && AXE_ASSERT.test(src);
  });

  if (!covered) {
    const reason = tests.length === 0 ? 'no test file' : 'no axe assertion';
    missing.push(`${relative(process.cwd(), dir)} (${reason})`);
  }
}

if (missing.length > 0) {
  console.error(
    `check-axe: ${missing.length} component director${missing.length === 1 ? 'y' : 'ies'} without an axe assertion:`,
  );
  for (const line of missing) console.error(`  - ${line}`);
  console.error(
    'Add `expect(await axe(container)).toHaveNoViolations()` (vitest-axe) to a test in each.',
  );
  process.exit(1);
}

console.log(`check-axe: ${dirs.length} component directories, all have an axe assertion.`);
