---
title: "Bundle Size Investigation: A Step-by-Step Guide to Shrinking Your JavaScript"
url: https://www.developerway.com/posts/bundle-size-investigation
date: 2025-12-04
slug: bundle-size-investigation
---

# Bundle Size Investigation: A Step-by-Step Guide to Shrinking Your JavaScript

**Published:** 04-12-2025
**Author:** Nadia Makarevich

## Overview

This comprehensive guide demonstrates practical techniques for analyzing and reducing JavaScript bundle size in React applications. The article uses a study project with an initial bundle of 5+ MB to illustrate real-world optimization strategies.

## Initial Project Setup

The author created a demonstration project available at: https://github.com/developerway/analyze-bundle-size

Starting bundle size: **5,321.89 kB** (gzip: 1,146.59 kB)

The project includes:
- A home page
- Settings page with tabbed forms
- Inbox page with message lists and modal dialogs

## Analyzing Bundle Size

### Bundle Analyzer Tools

The article recommends using bundler-specific visualization tools:
- **Vite:** Rollup Plugin Visualizer
- **Next.js:** Built-in Bundle Analyzer plugin
- **Other bundlers:** Search "[bundler-name] + bundle analyzer"

These tools create hierarchical visualizations showing relative file sizes and dependencies within bundles.

## Investigation Process

### Step 1: Identify Large Packages

The largest initial problem was the Material UI namespace (`@mui`), which included:
- `@mui/material` - component library
- `@mui/icons-material` - icon set (2,000 icons)

### Step 2: Understand Package Purpose

Quick research reveals library functions and usage patterns in the codebase.

### Step 3: Trace Package Usage

The Material packages were imported using a problematic pattern:

```tsx
import * as Material from "@mui/material";

export const StudyUi = {
  Library: Material,
};
```

This exposed all components through a unified interface, though only `Snackbar` was actually used.

### Step 4: Confirm the Problem

Temporarily commenting out the imports reduced bundle size from 5 MB to 811 KB, confirming the diagnosis.

## Tree Shaking and Dead Code Elimination

Modern bundlers identify and remove unused code through a process called "tree-shaking." However, this process has limitations.

### How Tree-Shaking Works

Bundlers create an abstract tree of files and their imports/exports, marking unused branches as "dead code" for removal. Components not imported anywhere are excluded from final bundles.

### The `*` Import Problem

This pattern confuses bundlers:

```tsx
import * as Buttons from '@fe/components/button';

export const Ui = {
  Buttons,
};
```

When namespace objects are assigned to variables rather than directly destructured, bundlers cannot determine which specific exports are used, preventing proper tree-shaking of external libraries.

## ES Modules and Non-tree-shakable Libraries

### Module Format Matters

JavaScript supports multiple module formats: ESM, CJS, AMD, UMD. Only ESM (modern `import`/`export` syntax) is reliably tree-shakable.

Check library format using:
```bash
npx is-esm [library-name]
```

**Example findings:**
- Lodash: Not ESM (cannot tree-shake)
- Material UI: ESM (tree-shakable)

### Non-ESM Solutions

Some libraries provide targeted import paths:

```bash
# Instead of:
import _ from "lodash";

# Use:
import trim from "lodash/trim";
```

This approach reduced the Lodash bundle from hundreds of KB to minimal size.

### Native Alternatives

For simple operations, native JavaScript often suffices:

```tsx
// Instead of lodash:
const cleanValue = val.toLowerCase().trim();
```

## Duplicate Libraries

The bundle contained three separate date libraries:
- `date-fns`
- `moment`
- `luxon`

Each served identical purposes, representing wasted bundle space.

### Resolution Strategy

The author consolidated to `date-fns` after evaluating:
- Tree-shaking support
- API preference
- Maintenance status
- Resulting bundle size

Converting from `moment` and `luxon` reduced bundle size by approximately 20% (from 804 KB to 673 KB).

## Transitive Dependencies

Libraries included indirectly through other dependencies create hidden bundle bloat. The `@emotion` CSS-in-JS library was present despite no direct usage—it was required by Material UI.

### Identifying Sources

```bash
npx npm-why @emotion/styled
```

This utility lists all dependency chains leading to a package, revealing whether removal requires refactoring other dependencies.

### Removal Decision

Removing `@emotion` required eliminating both Material UI packages entirely, requiring significant refactoring:
- Replacing Material Snackbar with Radix Toast
- Swapping Material icons for local alternatives

## Final Results

**Bundle size reduction: 5 MB → 600.98 KB**

Key optimizations applied:
1. Fixed tree-shaking by importing only needed Material components
2. Replaced non-tree-shakable lodash with targeted imports
3. Consolidated date libraries to single option
4. Removed unused CSS-in-JS dependency
5. Replaced Material components with Radix equivalents

The author notes additional optimization opportunities remain (particularly through lazy-loading tiptap and prosemirror libraries).

---

*This article is excerpted from the author's book "Web Performance Fundamentals" available at https://www.getwebperf.com/*
