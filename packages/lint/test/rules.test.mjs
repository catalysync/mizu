// One harness for every rule. Each rule directory under test/fixtures/<rule>/ must hold at
// least one pass-*.{css,jsx} file (no findings for that rule) and one fail-*.{css,jsx} file
// (at least one finding for that rule). A rule without both fails the suite.
import { Linter } from 'eslint';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';
import { eslintPlugin } from '../src/eslint.mjs';
import { stylelintPlugins } from '../src/stylelint.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = join(here, 'fixtures');

const CSS_RULES = {
  'no-hex-color': { id: 'mizu/no-hex-color', option: true },
  'var-fallback': { id: 'mizu/var-fallback', option: 'warning' },
  'identity-tokens-only': { id: 'mizu/identity-tokens-only', option: true },
};
const JSX_RULES = {
  'icon-button-label': 'icon-button-label',
  'aria-invalid-bound-style': 'aria-invalid-bound-style',
  'no-static-click': 'no-static-click',
};

async function lintCss(file, ruleId, option) {
  const code = readFileSync(join(fixtures, dirname(file), '..', file), 'utf8');
  const result = await stylelint.lint({
    code,
    codeFilename: file,
    config: { plugins: stylelintPlugins, rules: { [ruleId]: option } },
  });
  return result.results[0].warnings.filter((w) => w.rule === ruleId);
}

const linter = new Linter({ configType: 'flat' });
function lintJsx(file, ruleName) {
  const code = readFileSync(join(fixtures, file), 'utf8');
  const all = linter.verify(
    code,
    [
      {
        files: ['**/*.jsx'],
        plugins: { mizu: eslintPlugin },
        languageOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          parserOptions: { ecmaFeatures: { jsx: true } },
        },
        rules: { [`mizu/${ruleName}`]: 'error' },
      },
    ],
    file,
  );
  // A parse error or an unmatched config yields no finding for the rule; fail on it instead.
  const fatal = all.filter((m) => m.ruleId === null);
  assert.deepEqual(fatal, [], `fixture ${file} did not lint`);
  return all.filter((m) => m.ruleId === `mizu/${ruleName}`);
}

function fixtureFiles(rule) {
  return readdirSync(join(fixtures, rule));
}

for (const [rule, { id, option }] of Object.entries(CSS_RULES)) {
  describe(id, () => {
    it('has a passing and a failing fixture', () => {
      const names = fixtureFiles(rule);
      assert.ok(
        names.some((n) => n.startsWith('pass-') && extname(n) === '.css'),
        'pass fixture',
      );
      assert.ok(
        names.some((n) => n.startsWith('fail-') && extname(n) === '.css'),
        'fail fixture',
      );
    });
    for (const name of fixtureFiles(rule).filter((n) => extname(n) === '.css')) {
      it(`${name} ${name.startsWith('pass-') ? 'reports nothing' : 'reports findings'}`, async () => {
        const warnings = await lintCss(join(rule, name), id, option);
        if (name.startsWith('pass-'))
          assert.equal(warnings.length, 0, JSON.stringify(warnings, null, 2));
        else assert.ok(warnings.length > 0, 'expected at least one finding');
      });
    }
  });
}

describe('mizu/var-fallback severity', () => {
  it('reports at warning level when the option is "warning"', async () => {
    const [w] = await lintCss('var-fallback/fail-no-fallback.css', 'mizu/var-fallback', 'warning');
    assert.equal(w.severity, 'warning');
  });
  it('reports at error level when the option is true', async () => {
    const [w] = await lintCss('var-fallback/fail-no-fallback.css', 'mizu/var-fallback', true);
    assert.equal(w.severity, 'error');
  });
});

for (const [rule, ruleName] of Object.entries(JSX_RULES)) {
  describe(`mizu/${ruleName}`, () => {
    it('has a passing and a failing fixture', () => {
      const names = fixtureFiles(rule);
      assert.ok(
        names.some((n) => n.startsWith('pass-') && extname(n) === '.jsx'),
        'pass fixture',
      );
      assert.ok(
        names.some((n) => n.startsWith('fail-') && extname(n) === '.jsx'),
        'fail fixture',
      );
    });
    for (const name of fixtureFiles(rule).filter((n) => extname(n) === '.jsx')) {
      it(`${name} ${name.startsWith('pass-') ? 'reports nothing' : 'reports findings'}`, () => {
        const messages = lintJsx(join(rule, name), ruleName);
        if (name.startsWith('pass-'))
          assert.equal(messages.length, 0, JSON.stringify(messages, null, 2));
        else assert.ok(messages.length > 0, 'expected at least one finding');
      });
    }
  });
}
