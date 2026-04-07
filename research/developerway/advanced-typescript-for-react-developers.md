---
title: "Advanced TypeScript for React Developers"
url: https://www.developerway.com/posts/advanced-typescript-for-react-developers
date: 2021-12-08
slug: advanced-typescript-for-react-developers
---

# Advanced TypeScript for React Developers

**Published:** 08-12-2021 by Nadia Makarevich

## Introduction

This article explores advanced TypeScript concepts for building reusable React components. The narrative follows Judi, an ambitious developer building an Amazon competitor, who needs to make her generic select component more flexible.

## Rendering Not Only Titles in Options

### The keyof Operator

The `keyof` operator generates a type from an object's keys. For a Laptop type with properties `id`, `model`, and `releaseDate`, `keyof Laptop` produces the union: `"id" | "model" | "releaseDate"`.

This enables type-safe prop passing where TypeScript catches incorrect attribute names:

```typescript
type Base = {
  id: string;
  title?: string;
};

type GenericSelectProps<TValue> = {
  titleKey: keyof TValue;
  values: TValue[];
  onChange: (value: TValue) => void;
};
```

## The List of Categories - Refactoring Select

### Supporting String Values with Type Guards

The component needed refactoring to accept both objects and strings. Three key changes were required:

**Step 1:** Convert `Base` to a union type:
```typescript
type Base = { id: string } | string;
```

**Step 2:** Implement a type guard function using `typeof`:

```typescript
const getStringFromValue = <TValue extends Base>(value: TValue) => {
  if (typeof value === 'string') {
    return value;
  }
  return value.id;
};
```

Within the `if` block, TypeScript narrows the type to `string`. Outside, it becomes `{ id: string }`.

**Step 3:** Pass a `formatLabel` function for customizable rendering:

```typescript
type GenericSelectProps<TValue> = {
  formatLabel: (value: TValue) => string;
  onChange: (value: TValue) => void;
  values: TValue[];
};
```

## The List of Categories - Implementation

### const Assertion and typeof Operator

To prevent typos in category names, use `as const`:

```typescript
const tabs = ['Books', 'Movies', 'Laptops'] as const;
type Tabs = typeof tabs;
type Tab = Tabs[number];
```

The `as const` assertion makes TypeScript treat the array as containing literal values ('Books' | 'Movies' | 'Laptops') rather than generic strings.

### Indexed Access Types

Extract individual array element types using bracket notation:

```typescript
type Tab = Tabs[number]; // 'Books' | 'Movies' | 'Laptops'
```

Similarly, access object properties:
```typescript
type LaptopId = Laptop['id']; // string
```

## Bonus: Type Predicates with the "is" Operator

When abstracting type guards into separate functions, use the `is` keyword:

```typescript
export const isStringValue = <TValue extends T>(
  value: TValue | string
): value is string => {
  return typeof value === 'string';
};
```

The pattern `argName is Type` tells TypeScript to narrow the type within conditional branches.

### Practical Example with Multiple Types

```typescript
export type DataTypes = Book | Movie | Laptop | string;

export const isBook = (value: DataTypes): value is Book => {
  return typeof value !== 'string' && 'id' in value && 'author' in value;
};

const formatLabel = (value: DataTypes) => {
  if (isBook(value)) return value.author;
  if (isMovie(value)) return value.releaseDate;
  if (isLaptop(value)) return value.model;
  return value;
};
```

## Summary

Key TypeScript concepts covered:

- **keyof**: Generates types from object keys
- **as const**: Treats values as immutable literals
- **typeof**: Extracts types from values
- **Indexed access** (`Type['attr']` or `Type[number]`): Accesses subtypes
- **Type predicates** (`argName is Type`): Manual type narrowing in functions

These techniques enable fully type-safe, reusable components without runtime errors or data normalization.
