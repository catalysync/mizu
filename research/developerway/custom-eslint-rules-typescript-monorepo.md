---
title: "Custom eslint rules + typescript monorepo"
url: https://www.developerway.com/posts/custom-eslint-rules-typescript-monorepo
date: 2021-04-18
slug: custom-eslint-rules-typescript-monorepo
---

# Custom eslint rules + typescript monorepo

**Published:** 18-04-2021
**Author:** Nadia Makarevich

## Overview

The article addresses a challenge in development: combining TypeScript's type safety with ESLint custom rules. The author explains why this pairing is difficult and provides a practical solution for monorepo environments.

## Problem Statement

ESLint natively supports only JavaScript rules, creating tension with developers who prefer strongly typed code. Three common workarounds exist:

1. Writing ESLint rules in plain JavaScript (losing type benefits)
2. Pre-compiling TypeScript rules to JavaScript before use
3. Extracting rules into separate npm packages

The author describes this situation as frustrating for developer experience and code quality.

## Solution: Three-Step Implementation

### Step 1: Create ESLint Plugin Package

Structure a new package (`eslint-plugin-example`) with:

- **package.json**: Configure with appropriate naming conventions and point `main` to `index.js`
- **index.ts**: TypeScript entry point exporting rules
- **rules/my-first-rule.ts**: Individual typed rule implementations using `Rule.RuleModule`
- **index.js**: Bridge file (described in Step 3)

### Step 2: Configure ESLint

Link the package via workspaces and add it to `.eslintrc` configuration:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['example'],
  rules: {
    'example/my-first-rule': 'error',
  }
};
```

### Step 3: Bridge JavaScript and TypeScript

The critical step involves registering ts-node in `index.js` to enable direct TypeScript file consumption:

```javascript
require('ts-node').register();
const rules = require('./index.ts').default;
module.exports = { rules: rules };
```

This eliminates compilation steps between code writing and usage.

## Important Caveat

Publishing becomes complex since `package.json`'s `main` field points to the bridge file rather than compiled code. Solutions include:

- Modifying the `main` field during CI/publishing
- Using environment variables in the bridge file
- Excluding the plugin from publication altogether

## Key Takeaway

"It assumes monorepo setup (yarn workspaces, lerna, pnpm, etc), but the general approach can be used outside of monorepos as well."
