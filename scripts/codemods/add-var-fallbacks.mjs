#!/usr/bin/env node
// Adds a neutral fallback to every bare `var(--mizu-*)` used as a colour (colour, background,
// border, outline, shadow, …). The fallback is the token's light value, resolved to a literal
// from the built token sheet, so a missing token still renders the default theme.
//
//   node scripts/codemods/add-var-fallbacks.mjs           # rewrite files in place
//   node scripts/codemods/add-var-fallbacks.mjs --check   # exit 1 if anything would change
//
// Only adds fallbacks. Existing `var(--x, …)` calls and every other value are left alone.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = fileURLToPath(new URL('../../', import.meta.url));

export const DEFAULT_DIRS = ['components', 'layouts', 'shell'].map((d) =>
  join(repo, 'packages/css/src', d),
);
export const TOKEN_SHEET = join(repo, 'packages/tokens/dist/css/variables.css');

export const COLOUR_PROPS = new Set([
  'color',
  'background',
  'background-color',
  'background-image',
  'border',
  'border-color',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-block',
  'border-inline',
  'border-block-color',
  'border-inline-color',
  'outline',
  'outline-color',
  'box-shadow',
  'text-shadow',
  'text-decoration',
  'text-decoration-color',
  'fill',
  'stroke',
  'caret-color',
  'accent-color',
  'column-rule',
  'column-rule-color',
  'scrollbar-color',
  '-webkit-text-fill-color',
]);

const BARE_VAR = /var\(\s*(--mizu-[a-z0-9-]+)\s*\)/g;
const COLOUR_LITERAL =
  /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\(|\btransparent\b|\bcurrentcolor\b/i;

/** `--mizu-*` → light value, read from the `:root` blocks of the built token sheet. */
export function lightTokens(tokenCss) {
  const map = {};
  for (const block of tokenCss.matchAll(/:root\s*\{([^{}]*)\}/g)) {
    for (const m of block[1].matchAll(/(--mizu-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
      map[m[1]] = m[2].trim();
    }
  }
  return map;
}

/** Resolve a token's light value to a literal by following bare `var()` chains. */
export function resolveLiteral(map, name, depth = 0) {
  const value = map[name];
  if (value === undefined) throw new Error(`${name} has no light value in the token sheet`);
  if (depth > 20) throw new Error(`${name}: reference cycle`);
  return lightBranch(value.replace(BARE_VAR, (_, ref) => resolveLiteral(map, ref, depth + 1)));
}

/** `light-dark(a, b)` → `a`, splitting on the top-level comma; other values pass through. */
export function lightBranch(value) {
  const m = /^light-dark\((.*)\)$/s.exec(value.trim());
  if (!m) return value;
  let depth = 0;
  for (let i = 0; i < m[1].length; i++) {
    const c = m[1][i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ',' && depth === 0) return lightBranch(m[1].slice(0, i).trim());
  }
  throw new Error(`malformed light-dark(): ${value}`);
}

/**
 * Writes a literal in the notation the stylelint config expects (`#fff`, `rgb(0 0 0 / 5%)`).
 * Same colour, different spelling; the token value itself is never edited.
 */
export function canonicalLiteral(literal) {
  return literal
    .replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3(?![0-9a-f])/gi, '#$1$2$3')
    .replace(
      /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+%?)\s*)?\)/g,
      (_, r, g, b, a) => {
        if (a === undefined) return `rgb(${r} ${g} ${b})`;
        const alpha = a.endsWith('%') ? a : `${+(Number(a) * 100).toFixed(4)}%`;
        return `rgb(${r} ${g} ${b} / ${alpha})`;
      },
    );
}

/** Replace comments with spaces so offsets in the masked copy match the original text. */
function maskComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
}

/**
 * Finds bare `var(--mizu-*)` calls in colour properties.
 * Returns `{ at, name, prop, literal }` for each one that needs a fallback, where `at` is the
 * index of the closing parenthesis. Colour properties whose token is unknown go in `unresolved`.
 */
export function findBareColourVars(css, map) {
  const masked = maskComments(css);
  const needs = [];
  const unresolved = [];
  for (const m of masked.matchAll(BARE_VAR)) {
    const at = m.index + m[0].length - 1;
    const declStart =
      Math.max(
        masked.lastIndexOf(';', m.index),
        masked.lastIndexOf('{', m.index),
        masked.lastIndexOf('}', m.index),
      ) + 1;
    const colon = masked.indexOf(':', declStart);
    if (colon === -1 || colon > m.index) continue;
    const prop = masked.slice(declStart, colon).trim().toLowerCase();
    // Custom properties are aliases (`--_color: var(--mizu-text-secondary)`) read later as colours,
    // so they count too. The colour-literal check below keeps widths and radii out.
    if (!prop.startsWith('--') && !COLOUR_PROPS.has(prop)) continue;
    const name = m[1];
    if (map[name] === undefined) {
      unresolved.push({ at, name, prop });
      continue;
    }
    const literal = canonicalLiteral(resolveLiteral(map, name));
    if (!COLOUR_LITERAL.test(literal)) continue; // widths, radii and other non-colour tokens
    needs.push({ at, name, prop, literal });
  }
  return { needs, unresolved };
}

/** Adds fallbacks to `css`. Returns the new text and how many were added. */
export function addFallbacks(css, map) {
  const { needs, unresolved } = findBareColourVars(css, map);
  let out = css;
  for (const n of [...needs].sort((a, b) => b.at - a.at)) {
    out = out.slice(0, n.at) + `, ${n.literal}` + out.slice(n.at);
  }
  return { css: out, added: needs.length, unresolved };
}

export function cssFiles(dirs) {
  return dirs.flatMap((dir) =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return cssFiles([path]);
      return name.endsWith('.css') ? [path] : [];
    }),
  );
}

function main(argv) {
  const check = argv.includes('--check');
  const dirs = argv.filter((a) => !a.startsWith('--'));
  const targets = cssFiles(dirs.length ? dirs.map((d) => join(process.cwd(), d)) : DEFAULT_DIRS);
  const map = lightTokens(readFileSync(TOKEN_SHEET, 'utf8'));
  let total = 0;
  let failed = false;
  for (const file of targets) {
    const before = readFileSync(file, 'utf8');
    const { css, added, unresolved } = addFallbacks(before, map);
    for (const u of unresolved) {
      failed = true;
      console.error(`${relative(repo, file)}: ${u.name} in ${u.prop} has no token value`);
    }
    if (added === 0) continue;
    total += added;
    if (check) {
      console.log(`${relative(repo, file)}: ${added} fallback(s) missing`);
      failed = true;
    } else {
      writeFileSync(file, css);
      console.log(`${relative(repo, file)}: +${added}`);
    }
  }
  console.log(
    `${check ? 'missing' : 'added'} ${total} fallback(s) across ${targets.length} file(s)`,
  );
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2));
}
