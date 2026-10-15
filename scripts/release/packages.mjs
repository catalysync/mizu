#!/usr/bin/env node
// Lists the publishable @mizunagara/* workspace packages in dependency order
// (tokens before css before react before the packs), one per line:
//   <name>\t<version>\t<dir relative to the repo root>
//
//   node scripts/release/packages.mjs            list
//   node scripts/release/packages.mjs --check    also fail when an internal peer
//                                                range is not met by the version
//                                                being released
//
// Used by stage-publish.sh (CI) and approve.sh (owner) so both sides agree on
// the set and the order.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SCOPE = '@mizunagara/';
const root = fileURLToPath(new URL('../../', import.meta.url));

function readWorkspace() {
  const pkgs = [];
  for (const group of ['packages', 'apps']) {
    for (const entry of readdirSync(join(root, group), { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = join(root, group, entry.name);
      let manifest;
      try {
        manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
      } catch {
        continue;
      }
      pkgs.push({ dir: relative(root, dir), manifest });
    }
  }
  return pkgs;
}

export function publishable() {
  const all = readWorkspace();
  const pkgs = all.filter(
    ({ manifest }) => manifest.name?.startsWith(SCOPE) && manifest.private !== true,
  );
  const names = new Set(pkgs.map((p) => p.manifest.name));
  const internalDeps = (m) =>
    Object.keys({ ...m.dependencies, ...m.peerDependencies, ...m.devDependencies }).filter((d) =>
      names.has(d),
    );

  // Kahn's algorithm, ties broken by name so the order is stable.
  const remaining = new Map(pkgs.map((p) => [p.manifest.name, p]));
  const ordered = [];
  while (remaining.size) {
    const ready = [...remaining.values()]
      .filter((p) => internalDeps(p.manifest).every((d) => !remaining.has(d)))
      .sort((a, b) => a.manifest.name.localeCompare(b.manifest.name));
    if (!ready.length) throw new Error(`dependency cycle among ${[...remaining.keys()].join(', ')}`);
    for (const p of ready) {
      ordered.push(p);
      remaining.delete(p.manifest.name);
    }
  }
  return ordered;
}

// Minimal range check for the forms this repo uses (>=x.y.z, ^x.y.z, exact).
function cmp(a, b) {
  const pa = a.split('-')[0].split('.').map(Number);
  const pb = b.split('-')[0].split('.').map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
}
export function satisfies(version, range) {
  if (version.includes('-')) return false; // prereleases never match a plain range
  return range.split(/\s+/).every((part) => {
    let m;
    if ((m = part.match(/^>=(\d+\.\d+\.\d+)$/))) return cmp(version, m[1]) >= 0;
    if ((m = part.match(/^<(\d+\.\d+\.\d+)$/))) return cmp(version, m[1]) < 0;
    if ((m = part.match(/^\^(\d+)\.(\d+)\.(\d+)$/))) {
      const [maj, min] = [Number(m[1]), Number(m[2])];
      const [vmaj, vmin] = version.split('.').map(Number);
      if (cmp(version, `${m[1]}.${m[2]}.${m[3]}`) < 0) return false;
      return maj > 0 ? vmaj === maj : vmaj === 0 && vmin === min;
    }
    if (/^\d+\.\d+\.\d+$/.test(part)) return cmp(version, part) === 0;
    throw new Error(`unsupported range "${range}"`);
  });
}

export function peerProblems(pkgs) {
  const versions = new Map(pkgs.map((p) => [p.manifest.name, p.manifest.version]));
  const problems = [];
  for (const { manifest } of pkgs) {
    for (const [dep, range] of Object.entries(manifest.peerDependencies ?? {})) {
      if (!versions.has(dep)) continue;
      if (!satisfies(versions.get(dep), range)) {
        problems.push(`${manifest.name} peers on ${dep}@${range}, but ${dep} is ${versions.get(dep)}`);
      }
    }
    for (const field of ['dependencies', 'peerDependencies']) {
      for (const [dep, range] of Object.entries(manifest[field] ?? {})) {
        if (/^(workspace|link|file):/.test(range) && field === 'peerDependencies') {
          problems.push(`${manifest.name} ${field}.${dep} is "${range}", which npm cannot resolve`);
        }
      }
    }
  }
  return problems;
}

// Changesets that bump at least one publishable package. Changesets naming only
// ignored packages (the apps) are never consumed by `changeset version`, so
// they must not hold a release back.
export function pendingChangesets(pkgs) {
  const names = new Set(pkgs.map((p) => p.manifest.name));
  const dir = join(root, '.changeset');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .filter((f) => {
      const front = readFileSync(join(dir, f), 'utf8').split(/^---\s*$/m)[1] ?? '';
      return [...front.matchAll(/^\s*['"]?([^'":\s]+)['"]?\s*:/gm)].some((m) => names.has(m[1]));
    });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const pkgs = publishable();
  if (process.argv.includes('--pending')) {
    for (const f of pendingChangesets(pkgs)) console.log(f);
    process.exit(0);
  }
  if (process.argv.includes('--check')) {
    const problems = peerProblems(pkgs);
    if (problems.length) {
      for (const p of problems) console.error(`peer check: ${p}`);
      process.exit(1);
    }
  }
  for (const { manifest, dir } of pkgs) console.log(`${manifest.name}\t${manifest.version}\t${dir}`);
}
