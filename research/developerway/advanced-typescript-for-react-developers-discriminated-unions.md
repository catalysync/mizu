---
title: "Advanced TypeScript for React Developers - Discriminated Unions"
url: https://www.developerway.com/posts/advanced-typescript-for-react-developers-discriminated-unions
date: 2021-12-30
slug: advanced-typescript-for-react-developers-discriminated-unions
---

# Advanced TypeScript for React Developers - Discriminated Unions

**Published:** 30-12-2021 by Nadia Makarevich

## Overview

This article explores discriminated unions, a TypeScript pattern that creates type-safe unions with a common discriminant property. The technique improves type narrowing and prevents runtime errors in React applications.

## Discriminated Unions - Beginning

The author demonstrates improving a `formatLabel` function that handles multiple data types (Book, Movie, Laptop, Phone). Initially, the code uses type guard functions like `isMovie()` that perform expensive runtime checks on object properties.

**Better approach:** Add a unique discriminant property to each type:

```typescript
type Book = {
  __typename: "book";
  id: string;
  title: string;
  author: string;
};

type Movie = {
  __typename: "movie";
  id: string;
  title: string;
  releaseDate: string;
};
```

This creates a discriminated union where TypeScript can narrow types based on the `__typename` property, eliminating complex type guard functions and improving performance.

## Discriminated Unions with Data Fetching

A practical application involves managing async state with four mutually exclusive conditions:

```typescript
type PendingState = { status: 'pending' };
type LoadingState = { status: 'loading' };
type SuccessState = { status: 'success'; data: Book[] };
type ErrorState = { status: 'error'; error: any };

type State = PendingState | LoadingState | SuccessState | ErrorState;
```

Using a single `setState` instead of three separate state variables prevents invalid state combinations. TypeScript enforces that required properties match each status value.

**Key benefits:**
- Impossible to set both `loading: true` and have data simultaneously
- Consumer code cannot access undefined properties in wrong states
- Type narrowing within conditional branches

## Discriminated Unions in Component Props

The pattern extends to component props using literal types instead of booleans:

```typescript
interface SingleSelectProps<TValue> extends GenericSelectProps<TValue> {
  isMulti: false;
  onChange: (value: TValue) => void;
}

interface MultiSelectProps<TValue> extends GenericSelectProps<TValue> {
  isMulti: true;
  onChange: (value: TValue[]) => void;
}

export const GenericSelect = <TValue extends Base>(
  props: SingleSelectProps<TValue> | MultiSelectProps<TValue>
) => {
  // TypeScript knows onChange signature based on isMulti value
};
```

Using `false` and `true` as literal types instead of `boolean` links the onChange callback type to the isMulti value. The component must access props directly (not destructured) to maintain type correlation.

## Conclusion

Discriminated unions solve common TypeScript challenges by creating type-safe, mutually exclusive states that prevent logic errors and improve developer experience through better type inference.
