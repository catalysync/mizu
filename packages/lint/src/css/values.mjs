// Helpers for reading declaration values. Stylelint hands rules raw strings, so
// `var(...)` calls are found by balancing parentheses rather than by a regex.

const COLOUR_PROPERTIES = new Set([
  'color',
  'background',
  'background-color',
  'border',
  'border-color',
  'border-top',
  'border-top-color',
  'border-right',
  'border-right-color',
  'border-bottom',
  'border-bottom-color',
  'border-left',
  'border-left-color',
  'border-block',
  'border-block-color',
  'border-block-start',
  'border-block-start-color',
  'border-block-end',
  'border-block-end-color',
  'border-inline',
  'border-inline-color',
  'border-inline-start',
  'border-inline-start-color',
  'border-inline-end',
  'border-inline-end-color',
  'outline',
  'outline-color',
  'fill',
  'stroke',
  'box-shadow',
  'text-decoration',
  'text-decoration-color',
  'text-emphasis-color',
  'caret-color',
  'accent-color',
  'column-rule',
  'column-rule-color',
  'scrollbar-color',
]);

export function isColourProperty(prop) {
  return COLOUR_PROPERTIES.has(prop.toLowerCase());
}

// Every top-level var( call in `value`, as { start, end, name, fallback }. `fallback` is null
// when the call has no top-level comma. CSS function names are case-insensitive, so VAR( counts.
// A call nested in an earlier call's fallback is reached through that fallback instead.
export function varCalls(value) {
  const calls = [];
  let from = 0;
  for (const match of value.matchAll(/var\(/gi)) {
    if (match.index < from) continue;
    const open = match.index + 3;
    let depth = 0;
    let end = -1;
    let comma = -1;
    for (let i = open; i < value.length; i += 1) {
      const ch = value[i];
      if (ch === '(') depth += 1;
      else if (ch === ')') {
        depth -= 1;
        if (depth === 0) {
          end = i;
          break;
        }
      } else if (ch === ',' && depth === 1 && comma === -1) comma = i;
    }
    if (end === -1) break;
    const name = (comma === -1 ? value.slice(open + 1, end) : value.slice(open + 1, comma)).trim();
    const fallback = comma === -1 ? null : value.slice(comma + 1, end).trim();
    calls.push({ start: match.index, end: end + 1, name, fallback });
    from = end + 1;
  }
  return calls;
}

// The value with every var() fallback removed, so literals inside fallbacks can be ignored.
export function stripVarFallbacks(value) {
  let out = '';
  let cursor = 0;
  for (const call of varCalls(value)) {
    out += value.slice(cursor, call.start);
    out += call.fallback === null ? value.slice(call.start, call.end) : `var(${call.name})`;
    cursor = call.end;
  }
  return out + value.slice(cursor);
}

const HEX_COLOUR =
  /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/;

export function findHexColour(value) {
  const visible = stripVarFallbacks(value)
    .replace(/url\([^)]*\)/gi, '') // url(#id) names an element, not a colour
    .replace(/"[^"]*"|'[^']*'/g, ''); // string contents are not values
  const match = visible.match(HEX_COLOUR);
  return match ? match[0] : null;
}
