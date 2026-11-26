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

// The CSS variables sit in the lowest mizu cascade layer, so an identity theme on any element
// (including <html>) and any unlayered consumer rule override them. The order statement matches
// @mizunagara/css, whichever of the two a page loads first.
// color-scheme sits beside the tokens so native controls and scrollbars follow the theme: light is
// the default scope here, and dark.css sets dark on its own scope.
const cssOut = 'dist/css/variables.css';
const vars = readFileSync(cssOut, 'utf8');
writeFileSync(
  cssOut,
  `@layer mizu.tokens, mizu.base, mizu.components, mizu.shell, mizu.identity;\n@layer mizu.tokens {\n${vars.trimEnd()}\n:root {\n  color-scheme: light;\n}\n}\n`,
);

const darkOut = 'dist/css/dark.css';
writeFileSync(
  darkOut,
  readFileSync(darkOut, 'utf8').replace(/(\[data-theme="dark"\] \{\n)/, '$1  color-scheme: dark;\n'),
);

