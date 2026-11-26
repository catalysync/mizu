// JSX attribute helpers. A spread attribute can supply any prop, so callers treat a spread
// as "cannot prove the prop is missing" and do not report.

export function jsxAttributes(node) {
  return node.attributes;
}

export function hasSpread(node) {
  return node.attributes.some((attr) => attr.type === 'JSXSpreadAttribute');
}

export function findAttribute(node, name) {
  return node.attributes.find(
    (attr) =>
      attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier' && attr.name.name === name,
  );
}

export function elementName(node) {
  return node.name.type === 'JSXIdentifier' ? node.name.name : null;
}
