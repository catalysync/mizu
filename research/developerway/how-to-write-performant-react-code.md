---
title: "How to Write Performant React Code: Rules, Patterns, Do's and Don'ts"
url: https://www.developerway.com/posts/how-to-write-performant-react-code
date: 2022-01-09
slug: how-to-write-performant-react-code
---

# How to Write Performant React Code: Rules, Patterns, Do's and Don'ts

**Published:** 09-01-2022
**Author:** Nadia Makarevich

---

## Introduction

The article challenges the conventional wisdom about React performance optimization. Rather than waiting for problems to manifest, the author argues that understanding a few key patterns enables developers to write performant code from the start. The focus centers on reducing unnecessary re-renders, which account for roughly 90% of React performance issues.

## App Structure Overview

The article uses a real-world example: a settings page for an online shop where users select and save their country preference. The interface includes:

- A country list on the left with "saved" and "selected" states
- Detailed country information on the right
- Dark mode support

The proposed component structure:
- **Page**: Root component handling selection and save logic
- **CountriesList**: Renders the country list
- **Item**: Individual country entry
- **SelectedCountry**: Displays detailed information with save button

## Rule #1: useCallback Misconception

A common misunderstanding exists about `useCallback`'s purpose. Many developers use it believing it prevents child component re-renders when props change. However, as the article explains: "If the only reason you want to extract your inline functions in props into useCallback is to avoid re-renders of children components: don't. It doesn't work."

**Why it fails:** Parent re-renders cascade to children regardless of prop changes or callback memoization. The parent's state update triggers child re-renders automatically.

**Solution:** Use `useMemo` to cache JSX sections that don't depend on changed state:

```javascript
const list = useMemo(() => {
  return (
    <CountriesList
      countries={countries}
      onCountryChanged={(c) => setSelectedCountry(c)}
      savedCountry={savedCountry}
    />
  );
}, [savedCountry, countries]);
```

## Rule #2: Separate State-Dependent Components

When a component manages multiple state values, identify render tree portions independent of specific state changes. Extract and memoize these sections to prevent unnecessary re-renders of unaffected children.

```javascript
const selected = useMemo(() => {
  return (
    <SelectedCountry
      country={selectedCountry}
      onCountrySaved={() => setSavedCountry(selectedCountry)}
    />
  );
}, [selectedCountry]);
```

## Rule #3: Never Create Components During Render

Defining components inside another component's render function causes complete re-mounting on every parent render—far more expensive than re-rendering. This destroys component state, triggers all `useEffect` hooks with empty dependencies, and loses DOM focus.

**Bad:**
```javascript
const CountriesList = ({ countries }) => {
  const Item = ({ country }) => {
    return <button>{country.name}</button>;
  };
  return countries.map(country => <Item key={country.id} country={country} />);
};
```

**Good:**
```javascript
const Item = ({ country }) => {
  return <button>{country.name}</button>;
};

const CountriesList = ({ countries }) => {
  return countries.map(country => <Item key={country.id} country={country} />);
};
```

## Rule #4: Memoize Context Provider Values

Context consumers re-render whenever provider values change. If passing object literals as context values, they get new references on every render, triggering unnecessary consumer re-renders even with memoization elsewhere.

**Bad:**
```javascript
<ThemeContext.Provider value={{ mode }}>
  {/* children */}
</ThemeContext.Provider>
```

**Good:**
```javascript
const theme = useMemo(() => ({ mode }), [mode]);
<ThemeContext.Provider value={theme}>
  {/* children */}
</ThemeContext.Provider>
```

## useCallback: When It Actually Matters

The article's bonus section clarifies `useCallback`'s legitimate use cases:

1. **With React.memo:** When components wrapped in `React.memo` use callbacks as dependencies
2. **In hook dependencies:** When `useEffect`, `useMemo`, or `useCallback` hooks depend on callback stability

These are specific optimization scenarios, not general solutions for preventing re-renders.

## Performance Comparison

The author implemented both optimized and unoptimized versions of the app as working examples. The non-optimized version exhibits noticeable lag even with simple interactions, while the optimized version remains responsive even under 6x CPU throttling.

## Key Takeaways

- Re-renders happen due to state changes, parent re-renders, context value changes, or hook changes—not simply prop changes
- Breaking expensive render trees into memoized sections prevents cascading unnecessary updates
- Component creation during render is the heaviest performance cost
- Context requires careful value handling to maintain memoization benefits elsewhere

---

## Related Concepts

The article references several interconnected topics: React reconciliation, component composition patterns, and the technical underpinnings of how React identifies which elements have changed between renders.
