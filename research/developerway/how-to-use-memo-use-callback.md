---
title: "How to useMemo and useCallback: you can remove most of them"
url: https://www.developerway.com/posts/how-to-use-memo-use-callback
date: 2022-06-13
slug: how-to-use-memo-use-callback
---

# How to useMemo and useCallback: you can remove most of them

**Date:** 13-06-2022
**Author:** Nadia Makarevich

---

## Introduction

Most React developers are familiar with `useMemo` and `useCallback` hooks, but their widespread use often becomes problematic. The author argues that "you can probably remove 90% of all `useMemo` and `useCallbacks` in your app right now, and the app will be fine."

Two major sources drive unnecessary hook usage:
- Memoizing props to prevent re-renders
- Memoizing values to avoid expensive calculations

---

## Why do we need useMemo and useCallback?

These hooks provide **memoization between re-renders**. They cache values during initial render and return the same reference during consecutive renders.

```js
const a = { "test": 1 };
const b = { "test": 1 };
console.log(a === b); // false

const c = a;
console.log(a === c); // true
```

**Critical insight:** Both hooks are useful only during re-renders. During initial render, they add overhead, making the app slightly slower.

### Example with useEffect dependency:

```tsx
const Component = () => {
  const a = { test: 1 };

  useEffect(() => {
    // "a" gets compared between re-renders
  }, [a]);
};
```

Without memoization, `a` is recreated on every render, triggering `useEffect` unnecessarily.

**Solution with useMemo:**

```tsx
const Component = () => {
  const a = useMemo(() => ({ test: 1 }), []);

  useEffect(() => {
    // triggers only when "a" actually changes
  }, [a]);
};
```

---

## Memoizing props to prevent re-renders

**Common but problematic patterns:**

```tsx
// Pattern 1: Wrapping onClick in useCallback
const Component = () => {
  const onClick = useCallback(() => {
    /* do something */
  }, []);

  return <button onClick={onClick}>Click me</button>;
};
```

```tsx
// Pattern 2: Memoizing both props and callbacks
const Item = ({ item, onClick, value }) =>
  <button onClick={onClick}>{item.name}</button>;

const Component = ({ data }) => {
  const value = { a: someStateValue };
  const onClick = useCallback(() => {
    /* do something */
  }, []);

  return (
    <>
      {data.map((d) => (
        <Item item={d} onClick={onClick} value={value} />
      ))}
    </>
  );
};
```

**The problem:** These hooks are "useless, unnecessarily complicate code, slow down initial render."

---

## Why a component can re-render itself?

The misconception: "Component re-renders when state or prop value changes"

**The reality:** A component re-renders when its parent re-renders. This triggers re-renders of all children.

```tsx
const App = () => {
  const [state, setState] = useState(1);

  return (
    <div className="App">
      <button onClick={() => setState(state + 1)}>
        click to re-render {state}
      </button>
      <Page />
    </div>
  );
};

const Page = () => <Item />;
```

When the button is clicked, `App` re-renders, triggering `Page` and `Item` to re-render as well—regardless of their props.

### Interrupting the re-render chain with React.memo

Only `React.memo` stops downstream re-renders (by comparing props):

```tsx
const PageMemoized = React.memo(Page);

const App = () => {
  const [state, setState] = useState(1);
  const onClick = () => {
    console.log('Do something on click');
  };

  return (
    // PageMemoized WILL re-render because onClick is not memoized
    <PageMemoized onClick={onClick} />
  );
};
```

With memoized props:

```tsx
const PageMemoized = React.memo(Page);

const App = () => {
  const [state, setState] = useState(1);
  const onClick = useCallback(() => {
    console.log('Do something on click');
  }, []);

  return (
    // PageMemoized will NOT re-render because onClick is memoized
    <PageMemoized onClick={onClick} />
  );
};
```

**Key takeaway:** Memoizing props only prevents re-renders when the component itself AND every single prop are memoized.

### When to remove useMemo/useCallback on props:

Remove them if they are:
- Passed to DOM elements
- Passed to non-memoized components
- Passed to memoized components with at least one unmemoized prop

---

## Avoiding expensive calculations on every render

Performance measurement reveals a critical insight. Sorting 250 countries with `orderBy` takes **less than 2 milliseconds**, while rendering the list takes **over 20 milliseconds**.

```tsx
const List = ({ countries }) => {
  const before = performance.now();
  const sortedCountries = orderBy(countries, 'name', sort);
  const after = performance.now() - before; // ~2ms

  return (
    <>
      {sortedCountries.map((country) => (
        <Item country={country} key={country.id} />
      ))}
    </>
  );
};
```

**Better approach:** Memoize the render tree, not the calculation:

```tsx
const List = ({ countries }) => {
  const content = useMemo(() => {
    const sortedCountries = orderBy(countries, 'name', sort);
    return sortedCountries.map((country) =>
      <Item country={country} key={country.id} />
    );
  }, [countries, sort]);

  return content;
};
```

This optimization reduces rendering time from ~20ms to under 2ms.

### Rule for expensive operations:

"Unless you're calculating factorials of big numbers, remove `useMemo` on all pure JavaScript operations. Re-rendering children will always be your bottleneck."

**Cost-benefit analysis:** Memoization adds overhead during initial render (happens once). Re-renders are often localized and less frequent. Adding hundreds of memoizations compounds the initial render cost, potentially adding 10-100ms total.

---

## Summary

- `useCallback` and `useMemo` help only during re-renders; they harm initial render
- Props memoization alone doesn't prevent re-renders
- Only memoize when the component and ALL props are memoized
- Focus on memoizing expensive render trees, not JavaScript operations
- Always measure performance before optimizing

**Final note:** These hooks should be your last optimization resort. Try composition patterns and other techniques first.
