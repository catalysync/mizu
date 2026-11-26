import { findAttribute, hasSpread } from './attr.mjs';

// aria-invalid={false} announces nothing, so there is no error to style.
function isExplicitlyValid(attr) {
  const value = attr.value;
  if (!value) return false;
  if (value.type === 'Literal') return value.value === 'false';
  return (
    value.type === 'JSXExpressionContainer' &&
    value.expression.type === 'Literal' &&
    value.expression.value === false
  );
}

// aria-invalid tells assistive tech a field is in error, but mizu draws the error state from
// data-invalid. Setting only aria-invalid announces the error without showing it.
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Require a data-invalid style binding wherever aria-invalid is set' },
    messages: {
      unboundInvalid:
        'aria-invalid is set without data-invalid, so the error is announced but not styled. Bind data-invalid too.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (hasSpread(node)) return;
        const invalid = findAttribute(node, 'aria-invalid');
        if (!invalid || isExplicitlyValid(invalid)) return;
        if (findAttribute(node, 'data-invalid')) return;
        context.report({ node, messageId: 'unboundInvalid' });
      },
    };
  },
};
