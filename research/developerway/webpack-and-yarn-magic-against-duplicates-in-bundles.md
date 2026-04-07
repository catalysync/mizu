---
title: "Webpack and Yarn Magic Against Duplicates in Bundles"
url: https://www.developerway.com/posts/webpack-and-yarn-magic-against-duplicates-in-bundles
date: 2020-06-11
slug: webpack-and-yarn-magic-against-duplicates-in-bundles
---

# Webpack and Yarn Magic Against Duplicates in Bundles

**Published:** 11-06-2020
**Author:** Nadia Makarevich

## Setting up the scene

This article assumes familiarity with npm, yarn, and webpack in modern frontend projects. Key terminology:

- **Direct dependencies**: Packages explicitly listed in package.json
- **Transitive dependencies**: Dependencies of your dependencies
- **Duplicated dependencies**: Transitive dependencies with mismatched versions
- **De-duplication**: Eliminating duplicates using semver-compatible versions
- **yarn.lock file**: Auto-generated file with exact versions of all dependencies

## The problem of duplicated dependencies

Large projects with dozens of direct dependencies inevitably accumulate hundreds of total packages. Duplicated dependencies increase bundle size, making reduction essential.

## Deduplication in yarn

Consider a project with `modal-dialog@3.0.0` and `button@2.5.0` as direct dependencies, where modal-dialog brings `button@2.4.1` as a transitive dependency.

Since versions 2.4.1 and 2.5.0 are semver-compatible, yarn can deduplicate them into a single `button@2.5.0` installation.

### Incompatible versions

When dependencies require incompatible versions (e.g., button@1.x and button@2.x), both must coexist. Typically, upgrading packages to compatible versions is the only solution.

### Installation structure

When installing dependencies, npm hoists compatible packages to the root `node_modules`. For incompatible versions, each dependent package maintains its own copy within nested `node_modules` folders.

## Duplicated dependencies and webpack

Webpack doesn't automatically deduplicate—it builds a dependency graph using Node's resolution algorithm. When multiple nested versions exist, webpack treats them as separate files and bundles both:

- `project/node_modules/editor/node_modules/button/index.js`
- `project/node_modules/modal-dialog/node_modules/button/index.js`

### First deduplication attempt

Using webpack's `NormalModuleReplacementPlugin`, you can:

1. Detect duplicated dependencies by finding packages with multiple `node_modules` in their path
2. Replace all instances with the first occurrence

This approach reduced Jira's bundle size by ~10%.

**Initial implementation: ~100 lines**

### The actual solution

The initial approach caused **non-deterministic webpack builds**—assets changed on each rebuild due to:

- Non-deterministic hook ordering in webpack
- Naive string replacement logic
- Incomplete module property replacement

Proper solution requires replacing both `request` and `context` properties with resolved absolute paths:

```javascript
// Before
{
  request: "./styled",
  context: "/project/node_modules/editor/node_modules/button"
}

// After
{
  request: "/project/node_modules/modal-dialog/node_modules/button/styled",
  context: "/project/node_modules/editor/node_modules/button"
}
```

## Key findings

**Non-deterministic behavior was difficult to reproduce** on small examples but occurred consistently with large projects like @atlaskit/editor.

**NormalModuleReplacementPlugin limitations**: It only processes the `request` property, missing `context` and other module origin information.

**Naive string replacement fails** with nested transitive dependencies. For example:

```
/project/node_modules/modal-dialog/node_modules/button-1.3.0
```

Simply replacing this path breaks references to dependencies nested within button, like icon@1.0.0.

## Results

After resolving non-deterministic behavior and battle-testing in Jira:

- ~10% overall bundle size reduction
- ~300ms TTI improvement on Issue View page

**Plugin available:** https://github.com/atlassian-labs/webpack-deduplication-plugin
