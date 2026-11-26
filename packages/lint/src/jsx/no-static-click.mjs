import { elementName, findAttribute, hasSpread } from './attr.mjs';

// Elements the browser already treats as interactive (focusable, activated by keyboard).
// A label is not one of them: it only forwards clicks to its control.
const INTERACTIVE = new Set(['a', 'button', 'input', 'select', 'textarea', 'option', 'summary']);

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
        // Intrinsic elements are plain identifiers starting lowercase; components and member
        // expressions (<ui.div>) are skipped.
        if (node.name.type !== 'JSXIdentifier') return;
        const name = elementName(node);
        if (!/^[a-z]/.test(name) || INTERACTIVE.has(name)) return;
        if (hasSpread(node) || !findAttribute(node, 'onClick')) return;
        if (findAttribute(node, 'role')) return;
        context.report({ node, messageId: 'staticClick', data: { name } });
      },
    };
  },
};
