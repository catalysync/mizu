import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { eslintPlugin, eslintRules } from '../src/eslint.mjs';
import { stylelintPlugins, stylelintRules } from '../src/stylelint.mjs';

describe('@mizunagara/lint entry points', () => {
  it('load with no rules registered yet', () => {
    assert.deepEqual(stylelintPlugins, []);
    assert.deepEqual(stylelintRules, {});
    assert.deepEqual(Object.keys(eslintPlugin.rules), []);
    assert.deepEqual(eslintRules, {});
  });
});
