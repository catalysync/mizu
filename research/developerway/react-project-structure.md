---
title: "React Project Structure for Scale: Decomposition, Layers and Hierarchy"
url: https://www.developerway.com/posts/react-project-structure
date: 2022-05-23
slug: react-project-structure
---

# React Project Structure for Scale: Decomposition, Layers and Hierarchy

**Published:** 23-05-2022
**Author:** Nadia Makarevich

---

## What do we need from the project structure convention

Before diving into solutions, it's important to understand what makes a project structure convention effective:

### Replicability

Code conventions should be understandable enough that any team member, including junior developers, can replicate them. Overly complex systems requiring extensive training won't survive in practice.

### Inferrability

The best conventions are self-documenting. Team members should be able to reverse-engineer the structure by reading the code itself, without needing extensive documentation.

### Independence

Structure guidelines should enable developers to work independently. The goal is preventing multiple developers from working on the same files or teams constantly invading each other's responsibilities.

### Optimised for refactoring

Modern frontend is fluid, with patterns and frameworks constantly evolving. A good convention shouldn't "glue" code permanently but should make refactoring feel natural and everyday.

---

## Organising the project itself: decomposition

The core principle involves thinking of your project not as a monolithic application but as a composition of independent features—essentially "nanoservices" within a React application.

Each feature functions as a "black box" with a well-defined public API (typically React props). This mindset enables:

- Independent team development in parallel
- Easy feature removal or replacement
- Internal refactoring without affecting external consumers
- Modularity and logical organization

**Definition:** A "feature" comprises components and elements forming complete end-user functionality—distinct from individual components.

### Multi-package monorepo architecture

Rather than extracting features into actual microservices (impractical for hundreds of features), use a multi-package monorepo: a single repository containing multiple packages that share tools, scripts, and dependencies while remaining isolated.

```
/packages
  /my-feature
    /some-folders-in-feature
    index.ts
    package.json
  /another-feature
    /some-folders-in-feature
    index.ts
    package.json
```

Each package's `package.json` requires:

```json
{
  "name": "@project/my-feature",
  "main": "index.ts"
}
```

This allows imports like:

```tsx
import { Something } from '@project/my-feature';
```

Rather than relative paths:

```tsx
import { Something } from '../../components/button';
```

### Why packages rather than just folders

**Aliasing:** Package names clearly indicate source and context. Relative imports become ambiguous:

```tsx
import { bla } from '../../../common';
import { blabla } from '../../common';
import { blablabla } from '../common';
```

Versus with packages:

```tsx
import { bla } from '@project/button/common';
import { blabla } from '@project/something/common';
```

**Separation of concerns:** Named packages naturally encourage treating features as isolated modules with defined public APIs.

**Built-in support:** Modern tools support packages natively—IDEs, TypeScript, linters, and bundlers all work out-of-the-box.

**Refactoring is straightforward:** Internal refactoring doesn't require changes elsewhere if the public API remains consistent. Renaming is a simple find-and-replace.

**Explicit entry points:** You can restrict deep imports, forcing consumers to use only explicitly defined public APIs in index.ts files.

### How to split code into packages

Balance is key. Avoid:
- Extracting everything into tiny single-file packages (creates flat lists without structure)
- Making packages too large (recreates the original problems within the package)

Typical boundaries for packages:

- Design system components (buttons, modals, layouts, tooltips)
- Features with natural UI boundaries (modal dialogs, drawers, slide-in panels)
- Shareable features used in multiple places
- Isolated features with clear boundaries and UI visibility

Important: Each package should handle one conceptual concern. Don't export unrelated items like `Button`, `CreateIssueDialog`, and `DateTimeConverter` from one package.

### How to organize packages

Structure depends on project type and can evolve over time. For a frontend-only project, start flat:

```
/packages
  /button
  /footer
  /settings
```

Evolve into organized groupings:

```
/packages
  /core
    /button
    /modal
    /tooltip
  /product-one
    /footer
    /settings
  /product-two
```

For projects with both frontend and backend:

