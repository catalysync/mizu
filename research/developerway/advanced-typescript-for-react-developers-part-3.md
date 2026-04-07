---
title: "Advanced TypeScript for React Developers - Part 3"
url: https://www.developerway.com/posts/advanced-typescript-for-react-developers-part-3
date: 2021-12-20
slug: advanced-typescript-for-react-developers-part-3
---

# Advanced TypeScript for React Developers - Part 3

**Published:** 20-12-2021
**Author:** Nadia Makarevich

## Introduction

This article continues the "Advanced TypeScript for React developers" series, building on previous discussions about generics and advanced type concepts. The focus shifts to exhaustiveness checking, type narrowing, and TypeScript enums while developing a category-based selection system.

## Exhaustiveness Checking with `never`

### Problem Setup

When working with switch statements on union types, TypeScript allows narrowing—eliminating type options as each case is handled. However, if a new type is added to a union but the switch case isn't updated, TypeScript won't catch the error.

### Solution: Using `never` Type

By explicitly assigning a `never` type in the default case, you force TypeScript to fail if any cases remain unhandled:

```typescript
const tabs = ["Books", "Movies", "Laptops", "Phones"] as const;

const confirmImpossibleState = (tab: never) => {
  throw new Error(`Reaching an impossible state because of ${tab}`);
};

const getSelect = (tab: Tab) => {
  switch (tab) {
    case "Books":
    case "Movies":
    case "Laptops":
    default:
      confirmImpossibleState(tab); // Fails if "Phones" isn't handled
  }
};
```

This pattern ensures all union members are exhaustively handled.

## Exhaustiveness Without `never`

The same principle applies to other patterns. For functions filtering through union types, you can "lock" the expected final type:

```typescript
const valueShouldBeString = (value: string) => value;

const formatLabel = (value: DataTypes) => {
  if (isBook(value)) return `${value.title}: ${value.author}`;
  if (isMovie(value)) return `${value.title}: ${value.releaseDate}`;
  if (isLaptop(value)) return value.model;

  return valueShouldBeString(value);
};
```

If any type remains unhandled before the final call, TypeScript will error.

## Improving Readability with Enums

### Traditional Approach (as const)

```typescript
const tabs = ["Books", "Movies", "Laptops"] as const;
type Tabs = typeof tabs;
type Tab = Tabs[number];
```

### Enum Alternative

```typescript
enum Tabs {
  'MOVIES' = 'Movies',
  'BOOKS' = 'Books',
  'LAPTOPS' = 'Laptops',
}

const movieTab = Tabs.MOVIES; // 'Movies'
const bookTab = Tabs.BOOKS;   // 'Books'
```

Enums provide more intuitive syntax while serving as both type and value simultaneously, reducing cognitive load compared to destructuring `typeof` and indexed access patterns.

## Key Concepts Reviewed

- **Type Narrowing:** Reducing union types through conditional checks
- **Exhaustiveness Checking:** Ensuring all union members are handled
- **Enums:** Named constant sets that are strongly typed from creation

The article includes working CodeSandbox examples demonstrating each pattern in a React component context.
