---
title: "Learning by Fixing: Node.js, Modules and Packages"
url: https://www.developerway.com/posts/learning-by-fixing-node-js-modules-and-packages
date: 2021-02-08
slug: learning-by-fixing-node-js-modules-and-packages
---

# Learning by Fixing: Node.js, Modules and Packages

**Published:** 08-02-2021 by Nadia Makarevich

## The Mystery

A frontend project using React, Next.js, and an external UI component library (Lozenge with Compiled CSS-in-JS) built successfully locally but failed in CI. The build error revealed that a CJS file was attempting to require an ESM file—an incompatible module format mismatch. Notably, the issue only occurred with newer Node versions in CI, not locally.

## ESM or CJS

JavaScript originally lacked native module support, leading to competing formats:

**ESM** ("modern" format):
```
import React from 'react';
```

**CJS** ("old" format):
```
const React = require('react').default;
```

CJS cannot consume ESM modules. The error indicated that `@atlaskit/lozenge/dist/cjs/Lozenge/Container.js` was requiring `@compiled/react/dist/esm/runtime.js`—fundamentally incompatible.

Modern libraries often distribute both formats to enable tree-shaking and reduce bundle sizes.

## Modules Resolution and Packages

The problematic code showed:
```
var _runtime = require("@compiled/react/runtime");
```

This deep import pattern suggests a custom multi-entry strategy for reducing bundle sizes.

Examining Node's module resolution: Node searches `node_modules` starting from the requiring file's location and ascending the directory tree. It locates `package.json` files and reads their `main` field—the only field Node natively recognizes.

The `@compiled/react/runtime` directory contained a minimal `package.json` with relative paths to `dist` files. While unusual, this serves as "a way to trick Node into resolving that file via the simplified path."

The `module` field (a de-facto standard used by bundlers like Webpack) wasn't the culprit—testing confirmed changing it had no effect.

## Package Exports

The breakthrough came from Node version 12.17.x changelog: ESM support was enabled by default. Inspecting `@compiled/react/package.json` revealed an `exports` field.

Node's module resolution algorithm treats `exports` as a gatekeeper. When resolving `@compiled/react/runtime`, Node:

1. Parses the required path, extracting scope (`@compiled`), name (`react`), and subpath (`/runtime`)
2. Finds the matching `package.json` at `@compiled/react`
3. Checks the `exports` field for matching entries
4. Resolves according to the `exports` mapping

"Since Compiled at the root had package.json with exports, node never even reached the weird package.json with the reference to the correct CJS runtime.js."

Older Node versions ignored `exports`, falling back to the nested `package.json` with correct CJS references. Newer Node versions enforced `exports`, which pointed to the ESM module, breaking CJS consumers.

## Solution

Rather than forcing CJS, the library implemented **conditional exports**:

```
"exports": {
  "./runtime": {
    "require": "./dist/cjs/runtime.js",
    "import": "./dist/esm/runtime.js"
  }
}
```

This allows Node to serve the appropriate module format based on whether the consumer uses `require` (CJS) or `import` (ESM), ensuring compatibility across all versions.
