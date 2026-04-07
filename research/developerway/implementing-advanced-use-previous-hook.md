---
title: "Implementing Advanced usePrevious Hook with React useRef"
url: https://www.developerway.com/posts/implementing-advanced-use-previous-hook
date: 2022-03-21
slug: implementing-advanced-use-previous-hook
---

# Implementing Advanced usePrevious Hook with React useRef

**Published:** 21-03-2022 | **Author:** Nadia Makarevich

## Overview

This article explores how React refs work beyond DOM attachment and demonstrates implementing an advanced `usePrevious` hook to track previous state or prop values.

## Part 1: Understanding Refs

Refs offer a third option for data storage alongside variables and state:

- **Variables**: Don't trigger re-renders; recalculated on each render
- **State**: Triggers re-renders; persists between renders
- **Refs**: Don't trigger re-renders; persist between renders

### The Core Concept

A ref merges variable and state behavior—it preserves values across renders without causing component updates. Access stored values via `ref.current`.

## Part 2: Standard usePrevious from React Docs

The React documentation suggests:

```tsx
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
```

### The Problem

When using this implementation with multiple state changes, the hook returns "the value from the previous render cycle," not the actual previous value. If a parent component re-renders for unrelated reasons, the returned value updates unexpectedly.

## Part 3: Advanced usePreviousPersistent Hook

A more reliable implementation stores both current and previous values:

```tsx
export const usePreviousPersistent = (value) => {
  const ref = useRef({
    value: value,
    prev: null,
  });

  const current = ref.current.value;

  if (value !== current) {
    ref.current = {
      value: value,
      prev: current,
    };
  }

  return ref.current.prev;
};
```

**Advantages:**
- Returns the actual previous value
- No unwanted re-renders from unrelated parent changes
- Simpler than the standard implementation

## Part 4: Handling Objects and Complex Values

For object comparisons, the hook needs a custom equality function to avoid constantly detecting changes:

```tsx
export const usePreviousPersistent = (value, isEqualFunc) => {
  // ... same implementation

  if (isEqualFunc ? !isEqualFunc(value, current) : value !== current) {
    // update ref
  }

  return ref.current.prev;
};
```

### Usage Example

```tsx
const prevData = usePrevious(
  data,
  (prev, current) => prev.id === current.id
);
```

This approach avoids expensive deep equality checks while supporting custom comparison logic.

## Key Takeaways

- Refs preserve values without triggering re-renders
- Standard `usePrevious` returns values from the previous render cycle, not actual previous values
- The persistent implementation provides more predictable behavior
- Custom equality functions handle complex data types efficiently
