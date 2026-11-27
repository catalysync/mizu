#!/usr/bin/env node
// Export-shape gate. Packs each publishable package (or the directories given)
// and fails on any mismatch between what package.json declares and what the
// tarball resolves to:
//   publint  - the export map and entry points match the files on disk
//   attw     - types resolve correctly under node10, node16 CJS/ESM and bundler
// Build first: the gate checks the packed dist, it does not build.
//   node scripts/check-exports.mjs                 all publishable packages
//   node scripts/check-exports.mjs packages/react  one or more directories
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishable } from './release/packages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

// attw judges JavaScript and type entry points. Entries listed here are data
// (CSS, JSON) or TypeScript sources that Node cannot load, so attw skips them.
// publint still checks that every one of them exists on disk.
const ATTW_EXCLUDE = {
  '@mizunagara/tokens': ['css', 'css/dark', 'json', 'ts', 'rn'],
  '@mizunagara/commerce': ['css'],
  '@mizunagara/finance': ['css', 'themes/*'],
};

function pack(dir, dest) {
  execFileSync('pnpm', ['pack', '--pack-destination', dest], {
    cwd: dir,
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  const tgz = readdirSync(dest).find((f) => f.endsWith('.tgz'));
  if (!tgz) throw new Error(`pnpm pack produced no tarball in ${dir}`);
  return join(dest, tgz);
}

function run(label, cmd, args) {
  const res = spawnSync(cmd, args, { cwd: root, encoding: 'utf8' });
  const out = `${res.stdout ?? ''}${res.stderr ?? ''}`.replace(/\x1b\[[0-9;]*m/g, '');
  return { label, ok: res.status === 0, out };
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2).map((d) => resolve(d))
  : publishable().map(({ dir }) => join(root, dir));

const failures = [];
const tmp = mkdtempSync(join(tmpdir(), 'mizu-check-exports-'));

for (const dir of targets) {
  const name = dir.replace(`${root}`, '');
  let tgz;
  try {
    const dest = mkdtempSync(join(tmp, 'pack-'));
    tgz = pack(dir, dest);
  } catch (err) {
    failures.push(`${name}: pnpm pack failed (${err.message})`);
    continue;
  }
  const { name: pkgName } = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  const exclude = ATTW_EXCLUDE[pkgName] ?? [];
  const attwArgs = ['exec', 'attw', tgz, '--no-emoji'];
  if (exclude.length) attwArgs.push('--exclude-entrypoints', ...exclude);
  const checks = [
    run('publint', 'pnpm', ['exec', 'publint', 'run', tgz, '--level', 'warning', '--strict']),
    run('attw', 'pnpm', attwArgs),
  ];
  for (const c of checks) {
    if (c.ok) {
      console.log(`ok    ${name} ${c.label}`);
    } else {
      console.error(`FAIL  ${name} ${c.label}`);
      console.error(c.out.trimEnd());
      failures.push(`${name} ${c.label}`);
    }
  }
}

if (failures.length) {
  console.error(`check-exports: ${failures.length} failure(s)`);
  process.exit(1);
}
console.log(`check-exports: ${targets.length} package(s) ok`);
