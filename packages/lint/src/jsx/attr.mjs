// JSX attribute helpers. A spread attribute can supply any prop, so callers treat a spread
// as "cannot prove the prop is missing" and do not report.

export function hasSpread(node) {
  return node.attributes.some((attr) => attr.type === 'JSXSpreadAttribute');
}

export function findAttribute(node, name) {
  return node.attributes.find(
    (attr) =>
      attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier' && attr.name.name === name,
  );
}

// The tag name, or the last segment for a member expression (<ui.IconButton> gives IconButton).
export function elementName(node) {
  if (node.name.type === 'JSXIdentifier') return node.name.name;
  if (node.name.type === 'JSXMemberExpression') return node.name.property.name;
  return null;
}
