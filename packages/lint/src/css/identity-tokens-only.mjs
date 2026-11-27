import stylelint from 'stylelint';

export const ruleName = 'mizu/identity-tokens-only';

// An identity file is a theme that sets tokens for the whole system. It may only contain
// rules on [data-mizu-identity] (optionally narrowed by more data attributes) with custom
// property declarations. Component selectors belong in the component sheet, where a theme
// cannot silently restyle them.
const VALUE = `(?:"[^"]*"|'[^']*'|[^\\]"'\\s]+)`;
const IDENTITY_ATTR = /\[data-mizu-identity(?=[\]~|^$*=])/;
const IDENTITY_SELECTOR = new RegExp(
  `^\\[data-mizu-identity(?:[~|^$*]?=${VALUE})?\\](?:\\[data-[a-z0-9-]+(?:[~|^$*]?=${VALUE})?\\])*$`,
);

// Keyframe steps (from, to, 50%) are not selectors on the page.
function insideKeyframes(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return true;
  }
  return false;
}

export const rule = (option) => (root, result) => {
  if (!option) return;
  const severity = option === 'warning' ? 'warning' : 'error';
  if (!IDENTITY_ATTR.test(root.toString())) return;

  root.walkRules((styleRule) => {
    if (insideKeyframes(styleRule)) return;
    const badSelector = styleRule.selectors
      .map((s) => s.trim())
      .find((s) => !IDENTITY_SELECTOR.test(s));
    if (badSelector) {
      stylelint.utils.report({
        ruleName,
        result,
        node: styleRule,
        severity,
        message: `Identity theme file may only style [data-mizu-identity]; found "${badSelector}"`,
      });
      return;
    }
    styleRule.walkDecls((decl) => {
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
