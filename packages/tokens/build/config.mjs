import { rmSync } from 'node:fs';
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
