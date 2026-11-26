import { elementName, findAttribute, hasSpread } from './attr.mjs';

// An icon-only button has no text for a screen reader to announce. The label must be an
// explicit aria-label prop; children cannot be relied on because an icon is usually a glyph.
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Require aria-label on IconButton' },
    messages: {
      missingLabel: 'IconButton needs an aria-label, because an icon alone has no accessible name.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (elementName(node) !== 'IconButton' || hasSpread(node)) return;
        if (findAttribute(node, 'aria-label')) return;
        context.report({ node, messageId: 'missingLabel' });
      },
    };
  },
};
