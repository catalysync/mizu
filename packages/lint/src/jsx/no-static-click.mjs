import { elementName, findAttribute, hasSpread } from './attr.mjs';

// Elements that the browser already treats as interactive (focusable, activated by keyboard).
const INTERACTIVE = new Set([
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'option',
  'summary',
  'label',
  'details',
]);

// A click handler on a plain element is invisible to keyboard and screen reader users unless
// the element also declares a role. Components that need a role should set it explicitly.
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow onClick on non-interactive elements without a role' },
    messages: {
      staticClick:
        'onClick on <{{name}}> without a role. Use a button, or add a role and keyboard handling.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const name = elementName(node);
        // Intrinsic elements start with a lowercase letter; components (capitalised) are skipped.
        if (!name || !/^[a-z]/.test(name) || INTERACTIVE.has(name)) return;
        if (hasSpread(node) || !findAttribute(node, 'onClick')) return;
        if (findAttribute(node, 'role')) return;
        context.report({ node, messageId: 'staticClick', data: { name } });
      },
    };
  },
};
