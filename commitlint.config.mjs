/**
 * Commit message rules for mizu.
 *
 * Intentionally NOT using @commitlint/config-conventional — mizu's prefixes
 * are free-form (`layouts:`, `finance:`, `storybook:`, `repo:`, `docs:`,
 * `fix:`, etc.) rather than the strict conventional-commits `feat/fix/…`
 * type-enum. We only enforce the rules mizu actually cares about.
 *
 * Rules mirrored from memory/feedback:
 *  - lowercase subject
 *  - subject ≤ 30 characters
 *  - no attribution of any kind in commit message (no Claude, no
 *    Co-Authored-By, no "inspired by <external-ds>")
 */

/** Custom rule: reject attribution patterns anywhere in the commit message. */
const noAttributionRule = (parsed) => {
  const { raw = '', header = '', body = '', footer = '' } = parsed;
  const text = [raw, header, body, footer].join('\n').toLowerCase();
  const banned = [
    { pattern: /co-authored-by:/i, label: 'Co-Authored-By trailer' },
    { pattern: /\bclaude\b/i, label: 'Claude attribution' },
    { pattern: /\bgenerated with\b.*(claude|anthropic|ai)/i, label: 'AI-generated marker' },
    { pattern: /🤖\s*generated/i, label: 'robot emoji generated marker' },
    {
      pattern: /\b(inspired by|ported from)\s+(cloudscape|sage|shadcn|radix|blueprint|atlassian|polaris|fluent|material)\b/i,
      label: 'external-DS attribution',
    },
  ];
  for (const { pattern, label } of banned) {
    if (pattern.test(text)) {
      return [false, `commit must not contain ${label} — attribution belongs in planning docs or NOTICE, never commits`];
    }
  }
  return [true];
};

export default {
  rules: {
    'header-max-length': [2, 'always', 30],
    'header-min-length': [2, 'always', 3],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'no-attribution': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'no-attribution': noAttributionRule,
      },
    },
  ],
};
