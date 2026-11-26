import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import StyleDictionary from 'style-dictionary';

rmSync('dist', { recursive: true, force: true });

const sd = new StyleDictionary({
  source: ['src/base/**/*.json', 'src/semantic/**/*.json', 'src/component/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      prefix: 'mizu',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
    json: {
      transformGroup: 'js',
      buildPath: 'dist/json/',
      files: [{ destination: 'tokens.json', format: 'json/flat' }],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/ts/',
      files: [{ destination: 'tokens.ts', format: 'javascript/es6' }],
    },
    'react-native': {
      transformGroup: 'react-native',
      buildPath: 'dist/rn/',
      files: [{ destination: 'tokens.ts', format: 'javascript/es6' }],
    },
  },
});

await sd.buildAllPlatforms();

// The dark theme is its own dictionary: its tokens override the base and semantic names, so
// they must not be merged into the light source. Base and semantic files are `include`d so the
// theme's references resolve, and the platform filter keeps them out of dark.css.
const darkSd = new StyleDictionary({
  source: ['themes/mizu-dark.json'],
  include: ['src/base/**/*.json', 'src/semantic/**/*.json', 'src/component/**/*.json'],
  // The filtered-out base references are the point: dark.css points at the base palette.
  log: { warnings: 'disabled' },
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      prefix: 'mizu',
      files: [
        {
          destination: 'dark.css',
          format: 'css/variables',
          filter: (token) => token.filePath.endsWith('mizu-dark.json'),
          options: { selector: '[data-theme="dark"]', outputReferences: true },
        },
      ],
    },
  },
});

await darkSd.buildAllPlatforms();

// Semantic colours that differ between light and dark. Each one is written in variables.css as
// light-dark(light, dark), so a scope that computes color-scheme: dark gets the dark value without
// a data-theme attribute. dark.css keeps its overrides, so [data-theme="dark"] is unchanged.
// This list is the contract: a theme colour is only paired once it is named here. Shadows and the
// chart series are left out (shadows are not colours; chart series use their own dark palette).
const LIGHT_DARK_TOKENS = [
  'surface-default',
  'surface-secondary',
  'surface-inverse',
  'surface-hover',
  'text-primary',
  'text-secondary',
  'text-inverse',
  'text-disabled',
  'text-tertiary',
  'border-default',
  'border-subtle',
  'border-strong',
  'feedback-success-default',
  'feedback-success-subtle',
  'feedback-warning-default',
  'feedback-warning-subtle',
  'feedback-danger-default',
  'feedback-danger-subtle',
  'feedback-info-default',
  'feedback-info-subtle',
];

// Fails loudly if Style Dictionary changes the scope line; a silent miss would drop color-scheme.
const darkOut = 'dist/css/dark.css';
const dark = readFileSync(darkOut, 'utf8');
const darkScope = /\[data-theme="dark"\] \{\n/;
if (!darkScope.test(dark)) throw new Error('build tokens: dark.css scope selector not found');
writeFileSync(darkOut, dark.replace(darkScope, (scope) => `${scope}  color-scheme: dark;\n`));

// The CSS variables sit in the lowest mizu cascade layer, so an identity theme on any element
// (including <html>) and any unlayered consumer rule override them. The order statement matches
// @mizunagara/css, whichever of the two a page loads first.
// color-scheme sits beside the tokens so native controls and scrollbars follow the theme: light is
// the default scope here, and dark.css sets dark on its own scope.
const cssOut = 'dist/css/variables.css';
let vars = readFileSync(cssOut, 'utf8');
const darkValues = Object.fromEntries(
  [...dark.matchAll(/^  (--mizu-[a-z0-9-]+): (.+);$/gm)].map((m) => [m[1], m[2]]),
);
for (const token of LIGHT_DARK_TOKENS) {
  const name = `--mizu-${token}`;
  const line = new RegExp(`^  ${name}: (.+);$`, 'gm');
  const matches = [...vars.matchAll(line)];
  if (matches.length !== 1 || !darkValues[name]) {
    throw new Error(`build tokens: ${name} must appear once in light and once in dark`);
  }
  const light = matches[0][1];
  vars = vars.replace(line, `  ${name}: light-dark(${light}, ${darkValues[name]});`);
}
writeFileSync(
  cssOut,
  `@layer mizu.tokens, mizu.base, mizu.components, mizu.shell, mizu.identity;\n@layer mizu.tokens {\n${vars.trimEnd()}\n:root {\n  color-scheme: light;\n}\n}\n`,
);
