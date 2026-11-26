import stylelint from 'stylelint';

export const ruleName = 'mizu/identity-tokens-only';

// An identity file is a theme that sets tokens for the whole system. It may only contain
// rules on [data-mizu-identity] with custom property declarations. Component selectors belong
// in the component sheet, where a theme cannot silently restyle them.
const IDENTITY_ATTR = /\[data-mizu-identity[~|^$*]?=/;
const IDENTITY_SELECTOR = /^\[data-mizu-identity(?:="[^"]*")?\]$/;

export const rule = (option) => (root, result) => {
  if (!option) return;
  const severity = option === 'warning' ? 'warning' : 'error';
  if (!IDENTITY_ATTR.test(root.toString())) return;

  root.walkRules((rule) => {
    const selectors = rule.selectors.map((s) => s.trim());
    const badSelector = selectors.find((s) => !IDENTITY_SELECTOR.test(s));
    if (badSelector) {
      stylelint.utils.report({
        ruleName,
        result,
        node: rule,
        severity,
        message: `Identity theme file may only style [data-mizu-identity]; found "${badSelector}"`,
      });
      return;
    }
    rule.walkDecls((decl) => {
      if (decl.prop.startsWith('--')) return;
      stylelint.utils.report({
        ruleName,
        result,
        node: decl,
        severity,
        message: `Identity theme file may only set custom properties; found ${decl.prop}`,
      });
    });
  });
};

export default stylelint.createPlugin(ruleName, rule);
