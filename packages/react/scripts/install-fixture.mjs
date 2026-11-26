#!/usr/bin/env node
// Packed-tarball fixture. Packs the four core packages, installs the tarballs into
// a clean consumer directory (the way a user would), then loads every export entry:
//   - .js / .cjs entries: ESM import(), and require() when the entry has a require
//     condition or is CJS
//   - .json entries: require() and ESM import with an import attribute
//   - .css / .ts entries: must resolve to a file in the installed package
// Fails on any load error, a missing entry, or any npm warning during install.
// Run after `pnpm build` in the packages (`pnpm validate` does both).
import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const packages = ['tokens', 'css', 'tailwind-preset', 'react'].map((d) =>
  join(root, 'packages', d),
);

const work = mkdtempSync(join(tmpdir(), 'mizu-fixture-'));
const tarballs = join(work, 'tarballs');
const consumer = join(work, 'consumer');
mkdirSync(tarballs);
mkdirSync(consumer);

const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.error(`FAIL  ${msg}`);
};
const ok = (msg) => console.log(`ok    ${msg}`);

// 1. pack
for (const dir of packages) {
  const dest = mkdtempSync(join(tarballs, 'p-'));
  execFileSync('pnpm', ['pack', '--pack-destination', dest], { cwd: dir, stdio: 'ignore' });
  ok(`packed ${dir.replace(root, '')}`);
}
const tgzs = [];
for (const d of readdirSync(tarballs)) {
  for (const f of readdirSync(join(tarballs, d))) tgzs.push(join(tarballs, d, f));
}

// 2. install into a clean consumer
writeFileSync(
  join(consumer, 'package.json'),
  JSON.stringify({ name: 'fixture', private: true, type: 'commonjs' }),
);
const install = spawnSync(
  'npm',
  ['install', '--prefer-offline', '--no-audit', '--no-fund', ...tgzs],
  { cwd: consumer, encoding: 'utf8' },
);
const installOut = `${install.stdout}${install.stderr}`;
if (install.status !== 0) fail(`npm install exited ${install.status}\n${installOut}`);
else if (/npm warn/i.test(installOut)) fail(`npm install printed warnings\n${installOut}`);
else ok('npm install of packed tarballs (no warnings)');

// 3. load every entry from inside the consumer, so resolution goes through its node_modules
const probe = (code) =>
  spawnSync(process.execPath, ['--input-type=module', '-e', code], {
    cwd: consumer,
    encoding: 'utf8',
  });
const probeCjs = (code) =>
  spawnSync(process.execPath, ['-e', code], { cwd: consumer, encoding: 'utf8' });
const reportProbe = (res, label) => {
  if (res.status === 0) return ok(label);
  fail(
    `${label.split(' ')[0]} failed: ${(res.stderr || res.stdout).trim().split('\n').slice(0, 3).join(' | ')}`,
  );
};
const targetOf = (value) => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return targetOf(value.import ?? value.require ?? value.default ?? value.types);
  }
  return undefined;
};
const hasRequire = (value) => Boolean(value && typeof value === 'object' && 'require' in value);

for (const dir of packages) {
  const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  const pkgDir = join(consumer, 'node_modules', manifest.name);
  for (const [key, value] of Object.entries(manifest.exports ?? {})) {
    const spec = manifest.name + key.slice(1);
    if (key.includes('*')) {
      ok(`skip wildcard ${spec} (checked by its concrete files)`);
      continue;
    }
    const target = targetOf(value);
    if (!target) {
      fail(`${spec} has no resolvable target`);
      continue;
    }
    if (!existsSync(join(pkgDir, target))) {
      fail(`${spec} -> ${target} is not in the installed package`);
      continue;
    }
    if (/\.(css|ts)$/.test(target)) {
      reportProbe(
        probeCjs(`require.resolve(${JSON.stringify(spec)})`),
        `${spec} resolves to ${target}`,
      );
      continue;
    }
    if (target.endsWith('.json')) {
      reportProbe(probeCjs(`require(${JSON.stringify(spec)})`), `${spec} loads as JSON (CJS)`);
      reportProbe(
        probe(`await import(${JSON.stringify(spec)}, { with: { type: 'json' } })`),
        `${spec} loads as JSON (ESM)`,
      );
      continue;
    }
    reportProbe(probe(`await import(${JSON.stringify(spec)})`), `${spec} loads as ESM`);
    if (target.endsWith('.cjs') || hasRequire(value)) {
      reportProbe(probeCjs(`require(${JSON.stringify(spec)})`), `${spec} loads as CJS`);
    }
  }
}

if (failures.length) {
  console.error(`install-fixture: ${failures.length} failure(s)`);
  process.exit(1);
}
console.log('install-fixture: all entries load');
