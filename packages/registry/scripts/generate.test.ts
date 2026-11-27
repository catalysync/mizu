import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildRegistry } from './generate.ts';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const REGISTRY_JSON = fileURLToPath(new URL('../component-registry.json', import.meta.url));
const SCHEMAS_TS = fileURLToPath(new URL('../src/schemas.ts', import.meta.url));
const COMPONENTS_DIR = fileURLToPath(new URL('../../react/src/components', import.meta.url));

test('two builds produce identical output', () => {
  assert.deepEqual(buildRegistry(), buildRegistry());
});

test('output has no absolute paths or timestamps', () => {
  const { json, schemas } = buildRegistry();
  assert.ok(!json.includes(ROOT), 'json contains the checkout path');
  assert.ok(!schemas.includes(ROOT), 'schemas contains the checkout path');
  assert.doesNotMatch(json, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
});

test('Button variants come from MIZU_BUTTON_VARIANTS', () => {
  const { json } = buildRegistry();
  const { components } = JSON.parse(json) as {
    components: {
      name: string;
      variants: Record<string, Record<string, string>> | null;
      story: { status: string } | null;
    }[];
  };
  const button = components.find((c) => c.name === 'Button');
  if (!button) throw new Error('Button is not registered');
  assert.deepEqual(Object.keys(button.variants!.variant), [
    'primary',
    'secondary',
    'ghost',
    'destructive',
    'gradient',
  ]);
  assert.deepEqual(Object.keys(button.variants!.size), ['sm', 'md', 'lg', 'icon']);
  assert.equal(button.variants!.variant.primary, 'mizu-button--primary');
  assert.ok(['stable', 'experimental', 'deprecated'].includes(button.story?.status ?? ''));
});

test('every component folder is registered with its barrel exports', () => {
  const { json } = buildRegistry();
  const { components } = JSON.parse(json) as { components: { name: string; exports: string[] }[] };
  const folders = readdirSync(COMPONENTS_DIR).filter((n) =>
    statSync(`${COMPONENTS_DIR}/${n}`).isDirectory(),
  );
  assert.deepEqual(components.map((c) => c.name).sort(), folders.sort());
  for (const c of components) assert.ok(c.exports.length > 0, `${c.name} has no exports`);
  // DatePicker re-exports its barrel with `export *`; the names must still be listed.
  const datePicker = components.find((c) => c.name === 'DatePicker');
  assert.ok(datePicker?.exports.length, 'DatePicker exports resolved through export *');
});

test('committed component-registry.json matches a fresh build', () => {
  const { json } = buildRegistry();
  assert.deepEqual(JSON.parse(readFileSync(REGISTRY_JSON, 'utf8')), JSON.parse(json));
});

test('committed schemas.ts matches a fresh build', () => {
  const { schemas } = buildRegistry();
  // Prettier rewrites quotes and trailing commas; compare the code without them.
  const norm = (t: string) =>
    t
      .replace(/\s+/g, '')
      .replace(/["']/g, '')
      .replace(/,(?=[\]}])/g, '');
  assert.equal(norm(readFileSync(SCHEMAS_TS, 'utf8')), norm(schemas));
});
