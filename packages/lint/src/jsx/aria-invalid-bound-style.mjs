import { findAttribute, hasSpread } from './attr.mjs';

// Native form controls get the error look from the form sheet, which styles
// [aria-invalid="true"] on .mizu-input, .mizu-textarea and .mizu-select__trigger.
const FORM_CONTROLS = new Set(['input', 'select', 'textarea']);

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

// On a plain element, aria-invalid does not change how the element looks. It needs a data-invalid
// binding that the stylesheet reads. Components are skipped: their markup is not visible here.
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Require a data-invalid binding on plain elements that set aria-invalid' },
    messages: {
      unboundInvalid:
        'aria-invalid on <{{name}}> changes nothing on screen. Bind data-invalid and style it, or use a form control.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (hasSpread(node) || node.name.type !== 'JSXIdentifier') return;
        const name = node.name.name;
        if (!/^[a-z]/.test(name) || FORM_CONTROLS.has(name)) return;
        const invalid = findAttribute(node, 'aria-invalid');
        if (!invalid || isExplicitlyValid(invalid)) return;
        if (findAttribute(node, 'data-invalid')) return;
        context.report({ node, messageId: 'unboundInvalid', data: { name } });
      },
    };
  },
};