```
/packages
  /frontend
  /backend
  /common
```

---

## How to structure a package itself

Three elements matter: naming convention, distinct layers, and strict hierarchy.

### Naming convention

Consistency is essential. A typical structure:

```
/my-feature-name
  /assets
    logo.svg
  index.tsx
  test.tsx
  stories.tsx
  styles.tsx
  types.ts
  utils.ts
  hooks.tsx
```

For features with smaller components, use folders:

```
/my-feature-name
  index.tsx
  /header
    index.tsx
  /footer
    index.tsx
```

This folder approach optimizes copy-paste development: rename only the folder, and file names remain consistent.

### Layers within a package

A typical package requires distinct layers:

**"Data" layer:** Queries, mutations, and external data connections. Used only by UI layer.

**"Shared" layer:** Utilities, functions, hooks, mini-components, types, and constants used across the package. Depends on nothing.

**"UI" layer:** Feature implementation. Depends on data and shared layers.

Implementation structure:

```
/my-feature-package
  /shared
  /ui
  /data
  index.ts
  package.json
```

For complex packages, split further:

```
/my-feature-package
  /shared-ui
  /ui
  /queries
  /mutations
  /types
  index.ts
  package.json
```

The key is clearly defining each sub-layer's purpose and explaining it to the team.

### Strict hierarchy within layers

Within layers (especially UI), maintain strict hierarchy:

- Only main files (index.ts) can have sub-components and import them
- Import only from direct children, not siblings
- Don't skip hierarchy levels

This creates a tree structure where branches are independent:

```
/my-page
  /shared
    send-feedback.ts
  /ui
    index.ts
    /header
      index.ts
      search-bar.ts
    /footer
      index.ts
  /data
    get-something.ts
    send-something.ts
```

Benefits:

- Clear encapsulation and predictability
- Easy refactoring (drag-and-drop folders)
- Forces splitting when packages become too large
- Code shared between branches automatically extracts to shared layer

---

## React recommends against nesting

React's documentation suggests limiting nesting to 3-4 folders maximum within a single project. This guideline applies here: excessive nesting signals the need to split packages further.

However, the monorepo advantage is that physical location doesn't matter. A package named `@project/change-setting-dialog` works identically whether located at:
- `packages/change-settings-dialog`
- `/packages/product/features/settings-page/change-setting-dialog`

Both are imported as `@project/change-setting-dialog`.

---

## Monorepo management tool

### Dependency management challenge

When multiple packages use the same external dependency (like lodash), version conflicts arise. Traditional npm/yarn install multiple copies, increasing build times and bundle sizes.

### Private repository solution

For private repositories, only basic package aliasing is needed. Both Yarn and npm support "workspaces"—built-in symlinking:

Root `package.json`:

```json
{
  "private": true,
  "workspaces": ["packages/**"]
}
```

Run `yarn install` to symlink all packages. They become accessible by name.

### Dependency hoisting

When multiple packages use identical dependency versions:

```
/packages
  /my-feature-one
    package.json // lodash@3.4.5
  /my-other-feature
    package.json // lodash@3.4.5
```

Yarn hoists to root `node_modules`:

```
/node_modules
  lodash@3.4.5
/packages
  /my-feature-one
  /my-other-feature
```

**Practical approach:** Declare all dependencies in the root `package.json`. Keep local package.json files minimal with only "name" and "main" fields. This simplifies management significantly.

---

## React project structure for scale: final overview

### Key principles recap

**Decomposition:** Think of projects as independent features with their own public APIs, not monolithic applications.

**Monorepo architecture:** Extract features into packages; organize packages to fit your project structure.

**Layers:** Use at least data, UI, and shared layers with clear boundaries.

**Hierarchical structure:** Organize within layers as trees where branches are independent, making refactoring effortless.

**Dependency management:** For private projects, simplify by centralizing dependencies in root `package.json`.

### Implementation reference

Example repository: https://github.com/developerway/example-react-project

This demonstrates the principles described, though packages are intentionally small for clarity.
