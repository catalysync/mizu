# React Doctor in mizu

We run [React Doctor](https://github.com/millionco/react-doctor) on every commit via husky and on every PR via GitHub Actions. The target score is **100/100** across every workspace.

## How to run

```sh
pnpm doctor          # full scan, all workspaces
pnpm doctor:diff     # only files changed vs main — fast mid-development check
pnpm doctor:score    # score-only summary (what CI uses)
```

The underlying CLI is `npx react-doctor@latest .`.

## Config

`react-doctor.config.json` at the repo root. Two kinds of entries:

### Ignored rules

- **`react-doctor/no-barrel-import`** — mizu ships barrel exports (`@aspect/react` → single entry, `@aspect/finance` → single entry, etc.) as the public API contract. This is the standard pattern for design system libraries (shadcn, Radix, Material, Chakra, Mantine). The rule is aimed at app code where direct imports improve tree-shaking; for a published library the barrel _is_ the API.
- **`react-doctor/prefer-useReducer`** — stylistic preference. We use `useState` for anything simple and reach for reducers only when state transitions are genuinely complex. This rule is noise, not signal.
- **`react-doctor/nextjs-*`** (no-img-element, no-a-element, no-font-link, no-native-script, missing-metadata) — react-doctor auto-detects Next.js from peer deps, so it flags these rules in our Storybook and library packages where they don't apply. Demo stories use native `<img>` for mock product photos; library code doesn't use next/font. For the actual Next.js app (`apps/docs`), we enforce these rules.
- **`react-doctor/no-render-in-render`** — flags inline function calls in JSX, which catches legitimate render props (`renderExpanded={(row) => …}` on `DataTable`, `emptyState={() => …}` on `ResourceList`). Render props are a valid React pattern when the shape of the rendered output depends on data; not every inline call is a perf trap.
- **`react-doctor/prefer-dynamic-import`** — flags large libraries (recharts, etc.). For `@aspect/charts`, recharts IS the point — consumers import a `LineChart` and expect it to render on first paint, not after a chunk loads. Dynamic import is a consumer decision, not a library one.
- **`react-doctor/no-array-index-as-key`** — valid rule, but overreaches on static fixed-size lists (skeleton bars, demo fixtures) where the order never changes. We use index keys intentionally in those cases. Ignored globally; we still audit real lists during review.

### Ignored paths

- `dist/`, `.next/`, `storybook-static/`, `coverage/`, `node_modules/` — build output.
- `*.test.*`, `*.stories.*` — test + story files use relaxed patterns (array index keys for static fixtures, inline styles for one-off demo positioning). Source code still has to comply.

## Every other rule is enforced

If you hit an error or warning, fix the code. If you genuinely need to silence something case-specific, first ask whether the architecture is wrong — most of the time the rule is right and the code needs refactoring.

Rules we've hit and fixed in the past are documented as commit messages prefixed `doctor:`.

## When we add new rules to the ignore list

Only when:

1. The rule is philosophically wrong for our architecture (library vs app, framework mismatch) — not "this one case is annoying."
2. We write the rationale in this file.

Reviewer discretion on what qualifies.
