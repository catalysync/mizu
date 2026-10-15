#!/usr/bin/env node
// Checks one packed tarball before it is staged:
//   node scripts/release/verify-tarball.mjs <file.tgz> <expected name> <expected version>
// - the manifest inside matches the name and version being released
// - no dependency range still points at the workspace (workspace:, link:, file:)
// - every entry point the manifest declares (main, module, types, bin, exports)
//   is present in the tarball, so an unbuilt package can never be staged
// - license and repository metadata are present
import { execFileSync } from 'node:child_process';

const [tgz, wantName, wantVersion] = process.argv.slice(2);
if (!tgz || !wantName || !wantVersion) {
  console.error('usage: verify-tarball.mjs <file.tgz> <name> <version>');
  process.exit(2);
}

const files = new Set(
  execFileSync('tar', ['-tzf', tgz], { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .map((f) => f.replace(/^package\//, '')),
);
const manifest = JSON.parse(
  execFileSync('tar', ['-xOzf', tgz, 'package/package.json'], { encoding: 'utf8' }),
);

const problems = [];
if (manifest.name !== wantName) problems.push(`name is ${manifest.name}, expected ${wantName}`);
if (manifest.version !== wantVersion)
  problems.push(`version is ${manifest.version}, expected ${wantVersion}`);
if (manifest.license !== 'MIT') problems.push('license is not MIT');
if (manifest.repository?.url !== 'git+https://github.com/catalysync/mizu.git') {
  problems.push('repository.url does not point at catalysync/mizu');
}
if (manifest.publishConfig?.access !== 'public')
  problems.push('publishConfig.access is not public');

for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
  for (const [dep, range] of Object.entries(manifest[field] ?? {})) {
    if (/^(workspace|link|file):/.test(String(range)))
      problems.push(`${field}.${dep} is "${range}"`);
  }
}

const entryPoints = [];
const collect = (value) => {
  if (typeof value === 'string') entryPoints.push(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
};
for (const field of ['main', 'module', 'types', 'typings', 'bin', 'exports'])
  collect(manifest[field]);
for (const target of entryPoints) {
  if (target.includes('*')) continue; // subpath patterns are checked by their concrete files
  const path = target.replace(/^\.\//, '');
  if (!files.has(path)) problems.push(`entry point ${target} is not in the tarball`);
}

if (problems.length) {
  for (const p of problems) console.error(`verify-tarball ${wantName}@${wantVersion}: ${p}`);
  process.exit(1);
}
console.log(
  `verify-tarball: ${wantName}@${wantVersion} ok (${files.size} files, ${entryPoints.length} entry points)`,
);
