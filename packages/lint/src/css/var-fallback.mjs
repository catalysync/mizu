import stylelint from 'stylelint';
import { isColourProperty, varCalls } from './values.mjs';

export const ruleName = 'mizu/var-fallback';

// A colour declaration that reads a --mizu-* token with no fallback renders nothing when
// a consumer's theme leaves that token unset. Custom property declarations are skipped:
// they are aliases, and the alias is where the fallback belongs.
export const rule = (option) => (root, result) => {
  if (!option) return;
  root.walkDecls((decl) => {
    if (decl.prop.startsWith('--') || !isColourProperty(decl.prop)) return;
    for (const call of varCalls(decl.value)) {
      if (!call.name.startsWith('--mizu-') || call.fallback !== null) continue;
      stylelint.utils.report({
        ruleName,
        result,
        node: decl,
        severity: option === 'warning' ? 'warning' : 'error',
        message: `${call.name} has no fallback in ${decl.prop}. Use var(${call.name}, <fallback>)`,
      });
    }
  });
};

export default stylelint.createPlugin(ruleName, rule);
