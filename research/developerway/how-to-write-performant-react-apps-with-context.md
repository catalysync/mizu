---
title: "How to Write Performant React Apps with Context"
url: https://www.developerway.com/posts/how-to-write-performant-react-apps-with-context
date: 2022-02-07
slug: how-to-write-performant-react-apps-with-context
---

# How to Write Performant React Apps with Context

**Published:** 07-02-2022 by Nadia Makarevich

## Overview

This article demystifies React Context and provides practical patterns for minimizing re-renders while improving code readability and scalability. The author addresses common misconceptions about Context being a performance killer and demonstrates that with proper architecture, it can enable highly performant applications.

## Let's Implement a Form in React

The article walks through building a multi-section form with:
- Personal information section (name, country selection)
- Value calculation section (discount settings)
- Actions section (save button)

### Initial Implementation Challenge

With prop drilling across nested components, typing in an input field causes the entire component tree to re-render:

```
Form render
PersonalInfoSection render
DiscountSituation render
NameFormComponent render
SelectCountryFormComponent render
ValueCalculationsSection render
DiscountFormComponent render
ActionsSection render
```

This cascade occurs because state changes propagate upward, triggering parent re-renders, which cascade downward to all children.

## Adding Context to the Form

Extracting state into a Context provider eliminates intermediate prop passing:

```typescript
type Context = {
  state: State;
  onNameChange: (name: string) => void;
  onCountryChange: (country: Country) => void;
  onDiscountChange: (price: number) => void;
  onSave: () => void;
};

const FormContext = createContext<Context>({} as Context);
```

Components access data directly via hooks rather than through props, reducing unnecessary re-renders in intermediate components.

## Splitting State and API

The breakthrough optimization separates data context from action context:

```typescript
const FormDataContext = createContext<State>({} as State);
const FormAPIContext = createContext<API>({} as API);
```

Using `useReducer` instead of `useState` allows the API object to remain constant across re-renders:

```typescript
const api = useMemo(() => {
  const onDiscountChange = (discount: number) => {
    dispatch({ type: 'updateDiscount', discount });
  };
  // API stays constant without state dependency
  return { onSave, onDiscountChange, onNameChange, onCountryChange };
}, []); // empty dependency array!
```

Components consuming only API callbacks never re-render on state changes. Result: typing triggers only the name input component to re-render.

## Splitting State Further

For maximum granularity, separate state into individual contexts:

```typescript
const FormNameContext = createContext<State['name']>({} as State['name']);
const FormCountryContext = createContext<State['country']>({} as State['country']);
const FormDiscountContext = createContext<State['discount']>({} as State['discount']);
```

Now the SelectCountryComponent re-renders only when country changes, not on name input changes.

## Bonus: External State Management

The architectural patterns work seamlessly with Redux or other state management libraries. The key insight: "Context is not a mystery anymore... you can easily write performant apps with just pure Context if there is a need."

Migrating to Redux requires only swapping context providers for Redux store and converting hooks to use selectors and dispatch—the component structure remains unchanged.

## Key Takeaways

1. Context alone doesn't cause performance issues; the component architecture determines performance
2. Splitting state and API into separate contexts enables selective re-rendering
3. Components consuming only callbacks avoid re-renders from data changes
4. The pattern provides architecture flexibility to migrate between state management solutions
