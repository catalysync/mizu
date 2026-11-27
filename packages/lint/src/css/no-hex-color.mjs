import stylelint from 'stylelint';
import { findHexColour } from './values.mjs';

export const ruleName = 'mizu/no-hex-color';

// Flags hex literals in declaration values. A hex value inside a var() fallback is
// allowed: fallbacks are how a component degrades when a theme leaves a token unset.
export const rule = (option) => (root, result) => {
  if (!option) return;
  root.walkDecls((decl) => {
    const hex = findHexColour(decl.value);
    if (!hex) return;
    stylelint.utils.report({
      ruleName,
      result,
      node: decl,
      severity: option === 'warning' ? 'warning' : 'error',
      message: `Unexpected hex colour ${hex}. Reference a --mizu-* token instead`,
    });
  });
};

export default stylelint.createPlugin(ruleName, rule);
