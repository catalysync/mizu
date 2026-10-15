import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repo = fileURLToPath(new URL('../../../', import.meta.url));

export function read(rel: string) {
  return readFileSync(join(repo, rel), 'utf8');
}

export function walk(rel: string, exts: string[]): string[] {
  const dir = join(repo, rel);
  return readdirSync(dir).flatMap((name) => {
    const path = join(rel, name);
    if (statSync(join(repo, path)).isDirectory()) {
      return name === 'node_modules' || name === 'dist' ? [] : walk(path, exts);
    }
    return exts.some((e) => name.endsWith(e)) ? [path] : [];
  });
}

export const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Flat `selector { declarations }` blocks; nested at-rule wrappers are ignored. */
export function blocks(css: string) {
  return [...stripComments(css).matchAll(/([^{}]*)\{([^{}]*)\}/g)].map((m) => ({
    selector: m[1].trim(),
    declarations: Object.fromEntries(
      [...m[2].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);?/g)].map((d) => [d[1], d[2].trim()]),
    ) as Record<string, string>,
  }));
}

/** Custom properties declared on blocks whose selector matches `selector`. */
export function declarations(css: string, selector: RegExp) {
  return Object.assign(
    {},
    ...blocks(css)
      .filter((b) => selector.test(b.selector))
      .map((b) => b.declarations),
  ) as Record<string, string>;
}

/** The token sheet every consumer loads, plus mizu's own :root scale. */
export function rootTokens() {
  return {
    ...declarations(read('packages/tokens/dist/css/variables.css'), /^:root$/),
    ...declarations(read('packages/css/src/density.css'), /^:root$/),
  };
}

/** Resolve `var(--x)` chains (no fallbacks) against a token map. */
export function resolve(tokens: Record<string, string>, name: string, depth = 0): string {
  const value = tokens[name];
  if (value === undefined) throw new Error(`${name} is not defined`);
  if (depth > 20) throw new Error(`${name}: reference cycle`);
  return value.replace(/var\((--[a-z0-9-]+)\)/g, (_, ref) => resolve(tokens, ref, depth + 1));
}

export function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Root tokens with the dark sample theme applied on top. */
export function darkTokens() {
  return {
    ...rootTokens(),
    ...declarations(read('packages/css/src/themes/dark.css'), /^\[data-theme="dark"\]$/),
  };
}

/** OKLab distance ×100 (the scale the categorical-palette checks use). */
export function deltaE(a: string, b: string) {
  const oklab = (hex: string) => {
    const [r, g, bl] = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * bl);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * bl);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * bl);
    return [
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
  };
  const [x, y] = [oklab(a), oklab(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100;
}
