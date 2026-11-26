import { elementName, findAttribute, hasSpread } from './attr.mjs';

// Whether an accessible-name attribute gives a name. A bare attribute (aria-label), an empty
// string and a literal undefined give none. Other expressions cannot be evaluated here, so they
// count as a name and are not reported.
function givesName(attr) {
  if (!attr || !attr.value) return false;
  const value = attr.value;
  if (value.type === 'Literal') return value.value.trim() !== '';
  if (value.type !== 'JSXExpressionContainer') return true;
  const expr = value.expression;
  if (expr.type === 'Literal')
    return typeof expr.value === 'string'
      ? expr.value.trim() !== ''
      : expr.value != null && expr.value !== false;
  if (expr.type === 'Identifier' && expr.name === 'undefined') return false;
  return true;
}

// An icon-only button has no text for a screen reader to announce, so it needs an accessible
// name: aria-label, or aria-labelledby pointing at a visible label.
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Require an accessible name on IconButton' },
    messages: {
      missingLabel:
        'IconButton needs an aria-label or aria-labelledby, because an icon alone has no accessible name.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (elementName(node) !== 'IconButton' || hasSpread(node)) return;
        if (
          givesName(findAttribute(node, 'aria-label')) ||
          givesName(findAttribute(node, 'aria-labelledby'))
        )
          return;
        context.report({ node, messageId: 'missingLabel' });
      },
    };
  },
};
