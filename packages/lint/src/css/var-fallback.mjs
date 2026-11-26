import stylelint from 'stylelint';
import { isColourProperty, varCalls } from './values.mjs';

export const ruleName = 'mizu/var-fallback';

// Names of --mizu-* tokens read without a fallback. An empty fallback (var(--a,)) is no fallback.
// Nested calls count too: in var(--a, var(--b)) the outer call has a fallback, but --b does not.
function unfallbackedTokens(value) {
  const names = [];
  for (const call of varCalls(value)) {
    if (call.fallback) names.push(...unfallbackedTokens(call.fallback));
    else if (call.name.startsWith('--mizu-')) names.push(call.name);
  }
  return names;
}

// A colour declaration that reads a --mizu-* token with no fallback renders nothing when
// a consumer's theme leaves that token unset. Custom property declarations are skipped:
// they are aliases, and the alias is where the fallback belongs.
export const rule = (option) => (root, result) => {
  if (!option) return;
  root.walkDecls((decl) => {
    if (decl.prop.startsWith('--') || !isColourProperty(decl.prop)) return;
    for (const name of unfallbackedTokens(decl.value)) {
      stylelint.utils.report({
        ruleName,
        result,
        node: decl,
        severity: option === 'warning' ? 'warning' : 'error',
        message: `${name} has no fallback in ${decl.prop}. Use var(${name}, <fallback>)`,
      });
    }
  });
};

export default stylelint.createPlugin(ruleName, rule);
