---
title: "Typescript Generics for React Developers"
url: https://www.developerway.com/posts/typescript-generics-for-react-developers
date: 2021-11-25
slug: typescript-generics-for-react-developers
---

# Typescript Generics for React Developers

**Date:** 25-11-2021
**Author:** Nadia Makarevich

## Introduction

The author expresses frustration with TypeScript documentation's complexity, stating the goal is to "re-write typescript documentation in a way that is actually understandable by a casual reader." The article uses a bottom-up approach, introducing generics only when needed.

## Intro: Judi's Online Shop

The narrative centers on Judi, an ambitious developer building an Amazon competitor. She needs to implement reusable select components for multiple product categories.

### Initial Simple Implementation

```typescript
import React from 'react';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  onChange: (value: string) => void;
};

export const Select = ({ options, onChange }: SelectProps) => {
  return (
    <select onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
```

### Problems Encountered

As the shop grew, three critical issues emerged:

1. **Data conversion overhead** - Options required specific formatting, causing conversion code to spread throughout the application
2. **Limited information return** - The onChange handler returned only IDs, necessitating manual array filtering
3. **Type safety failures** - Handlers could be accidentally mismatched with option sets, causing runtime failures

## Refactoring Strategy

Judi aimed to create a select component that:

- Transforms typed arrays into select options automatically
- Returns complete typed values from onChange callbacks
- Maintains type-safety between options and handlers

### Data Types

```typescript
export type Book = {
  id: string;
  title: string;
  author: string;
};

export type Movie = {
  id: string;
  title: string;
  releaseDate: string;
};
```

## First Attempt: Book-Specific Select

```typescript
type BookSelectProps = {
  values: Book[];
  onChange: (value: Book) => void;
};

export const BookSelect = ({ values, onChange }: BookSelectProps) => {
  const onSelectChange = (e) => {
    const val = values.find((value) => value.id === e.target.value);
    if (val) onChange(val);
  };

  return (
    <select onChange={onSelectChange}>
      {values.map((value) => (
        <option key={value.id} value={value.id}>
          {value.title}
        </option>
      ))}
    </select>
  );
};
```

### Union Type Limitation

Using union types (`Book | Movie`) fails because TypeScript cannot determine the exact type within the onChange callback. The author notes: "typescript doesn't actually know what exactly is passed in the onChange callback."

## Generic Solution

### Understanding Generics

Generics function as type placeholders. A basic example:

```typescript
function identity<Type>(a: Type): Type {
  return a;
}
```

This pattern allows specifying the type later:

```typescript
const a = identity<string>("I'm a string");
const b = identity<boolean>(false);
```

### Generic Constraints

Constraints narrow generic types. The solution requires ensuring the generic type has `id` and `title` properties:

```typescript
type Base = {
  id: string;
  title: string;
};

type GenericSelectProps<TValue> = {
  values: TValue[];
  onChange: (value: TValue) => void;
};

export const GenericSelect = <TValue extends Base>({
  values,
  onChange
}: GenericSelectProps<TValue>) => {
  const onSelectChange = (e) => {
    const val = values.find((value) => value.id === e.target.value);
    if (val) onChange(val);
  };

  return (
    <select onChange={onSelectChange}>
      {values.map((value) => (
        <option key={value.id} value={value.id}>
          {value.title}
        </option>
      ))}
    </select>
  );
};
```

### Usage

```typescript
<GenericSelect<Book> onChange={(value) => console.log(value.author)} values={books} />
<GenericSelect<Movie> onChange={(value) => console.log(value.releaseDate)} values={movies} />
```

## React Hooks Bonus

React hooks like `useState` are generics themselves. Explicit typing prevents accidental misuse:

**Unsafe:**
```typescript
const [book, setBook] = useState();
const [movie, setMovie] = useState();
```

**Type-safe:**
```typescript
const [book, setBook] = useState<Book | undefined>(undefined);
const [movie, setMovie] = useState<Movie | undefined>(undefined);
```

## Conclusion

The article demonstrates how generics enable creating truly reusable, type-safe React components while maintaining clean, maintainable code architecture.
