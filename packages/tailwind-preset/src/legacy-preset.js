/*
 * Tailwind v3 fallback preset for consumers stuck on the legacy JS-config path.
 * Modern consumers should use ./preset.css with Tailwind v4 instead.
 *
 * Usage (Tailwind v3):
 *   const mizuPreset = require('@aspect/tailwind-preset/legacy');
 *   module.exports = { presets: [mizuPreset], ... };
 */

const flattenValue = (obj) => {
  const result = {};
  for (const key of Object.keys(obj)) {
    const node = obj[key];
    if (node && typeof node === 'object' && '$value' in node) {
      result[key] = node.$value;
    } else if (node && typeof node === 'object') {
      result[key] = flattenValue(node);
    } else {
      result[key] = node;
    }
  }
  return result;
};

let tokens;
try {
  tokens = require('@aspect/tokens/json');
} catch {
  tokens = {};
}

module.exports = {
  theme: {
    extend: {
      colors: tokens.color ? flattenValue(tokens.color) : {},
      spacing: tokens.spacing ? flattenValue(tokens.spacing) : {},
      borderRadius: tokens.radius ? flattenValue(tokens.radius) : {},
      boxShadow: tokens.shadow ? flattenValue(tokens.shadow) : {},
      fontFamily: tokens.font?.family ? flattenValue(tokens.font.family) : {},
      fontSize: tokens.font?.size ? flattenValue(tokens.font.size) : {},
      fontWeight: tokens.font?.weight ? flattenValue(tokens.font.weight) : {},
      transitionDuration: tokens.duration ? flattenValue(tokens.duration) : {},
    },
  },
};

module.exports.flattenValue = flattenValue;
